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

@Service
@RequiredArgsConstructor
public class MoviesCustomRepositoryImpl implements MoviesCustomRepository {

    private final EntityManager em;

    @Override
    public List<Movies> findPopularMoviesByGenres(Integer userNo, List<String> genres, int count) {
        String baseQuery = """
            SELECT m.*
            FROM movies m
            WHERE (
        """;

        String genreCondition = genres.stream()
                .map(g -> "m.genre LIKE '%" + g + "%'")
                .collect(Collectors.joining(" OR "));

        String restQuery = userNo == null ?
                """
                )
                ORDER BY (
                    SELECT COUNT(*)
                    FROM likes l
                    WHERE l.target_no = m.no
                    AND l.type = 'MOVIE'
                    AND l.status = 'ACTIVE'
                ) DESC
                LIMIT :limit
                """ :
                """
                )
                AND m.no NOT IN (
                    SELECT l.target_no
                    FROM likes l
                    WHERE l.user_no = :userNo
                    AND l.type = 'MOVIE'
                    AND l.status = 'ACTIVE'
                )
                AND m.open_status IN ('ACTIVE', 'PENDING')  -- 영화 상태가 ACTIVE 또는 PENDING인 경우만 조회
                ORDER BY (
                    SELECT COUNT(*)
                    FROM likes l
                    WHERE l.target_no = m.no
                    AND l.type = 'MOVIE'
                    AND l.status = 'ACTIVE'
                ) DESC
                LIMIT :limit
                """;

        String finalQuery = baseQuery + genreCondition + restQuery;

        Query query = em.createNativeQuery(finalQuery, Movies.class);
        if (userNo != null) {
            query.setParameter("userNo", userNo);
        }
        query.setParameter("limit", count);

        return query.getResultList();
    }

    public Page<Movies> findRelateGenreMovieList(String[] genreList, Pageable pageable) {

        StringBuilder queryStr = new StringBuilder("SELECT m FROM Movies m WHERE ");
        String genreCondition = List.of(genreList).stream()
                .map(g -> "m.genre LIKE :genre" + g)
                .collect(Collectors.joining(" OR "));

        String finalQuery = queryStr + genreCondition;

        TypedQuery<Movies> query = em.createQuery(finalQuery, Movies.class);

        // LIKE 검색 조건을 파라미터로 설정
        for (int i = 0; i < genreList.length; i++) {
            query.setParameter("genre" + genreList[i], "%" + genreList[i] + "%");
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
        String genreCondition = List.of(genreList).stream()
                .map(g -> "m.genre LIKE :genre" + g)
                .collect(Collectors.joining(" OR "));

        // 전체 카운트를 위한 쿼리 작성
        String countQueryStr = "SELECT COUNT(m) FROM Movies m WHERE " + genreCondition;

        TypedQuery<Long> countQuery = em.createQuery(countQueryStr, Long.class);

        // LIKE 검색 조건을 파라미터로 설정
        for (int i = 0; i < genreList.length; i++) {
            countQuery.setParameter("genre" + genreList[i], "%" + genreList[i] + "%");
        }

        return countQuery.getSingleResult();
    }
}
