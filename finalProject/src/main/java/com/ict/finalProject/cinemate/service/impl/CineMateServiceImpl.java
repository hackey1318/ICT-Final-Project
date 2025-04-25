package com.ict.finalProject.cinemate.service.impl;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.controller.response.CineMateMemberResponse;
import com.ict.finalProject.cinemate.repository.CineMateChatRoomRepository;
import com.ict.finalProject.cinemate.repository.CineMateMemberRepository;
import com.ict.finalProject.cinemate.controller.response.CineMateResponse;
import com.ict.finalProject.cinemate.repository.CineMateRepository;
import com.ict.finalProject.cinemate.repository.domain.CineMateChatRooms;
import com.ict.finalProject.cinemate.repository.domain.CineMateMembers;
import com.ict.finalProject.cinemate.repository.domain.CineMates;
import com.ict.finalProject.cinemate.service.CineMateService;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.TheatersRepository;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.user.repository.domain.Likes;
import com.ict.finalProject.user.repository.domain.LikesRepository;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CineMateServiceImpl implements CineMateService {

    private final CineMateRepository cineMateRepository;
    private final CineMateMemberRepository cineMateMemberRepository;
    private final CineMateChatRoomRepository cineMateChatRoomRepository;
    private final MoviesRepository moviesRepository;
    private final TheatersRepository theatersRepository;
    private final UsersRepository usersRepository;
    private final LikesRepository likesRepository;

    @Override
    public boolean generateCineMateInfo(CineMateRequest request) {

        try {
            CineMates cineMate = cineMateRepository.save(CineMates.builder()
                    .userNo(request.getUserNo())
                    .theaterNo(request.getTheaterNo())
                    .movieNo(request.getMovieNo())
                    .content(request.getContent())
                    .maxMemberCount(request.getMaxMemberCount())
                    .meetingDate(request.getMeetingDate())
                    .status(StatusInfo.ACTIVE).build());

            cineMateMemberRepository.save(CineMateMembers.builder()
                    .cineMateNo(cineMate.getNo())
                    .userNo(request.getUserNo())
                    .status(StatusInfo.ACTIVE).build());

            cineMateChatRoomRepository.save(CineMateChatRooms.builder()
                    .cineMateNo(cineMate.getNo())
                    .status(StatusInfo.ACTIVE).build());
            return true;
        } catch (Exception e) {

            return false;
        }
    }

    //시네메이트 영화 목록
    @Override
    public Page<CineMateResponse> getCineMateMovies(Pageable pageable) {
        // 정렬 정보가 있는 경우, 제거
        Pageable sanitized = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());

        Page<Object[]> results = cineMateRepository.findDistinctMovieInfo(sanitized);

        return results.map(result -> {
            Integer movieNo = (Integer) result[0];
            String movieName = (String) result[1];
            LocalDate openDate = ((java.sql.Date) result[2]).toLocalDate();
            String postImage = (String) result[3];
            String ageGrade = (String) result[4];

            return CineMateResponse.builder()
                    .movieNo(movieNo)
                    .movieName(movieName)
                    .openDate(openDate)
                    .postImage(postImage)
                    .ageGrade(ageGrade)
                    .build();
        });
    }

    //시네메이트 영화 상세
    @Override
    public List<CineMateResponse> getMovieDetail(Integer movieNo) {
        List<Object[]> results = cineMateRepository.getMovieDetail(movieNo);

        if (results.isEmpty()) {
            throw new RuntimeException("영화 정보를 찾을 수 없습니다.");
        }

        List<CineMateResponse> responseList = new ArrayList<>();

        for (Object[] result : results) {

            CineMateResponse response = CineMateResponse.builder()
                    .no((Integer) result[0])
                    .movieNo((Integer) result[4])
                    .maxMemberCount((Integer) result[2])
                    .meetingDate(result[3] != null ? ((Timestamp) result[3]).toLocalDateTime() : null)
                    .createdAt(result[1] != null ? ((Timestamp) result[1]).toLocalDateTime() : null)
                    .content((String) result[8])
                    .ageGrade((String) result[9])
                    .director((String) result[11])
                    .movieName((String) result[12])
                    .openDate(result[13] != null ? ((Date) result[13]).toLocalDate() : null)
                    .postImage((String) result[14])
                    .genre((String) result[15])
                    .description((String) result[10])
                    .userNo((Integer) result[16])
                    .currentMemberCount(Math.toIntExact(cineMateMemberRepository.countByCineMateNoAndStatusActive((Integer) result[0])))
                    .theaterName(
                            theatersRepository.findById((Integer) result[5])
                                    .orElseThrow(() -> new RuntimeException("해당 극장이 존재하지 않습니다."))
                                    .getName()
                    )
                    .userName(
                            usersRepository.findById((Integer) result[7])
                                    .orElseThrow(() -> new RuntimeException("해당 유저가 존재하지 않습니다."))
                                    .getNickname()
                    )
                    .build();

            responseList.add(response);
        }

        return responseList;
    }

    @Override
    public boolean getJoinMovieRoom(Integer cineMateNo, Integer movieNo, Integer userNo) {
        CineMateMembers cineMateMember = cineMateMemberRepository.findByCineMateNoAndUserNoAndStatus(cineMateNo, userNo, StatusInfo.ACTIVE);
        return cineMateMember != null;
    }

    @Override
    @Transactional
    public boolean joinMovieRoom(Integer cineMateNo, Integer movieNo, Integer userNo) {
        CineMateMembers cineMateMember = cineMateMemberRepository.findByCineMateNoAndUserNo(cineMateNo, userNo);
        if (cineMateMember == null) {
            // 참여 내역이 없음.
            cineMateMember = CineMateMembers.builder()
                    .cineMateNo(cineMateNo)
                    .userNo(userNo)
                    .status(StatusInfo.ACTIVE).build();
        } else if (!StatusInfo.ACTIVE.equals(cineMateMember.getStatus())) {
            cineMateMember.participate();
        } else {
            log.error("Join Cinemate error : [이미 참여중인 사용자[{}]입니다.]", userNo);
            return false;
        }
        cineMateMemberRepository.save(cineMateMember);
        return true;
    }

    @Override
    @Transactional
    public boolean cancelJoinMovieRoom(Integer cineMateNo, Integer movieNo, Integer userNo) {

        try {

            CineMateMembers cineMateMember = cineMateMemberRepository.findByCineMateNoAndUserNoAndStatus(cineMateNo, userNo, StatusInfo.ACTIVE);
            if (cineMateMember == null) {
                // 참여 내역이 없음.
            }
            cineMateMember.cancel();
            cineMateMemberRepository.save(cineMateMember);
            return true;
        } catch (Exception e) {
            log.error("Cancel Cinemate error : [{}]", e.getMessage());
            return false;
        }
    }

    @Override
    public List<CineMateMemberResponse> getCineMateMember(Integer cineMateNo, Integer userNo) {

        Map<Integer, CineMateMemberResponse> memberMap = cineMateMemberRepository.getCineMateMemberInfo(cineMateNo).stream()
                .collect(Collectors.toMap(CineMateMemberResponse::getUserNo, Function.identity()));

        List<Likes> userLikes = likesRepository.findByUserNoAndType(userNo, LikeType.USER);
        for (Likes like : userLikes) {
            Integer targetNo = like.getTargetNo();
            if (memberMap.containsKey(targetNo)) {
                memberMap.get(targetNo).setLiked(true);
            }
        }
        CineMateMemberResponse cineMateMemberResponse =  memberMap.get(userNo);
        if (cineMateMemberResponse!= null) {
            cineMateMemberResponse.setMe(true);
        }

        return new ArrayList<>(memberMap.values());
    }

    @Override
    public Integer getCineMateMemberCount(Integer cineMateNo) {

        return Math.toIntExact(cineMateMemberRepository.countByCineMateNoAndStatusActive(cineMateNo));
    }
}
