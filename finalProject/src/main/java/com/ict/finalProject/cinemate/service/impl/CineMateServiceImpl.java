package com.ict.finalProject.cinemate.service.impl;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.repository.CineMateChatRoomRepository;
import com.ict.finalProject.cinemate.repository.CineMateMemberRepository;
import com.ict.finalProject.cinemate.repository.CineMateRepository;
import com.ict.finalProject.cinemate.repository.domain.CineMateChatRooms;
import com.ict.finalProject.cinemate.repository.domain.CineMateMembers;
import com.ict.finalProject.cinemate.repository.domain.CineMates;
import com.ict.finalProject.cinemate.service.CineMateService;
import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CineMateServiceImpl implements CineMateService {

    private final CineMateRepository cineMateRepository;
    private final CineMateMemberRepository cineMateMemberRepository;
    private final CineMateChatRoomRepository cineMateChatRoomRepository;

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
}
