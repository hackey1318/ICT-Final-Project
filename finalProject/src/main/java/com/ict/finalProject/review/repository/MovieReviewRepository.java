    package com.ict.finalProject.review.repository;

    import com.ict.finalProject.review.repository.domain.MovieReview;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.stereotype.Repository;
    import java.util.List;

    @Repository
    public interface MovieReviewRepository extends JpaRepository<MovieReview, Integer> {
        List<MovieReview> findByMovieNo(Integer movieNo);

    }
