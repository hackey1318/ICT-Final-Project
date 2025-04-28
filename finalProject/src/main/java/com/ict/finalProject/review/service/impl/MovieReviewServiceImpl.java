package com.ict.finalProject.review.service.impl;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import java.util.Collections;

import com.ict.finalProject.fileSystem.service.FileSystemService;
import com.ict.finalProject.oauth.repository.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
import com.ict.finalProject.review.repository.MovieReviewRepository;
import com.ict.finalProject.review.repository.domain.MovieReview;
import com.ict.finalProject.review.service.MovieReviewService;
import com.ict.finalProject.review.controller.request.MovieReviewRequest;
import com.ict.finalProject.review.controller.response.MovieReviewResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class MovieReviewServiceImpl implements MovieReviewService {

    private final MovieReviewRepository reviewRepository;
    private final ImageInfoRepository imageInfoRepo;
    private final ModelMapper modelMapper;
    private final FileSystemService fileSystemService;
    private final UsersRepository usersRepository;


    @Override
    @Transactional
    public MovieReviewResponse writeReview(MovieReviewRequest request) {
        // 1) 리뷰 저장
        MovieReview saved = reviewRepository.save(
                MovieReview.builder()
                        .movieNo(request.getMovieNo())
                        .userNo(request.getUserNo())
                        .title(request.getTitle())
                        .content(request.getContent())
                        .build()
        );

        // 2) PENDING 레코드 생성
           fileSystemService.createPendingImageInfos(
                       request.getImageIds(),
                       saved.getNo(),
                       ImageWriteType.MOVIEREVIEW);

        // 3) PENDING → ACTIVE 링크
        if (request.getImageIds() != null && !request.getImageIds().isEmpty()) {
            imageInfoRepo.linkImagesToReview(
                    request.getImageIds(),
                    saved.getNo(),
                    ImageWriteType.MOVIEREVIEW
            );
        }

        // 4) DTO 변환 & ACTIVE 이미지만 조회
        MovieReviewResponse dto = modelMapper.map(saved, MovieReviewResponse.class);
        List<String> activeIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                saved.getNo(),
                ImageWriteType.MOVIEREVIEW,
                StatusInfo.ACTIVE
        );
        dto.setImageIds(activeIds);

        var user = usersRepository.findById(saved.getUserNo())
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + saved.getUserNo()));
        dto.setUserName(user.getNickname());
        dto.setUserProfileImage(user.getProfileImageUrl());

        return dto;
    }

    @Override
    @Transactional
    public List<MovieReviewResponse> getReviews(Integer movieNo) {
        return reviewRepository.findByMovieNo(movieNo).stream()
                .map(r -> {
                    // 1) 엔티티 → DTO 기본 매핑
                    MovieReviewResponse dto = modelMapper.map(r, MovieReviewResponse.class);

                    // 2) 이미지 아이디 세팅
                    List<String> activeIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                            r.getNo(), ImageWriteType.MOVIEREVIEW, StatusInfo.ACTIVE);
                    dto.setImageIds(activeIds);

                    // 3) 추가된 부분: 사용자 정보 채우기
                    var user = usersRepository.findById(r.getUserNo())
                            .orElseThrow(() -> new EntityNotFoundException("User not found: " + r.getUserNo()));
                    dto.setUserName(user.getNickname());
                    dto.setUserProfileImage(user.getProfileImageUrl());

                    return dto;
                })
                .toList();
    }


    @Override
    @Transactional
    public MovieReviewResponse updateReview(MovieReviewRequest request) {
        // 1) 기존 리뷰 로드·수정
        MovieReview existing = reviewRepository.findById(request.getNo())
                .orElseThrow(() -> new EntityNotFoundException("Review not found: " + request.getNo()));
        existing.setTitle(request.getTitle());
        existing.setContent(request.getContent());
        MovieReview saved = reviewRepository.save(existing);

        // 2) ACTIVE 상태였던 이미지 ID
        List<String> oldIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                saved.getNo(), ImageWriteType.MOVIEREVIEW, StatusInfo.ACTIVE);

        // 3) 클라이언트가 보낸 최신 이미지 ID 전체
        List<String> newIds = Optional.ofNullable(request.getImageIds())
                .orElse(Collections.emptyList());

        // 4) 삭제된(제거된) ID는 DELETE 처리
        for (String oldId : oldIds) {
            if (!newIds.contains(oldId)) {
                imageInfoRepo.updateImageStatus(oldId, ImageWriteType.MOVIEREVIEW, StatusInfo.DELETE);
            }
        }

        // 5) (★) 새로 추가된 ID만 골라서 Pending 레코드 생성
        List<String> addedIds = newIds.stream()
                .filter(id -> !oldIds.contains(id))
                .toList();
        if (!addedIds.isEmpty()) {
            fileSystemService.createPendingImageInfos(
                    addedIds,
                    saved.getNo(),
                    ImageWriteType.MOVIEREVIEW
            );
        }

        // 6) 남은(기존+새) ID 전부 ACTIVE 로 링크
        if (!newIds.isEmpty()) {
            imageInfoRepo.linkImagesToReview(
                    newIds,
                    saved.getNo(),
                    ImageWriteType.MOVIEREVIEW
            );
        }

        // 7) DTO 변환 & ACTIVE 이미지만 조회
        MovieReviewResponse dto = modelMapper.map(saved, MovieReviewResponse.class);
        List<String> finalIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                saved.getNo(), ImageWriteType.MOVIEREVIEW, StatusInfo.ACTIVE);
        dto.setImageIds(finalIds);

        // (기존에 추가하셨던) 사용자 정보 세팅
        usersRepository.findById(saved.getUserNo())
                .ifPresent(u -> {
                    dto.setUserName(u.getNickname());
                    dto.setUserProfileImage(u.getProfileImageUrl());
                });

        return dto;
    }

    @Override
    @Transactional
    public void deleteReview(Integer no) {
        if (!reviewRepository.existsById(no)) {
            throw new EntityNotFoundException("Review not found: " + no);
        }
        reviewRepository.deleteById(no);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieReviewResponse> getReviewsByUser(Integer userNo) {
        return reviewRepository.findByUserNo(userNo)    // JPA 메서드
                .stream()
                .map(r -> {
                    MovieReviewResponse dto = modelMapper.map(r, MovieReviewResponse.class);
                    // 이미지·유저 정보 세팅 로직 재사용
                    dto.setImageIds(imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                            r.getNo(), ImageWriteType.MOVIEREVIEW, StatusInfo.ACTIVE));
                    usersRepository.findById(r.getUserNo())
                            .ifPresent(u -> {
                                dto.setUserName(u.getNickname());
                                dto.setUserProfileImage(u.getProfileImageUrl());
                            });
                    return dto;
                })
                .toList();
    }
}
