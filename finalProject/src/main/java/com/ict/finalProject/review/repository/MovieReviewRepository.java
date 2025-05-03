    package com.ict.finalProject.review.repository;

    import com.ict.finalProject.review.repository.domain.MovieReview;
    import com.ict.finalProject.review.service.dto.MovieReviewDto;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;
    import java.util.List;

    @Repository
    public interface MovieReviewRepository extends JpaRepository<MovieReview, Integer> {
        List<MovieReview> findByMovieNo(Integer movieNo);

        @Query("SELECT new com.ict.finalProject.review.service.dto.MovieReviewDto(mr.no AS no, mr.movieNo AS movieNo, m.postImage as postImage, mr.userNo AS userNo, mr.user AS user, mr.title AS title, mr.content AS content, mr.createdAt AS createdAt, mr.updatedAt AS updatedAt) FROM MovieReview AS mr LEFT JOIN Movies AS m ON mr.movieNo = m.no WHERE mr.userNo = :userNo")
        List<MovieReviewDto> findByUserNo(@Param("userNo") Integer userNo);
    }
