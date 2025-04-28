package com.ict.finalProject.cinemate.repository;

import com.ict.finalProject.cinemate.controller.response.CineMateResponse;
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
            "m.age_grade, m.description, m.director, m.name, m.open_date, m.post_image, m.genre, c.user_no " +
            "from cine_mates c left join movies m on c.movie_no = m.no " +
            "where c.movie_no = :movieNo",
            nativeQuery = true
    )
    List<Object[]> getMovieDetail(@Param("movieNo") Integer movieNo);

    //시네메이트 영화관 목록
    @Query(value="SELECT c.theater_no, t.name " +
            "FROM cine_mates c " +
            "LEFT JOIN theaters t ON c.theater_no = t.no " +
            "GROUP BY c.theater_no, t.name;",
            nativeQuery = true)
    Page<Object[]> findDistinctTheaterInfo(Pageable pageable);

    //시네메이트 영화관 상세
    //해당 영화관에서 시네메이트 신청되어있는 영화관 번호, 영화 이름, 감독, 장르, 포스터 이미지, 등급, 개봉일, 미팅날짜, 작성일, 작성자, 작성내용, 최대인원
    @Query(value="select c.theater_no, m.name, m.director, m.genre, m.post_image, m.age_grade, m.open_date, " +
            "c.meeting_date, c.created_at, c.user_no, u.nickname, c.content, c.max_member_count " +
            "from cine_mates c " +
            "left join movies m on c.movie_no = m.no " +
            "left join users u on c.user_no = u.no " +
            "where c.theater_no = :theaterNo;",
            nativeQuery = true
    )
    List<Object[]> getTheaterDetail(@Param("theaterNo") Integer theaterNo);
}
