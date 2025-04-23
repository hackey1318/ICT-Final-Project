package com.ict.finalProject.movie.repository;

import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.Movies;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MoviesRepository extends JpaRepository<Movies, Integer> {

    List<Movies> findByOpenStatusIn(List<MovieStatus> statuses);

    Page<Movies> findByOpenStatusIn(List<MovieStatus> statuses, Pageable pageable);

    @Query("SELECT m FROM Movies AS m WHERE (:genre IS NULL OR m.genre LIKE %:genre%) AND (:searchDate IS NULL OR m.openDate <= :searchDate) AND m.openStatus IN (:statuses)")
    Page<Movies> searchMovies(@Param("genre") String genre, @Param("searchDate") LocalDate searchDate, @Param("statuses") List<MovieStatus> statuses, Pageable pageable);

    //Md 등록 시 영화이름검색을 위한
    List<Movies> findAllByNameContaining(String movieSearch);

    @Query("SELECT DISTINCT m.genre FROM Movies AS m WHERE m.no IN (:targetNoList)")
    List<String> getGenreByLike(@Param("targetNoList") List<Integer> targetNoList);

    @Query("SELECT m FROM Movies AS m WHERE (:name IS NULL OR m.name LIKE %:name%) AND m.openStatus IN (:statuses)")
    Page<Movies> searchMoviesByBanner(@Param("name") String name, @Param("statuses") List<MovieStatus> statuses, Pageable pageable);

    List<Movies> findByNoIn(List<Integer> ids);
}
