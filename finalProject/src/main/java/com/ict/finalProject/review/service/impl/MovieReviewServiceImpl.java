package com.ict.finalProject.review.service.impl;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.review.repository.MovieReviewRepository;
import com.ict.finalProject.review.repository.domain.MovieReview;
import com.ict.finalProject.review.service.MovieReviewService;
import com.ict.finalProject.review.controller.request.MovieReviewRequest;
import com.ict.finalProject.review.controller.response.MovieReviewResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieReviewServiceImpl implements MovieReviewService {

    private final MovieReviewRepository reviewRepository;
    private final ModelMapper modelMapper;
    private final MoviesRepository moviesRepository;
    private final UsersRepository usersRepository;
    private final ImageInfoRepository imageInfoRepo;


    @Override
    @Transactional
    public MovieReviewResponse writeReview(MovieReviewRequest request) {
        // 1) 리뷰 저장
        MovieReview toSave = MovieReview.builder()
                .movieNo(request.getMovieNo())
                .userNo(request.getUserNo())
                .title(request.getTitle())
                .content(request.getContent())
                .build();
        MovieReview saved = reviewRepository.save(toSave);

        // 2) 업로드된 이미지들 링크 (ImageInfo.boardNo, type 업데이트)
        if (request.getImageIds() != null && !request.getImageIds().isEmpty()) {
            int updatedCount = imageInfoRepo.linkImagesToReview( // 👈 반환값 저장
                    request.getImageIds(),
                    saved.getNo(),
                    ImageWriteType.MOVIEREVIEW
            );
            System.out.println(">> 이미지 링크된 row 수: " + updatedCount); // 👈 로그 출력
        }

        // 3) DTO 변환 및 이미지 ID 포함
        MovieReviewResponse dto = modelMapper.map(saved, MovieReviewResponse.class);
        List<ImageInfo> infos = imageInfoRepo.findAllByBoardNoAndType(saved.getNo(), ImageWriteType.MOVIEREVIEW);
        dto.setImageIds(infos.stream().map(ImageInfo::getImageId).collect(Collectors.toList()));
        System.out.println(">> 저장된 리뷰 ID: " + saved.getNo());
        System.out.println(">> 이미지 연결된 개수: " + dto.getImageIds().size());
        return dto;


    }

    @Override
    @Transactional(readOnly = true)
    public List<MovieReviewResponse> getReviews(Integer movieNo) {
        List<MovieReview> reviews = reviewRepository.findByMovieNo(movieNo);
        if (reviews.isEmpty()) return Collections.emptyList();

        return reviews.stream().map(r -> {
            MovieReviewResponse dto = modelMapper.map(r, MovieReviewResponse.class);
            List<ImageInfo> infos = imageInfoRepo.findAllByBoardNoAndType(r.getNo(), ImageWriteType.MOVIEREVIEW);
            dto.setImageIds(infos.stream().map(ImageInfo::getImageId).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());
    }


    @Override
    @Transactional
    public MovieReviewResponse updateReview(MovieReviewRequest request) {
        MovieReview existing = reviewRepository.findById(request.getNo())
                .orElseThrow(() -> new EntityNotFoundException("Review not found: " + request.getNo()));
        existing.setContent(request.getContent());
        MovieReview updated = reviewRepository.save(existing);
        return modelMapper.map(updated, MovieReviewResponse.class);
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
