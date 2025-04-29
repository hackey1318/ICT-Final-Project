package com.ict.finalProject.movie.repository.impl;

import com.ict.finalProject.movie.repository.MoviesCustomRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class MoviesCustomRepositoryImpl implements MoviesCustomRepository {

    private final EntityManager em;

    @Override
    public List<Movies> findPopularMoviesByGenres(Integer userNo, List<String> genres, int count) {
        // 장르 조건 생성
        String genreCondition = genres.stream()
                .map(g -> "m.genre LIKE :genre" + g)  // :genre1, :genre2 형태로 파라미터 바인딩
                .collect(Collectors.joining(" OR "));

        // 기본 SELECT 쿼리
        StringBuilder queryBuilder = new StringBuilder("""
        SELECT m.*
        FROM movies m
        LEFT JOIN (
            SELECT target_no, COUNT(*) AS like_count
            FROM likes
            WHERE type = 'MOVIE' AND status = 'ACTIVE'
            GROUP BY target_no
        ) l ON m.no = l.target_no
        WHERE (
    """);

        queryBuilder.append(genreCondition).append(")");

        // 사용자 번호가 존재하면 추가 조건 (찜한 영화 제외, 오픈 상태 필터링)
        if (userNo != null) {
            queryBuilder.append("""
            AND m.no NOT IN (
                SELECT target_no
                FROM likes
                WHERE user_no = :userNo AND type = 'MOVIE' AND status = 'ACTIVE'
            )
            AND m.open_status IN ('ACTIVE', 'PENDING')
        """);
        }

        // 정렬 및 제한
        queryBuilder.append("""
        ORDER BY COALESCE(l.like_count, 0) DESC
        LIMIT :limit
    """);

        // 쿼리 실행
        Query query = em.createNativeQuery(queryBuilder.toString(), Movies.class);
        if (userNo != null) {
            query.setParameter("userNo", userNo);
        }

        // 장르 파라미터 바인딩
        for (int i = 0; i < genres.size(); i++) {
            query.setParameter("genre" + i, "%" + genres.get(i) + "%");
        }

        query.setParameter("limit", count);

        return query.getResultList();
    }

    public Page<Movies> findRelateGenreMovieList(String[] genreList, Pageable pageable) {

        StringBuilder queryStr = new StringBuilder("SELECT m FROM Movies m WHERE ");
        String genreCondition = IntStream.range(0, genreList.length)
                .mapToObj(i -> "m.genre LIKE :genre" + i)
                .collect(Collectors.joining(" OR "));

        String finalQuery = queryStr + genreCondition;

        TypedQuery<Movies> query = em.createQuery(finalQuery, Movies.class);

        // 파라미터 바인딩
        for (int i = 0; i < genreList.length; i++) {
            query.setParameter("genre" + i, "%" + genreList[i] + "%");
        }

        // 페이지 번호와 페이지 크기를 설정
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();

        // 페이지네이션 적용: 첫 번째 인자는 시작 인덱스, 두 번째 인자는 페이지 크기
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        // 결과 반환
        long total = countMoviesByGenresWithLike(genreList);
        return new PageImpl<>(query.getResultList(), pageable, total);
    }

    // 장르 기반 영화의 전체 개수를 세는 메서드
    private long countMoviesByGenresWithLike(String[] genreList) {
        // 'LIKE' 조건을 동적으로 생성
        String genreCondition = IntStream.range(0, genreList.length)
                .mapToObj(i -> "m.genre LIKE :genre" + i)
                .collect(Collectors.joining(" OR "));

        // 전체 카운트를 위한 쿼리 작성
        String countQueryStr = "SELECT COUNT(m) FROM Movies m WHERE " + genreCondition;

        TypedQuery<Long> countQuery = em.createQuery(countQueryStr, Long.class);

        // 파라미터 바인딩
        for (int i = 0; i < genreList.length; i++) {
            countQuery.setParameter("genre" + i, "%" + genreList[i] + "%");
        }

        return countQuery.getSingleResult();
    }
}
