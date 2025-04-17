package com.ict.finalProject.movie.repository.impl;

import com.ict.finalProject.movie.repository.MoviesCustomRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
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
}
