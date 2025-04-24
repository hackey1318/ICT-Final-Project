package com.ict.finalProject.cinemate.repository;

import com.ict.finalProject.cinemate.repository.domain.CineMates;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CineMateRepository extends JpaRepository<CineMates, Integer> {

    //시네메이트 영화 목록
    @Query(
            value = "SELECT DISTINCT c.movie_no, m.name, m.open_date, m.post_image, m.age_grade FROM cine_mates AS c LEFT JOIN movies AS m ON c.movie_no = m.no;",
            countQuery = "SELECT COUNT(DISTINCT c.movie_no) FROM cine_mates c",
            nativeQuery = true
    )
    Page<Object[]> findDistinctMovieInfo(Pageable pageable);

    //시네메이트 영화 상세
    @Query(
            value="select c.no, c.created_at, c.max_member_count, c.meeting_date, c.movie_no, c.theater_no, c.updated_at, c.user_no, c.content, " +
            "m.age_grade, m.description, m.director, m.name, m.open_date, m.post_image, m.genre " +
            "from cine_mates c left join movies m on c.movie_no = m.no " +
            "where c.movie_no = :movieNo",
            nativeQuery = true
    )
    List<Object[]> getMovieDetail(@Param("movieNo") Integer movieNo);
}
