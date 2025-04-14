/*
package com.ict.finalProject.testCode;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ict.finalProject.movie.repository.MovieStillCutsRepository;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.MovieStillCuts;
import com.ict.finalProject.movie.repository.domain.Movies;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class CGVMovieCrawler {

    private final MoviesRepository moviesRepository;
    private final MovieStillCutsRepository movieStillCutsRepository;

//    @PostConstruct
    @Scheduled(cron = "0 10 0 * * *")
    public void crawlAndSyncAllMovies() {
        Map<Integer, Movies> allMoviesMap = moviesRepository.findAll()
                .stream()
                .collect(Collectors.toMap(Movies::getCode, m -> m));

        Map<Integer, Movies> existingMoviesMap = allMoviesMap.values().stream()
                .filter(m -> m.getOpenStatus() == MovieStatus.ACTIVE || m.getOpenStatus() == MovieStatus.PENDING)
                .collect(Collectors.toMap(Movies::getCode, m -> m));

        Set<Integer> updatedMovieCodes = new HashSet<>();

        crawlAndSyncMovies(existingMoviesMap, updatedMovieCodes, allMoviesMap);
        getMovieMore(existingMoviesMap, updatedMovieCodes, allMoviesMap);


        // CLOSE 처리
        for (Integer code : allMoviesMap.keySet()) {
            if (!updatedMovieCodes.contains(code)) {
                Movies movie = allMoviesMap.get(code);
                movie.updateStatus(MovieStatus.CLOSE);
                moviesRepository.save(movie);
                log.info("🔒 CLOSED: {}", movie.getName());
            }
        }
    }

    private void getMovieMore(Map<Integer, Movies> existingMoviesMap, Set<Integer> updatedCodes, Map<Integer, Movies> allMoviesMap) {
        String url = "http://www.cgv.co.kr/common/ajax/movies.aspx/GetMovieMoreList"
                + "?listType=1&orderType=1&filterType=0&_=" + System.currentTimeMillis();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        headers.set("Referer", "https://www.cgv.co.kr/movies/");
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) return;

            String jsonResponse = response.getBody();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonResponse);
            String dContent = root.path("d").asText();
            JsonNode parsedD = mapper.readTree(dContent);
            JsonNode movieList = parsedD.path("List");

            List<MovieStillCuts> stillCuts = new ArrayList<>();

            for (JsonNode movie : movieList) {
                int code = movie.path("MovieIdx").asInt();
                String detailUrl = "http://www.cgv.co.kr/movies/detail-view/?midx=" + code;
                MovieDetailDto detail = parseMovieDetail(detailUrl);

                String title = movie.path("Title").asText();
                String releaseDateStr = movie.path("OpenDate").asText();
                String reservationRate = movie.path("TicketRate").asText();
                String ageRating = movie.path("MovieGrade").path("GradeText").asText();
                String imageSrc = movie.path("PosterImage").path("MiddleImage").asText();

                LocalDate releaseDate;
                try {
                    releaseDate = LocalDate.parse(releaseDateStr, DateTimeFormatter.ofPattern("yyyy.MM.dd"));
                } catch (Exception e) {
                    releaseDate = LocalDate.now();
                }

                MovieStatus openStatus = releaseDate.isBefore(LocalDate.now()) || releaseDate.isEqual(LocalDate.now())
                        ? MovieStatus.ACTIVE
                        : MovieStatus.PENDING;

                Movies movieEntity = Movies.builder()
                        .code(code)
                        .name(title)
                        .director(detail.getDirector())
                        .description(detail.getSynopsis())
                        .openDate(releaseDate)
                        .openStatus(openStatus)
                        .reservationRate(reservationRate)
                        .postImage(imageSrc)
                        .genre(detail.getGenre())
                        .ageGrade(ageRating)
                        .externalLink(detailUrl) // <--- 이 부분 추가!
                        .build();

                saveOrUpdateMovie(code, movieEntity, detail, stillCuts, existingMoviesMap, allMoviesMap);
                updatedCodes.add(code);
            }

            movieStillCutsRepository.saveAll(stillCuts);

        } catch (Exception e) {
            log.error("getMovieMore 실패", e);
        }
    }

    public MovieDetailDto parseMovieDetail(String detailUrl) throws IOException {
        Document detailDoc = Jsoup.connect(detailUrl).get();

        Element directorEl = detailDoc.selectFirst(".spec dt:contains(감독) + dd a");
        String director = directorEl != null ? directorEl.text() : "정보 없음";

        Element synopsisEl = detailDoc.selectFirst(".sect-story-movie");
        String synopsis = (synopsisEl != null && !synopsisEl.text().replaceAll("\\s+", " ").trim().isEmpty()) ? synopsisEl.text().replaceAll("\\s+", " ").trim() : "정보 없음";

        Elements stillCutEls = detailDoc.select("#still_motion img[data-src]");
        List<String> stillCutUrls = new ArrayList<>();
        for (Element img : stillCutEls) {
            stillCutUrls.add(img.attr("data-src"));
        }
        // ✅ 4. 장르 추출 (dt 태그에서 직접 파싱)
        Element genreEl = detailDoc.select(".spec dt").stream()
                .filter(dt -> dt.text().contains("장르"))
                .findFirst()
                .orElse(null);
        String genre = (genreEl != null && !genreEl.text().replace("장르 :", "").trim().isEmpty()) ? genreEl.text().replace("장르 :", "").trim() : "정보 없음";

        return MovieDetailDto.builder()
                .director(director)
                .synopsis(synopsis)
                .imageList(stillCutUrls)
                .genre(genre)
                .build();
    }

    private void saveOrUpdateMovie(int code, Movies newMovie, MovieDetailDto detail, List<MovieStillCuts> stillCuts, Map<Integer, Movies> existingMap, Map<Integer, Movies> allMoviesMap) {
        if (existingMap.containsKey(code)) {
            Movies existing = existingMap.get(code);
            existing.updateFrom(newMovie);
            moviesRepository.save(existing);
            log.info("🔁 UPDATED: {}", existing.getName());
        } else if (allMoviesMap.containsKey(code)) {
            // 이미 존재하지만 현재 상태가 CLOSE였던 영화 => 상태 변경
            Movies closedMovie = allMoviesMap.get(code);
            closedMovie.updateFrom(newMovie);
            moviesRepository.save(closedMovie);
            log.info("♻️ REOPENED: {}", closedMovie.getName());
        } else {
            Movies saved = moviesRepository.save(newMovie);
            for (String url : detail.getImageList()) {
                stillCuts.add(MovieStillCuts.builder().movieNo(saved.getNo()).imageLink(url).build());
            }
            log.info("🆕 ADDED: {}", newMovie.getName());
        }
    }

    private void crawlAndSyncMovies(Map<Integer, Movies> existingMoviesMap, Set<Integer> updatedCodes, Map<Integer, Movies> allMoviesMap) {
        String url = "http://www.cgv.co.kr/movies/?lt=1&ft=0";
        List<MovieStillCuts> stillCuts = new ArrayList<>();

        try {
            Document doc = Jsoup.connect(url).get();
            Elements movies = doc.select("div.sect-movie-chart ol li");

            for (Element movie : movies) {
                if (movie.childNodeSize() == 0) continue;

                String href = movie.selectFirst("a[href^=/movies/detail-view/?midx=]").attr("href");
                int code = Integer.parseInt(href.split("=")[1]);
                String detailUrl = "http://www.cgv.co.kr" + href;

                MovieDetailDto detail = parseMovieDetail(detailUrl);

                String title = movie.select("strong.title").text();
                String reservationRate = movie.select("strong.percent").text().replaceAll("[^\\d.]+", "");
                String ageRating = movie.select("i.cgvIcon").text();
                String imageSrc = movie.select("img").attr("src");

                String openText = movie.select(".txt-info strong").text();
                String dateStr = openText.split(" ")[0].replace(".", "-");
                LocalDate openDate = LocalDate.parse(dateStr);

                MovieStatus openStatus = openDate.isBefore(LocalDate.now()) || openDate.isEqual(LocalDate.now())
                        ? MovieStatus.ACTIVE
                        : MovieStatus.PENDING;

                Movies entity = Movies.builder()
                        .code(code)
                        .name(title)
                        .director(detail.getDirector())
                        .description(detail.getSynopsis())
                        .openDate(openDate)
                        .openStatus(openStatus)
                        .reservationRate(reservationRate)
                        .postImage(imageSrc)
                        .genre(detail.getGenre())
                        .ageGrade(ageRating)
                        .externalLink(detailUrl) // <--- 이 부분 추가!
                        .build();

                saveOrUpdateMovie(code, entity, detail, stillCuts, existingMoviesMap, allMoviesMap);
                updatedCodes.add(code);
            }

            movieStillCutsRepository.saveAll(stillCuts);

        } catch (Exception e) {
            log.error("crawlAndSyncMovies 실패", e);
        }
    }
}
*/
