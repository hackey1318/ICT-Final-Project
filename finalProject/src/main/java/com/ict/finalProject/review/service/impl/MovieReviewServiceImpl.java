package com.ict.finalProject.review.service.impl;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import java.util.Collections;

import com.ict.finalProject.fileSystem.service.FileSystemService;
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


@Service
@RequiredArgsConstructor
public class MovieReviewServiceImpl implements MovieReviewService {

    private final MovieReviewRepository reviewRepository;
    private final ImageInfoRepository imageInfoRepo;
    private final ModelMapper modelMapper;
    private final FileSystemService fileSystemService;


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
        fileSystemService.createPendingImageInfos(request.getImageIds());

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
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieReviewResponse> getReviews(Integer movieNo) {
        return reviewRepository.findByMovieNo(movieNo).stream()
                .map(r -> {
                    MovieReviewResponse dto = modelMapper.map(r, MovieReviewResponse.class);
                    // Status=ACTIVE 인 것만 조회
                    List<String> activeIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                            r.getNo(),
                            ImageWriteType.MOVIEREVIEW,
                            StatusInfo.ACTIVE
                    );
                    dto.setImageIds(activeIds);
                    return dto;
                }).toList();
    }


    @Override
    @Transactional
    public MovieReviewResponse updateReview(MovieReviewRequest request) {
        // 1) 리뷰 조회, 없으면 예외
        MovieReview existing = reviewRepository.findById(request.getNo())
                .orElseThrow(() ->
                        new EntityNotFoundException("Review not found: " + request.getNo())
                );
        existing.setTitle(request.getTitle());
        existing.setContent(request.getContent());
        MovieReview saved = reviewRepository.save(existing);

        // 2) 기존 ACTIVE 이미지 ID 리스트
        List<String> oldIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                saved.getNo(),
                ImageWriteType.MOVIEREVIEW,
                StatusInfo.ACTIVE
        );

        // 3) 요청에 담긴 새 이미지 ID 리스트
        List<String> newIds = request.getImageIds() != null
                ? request.getImageIds()
                : Collections.emptyList();

        // 4) 삭제된(빠진) ID는 DELETE 처리
        for (String oldId : oldIds) {
            if (!newIds.contains(oldId)) {
                imageInfoRepo.updateImageStatus(
                        oldId,
                        ImageWriteType.MOVIEREVIEW,
                        StatusInfo.DELETE
                );
            }
        }

        // 5) 남은/새 ID는 ACTIVE 링크
        if (!newIds.isEmpty()) {
            imageInfoRepo.linkImagesToReview(
                    newIds,
                    saved.getNo(),
                    ImageWriteType.MOVIEREVIEW
            );
        }

        // 6) DTO 변환 & ACTIVE 이미지만 조회
        MovieReviewResponse dto = modelMapper.map(saved, MovieReviewResponse.class);
        List<String> finalIds = imageInfoRepo.findImageIdsByBoardNoAndTypeAndStatus(
                saved.getNo(),
                ImageWriteType.MOVIEREVIEW,
                StatusInfo.ACTIVE
        );
        dto.setImageIds(finalIds);
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
}
