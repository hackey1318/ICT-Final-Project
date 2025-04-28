package com.ict.finalProject.scheduler;

import com.ict.finalProject.movie.repository.MovieStillCutsRepository;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.constant.movie.MovieStatus;
import com.ict.finalProject.movie.repository.domain.MovieStillCuts;
import com.ict.finalProject.movie.repository.domain.Movies;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class CGVPreMovieCrawler {

    private final MoviesRepository moviesRepository;
    private final MovieStillCutsRepository movieStillCutsRepository;

    public MovieDetailDto crawlDetailPage(String detailUrl) throws IOException {

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

//    @PostConstruct
    @Scheduled(cron = "0 10 0 * * *")
    public void crawlingPreMovie() {
        String url = "http://www.cgv.co.kr/movies/pre-movies.aspx";

        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .get();

            Elements movies = doc.select("div.sect-movie-chart ol li");

            Pattern datePattern = Pattern.compile("(\\d{4}\\.\\d{2}\\.\\d{2})");
            List<MovieStillCuts> stillCutsToSave = new ArrayList<>();

            // ✅ 1. Pending 상태 영화들을 한 번에 조회해서 Map으로 캐싱
            Map<Integer, Movies> existingPendingMovies = moviesRepository.findByOpenStatusIn(Arrays.asList(MovieStatus.PENDING))
                    .stream()
                    .collect(Collectors.toMap(Movies::getCode, Function.identity()));
            Set<Integer> processedCodes = new HashSet<>();

            for (Element movie : movies) {
                if (movie.childNodeSize() == 0) continue;

                String title = movie.selectFirst("strong.title").text();
                String releaseText = movie.selectFirst("span.txt-info").text().trim();
                String href = movie.selectFirst("a[href^=/movies/detail-view/?midx=]").attr("href");
                int code = Integer.parseInt(href.split("=")[1]);

                // ✅ 이미 처리한 영화면 스킵
                if (!processedCodes.add(code)) {
                    continue;
                }
                String reservationRate = movie.select("strong.percent").text().replaceAll("[^\\d.]+", "");
                String ageRating = movie.select("i.cgvIcon").text();
                String imageSrc = movie.select("img").attr("src");

                Matcher matcher = datePattern.matcher(releaseText);
                if (!matcher.find()) {
                    System.out.println("제외됨: " + title + " (" + releaseText + ")");
                    continue;
                }

                String openText = movie.select(".txt-info strong").text();
                String dateStr = openText.split(" ")[0].replace(".", "-");
                LocalDate openDate = LocalDate.parse(dateStr);

                String detailUrl = "http://www.cgv.co.kr" + href;
                MovieDetailDto detail = crawlDetailPage(detailUrl);

                Movies movieEntity;
                if (existingPendingMovies.containsKey(code)) {
                    // ✅ 기존 영화 → 업데이트
                    movieEntity = existingPendingMovies.get(code);

                    Movies newData = Movies.builder()
                            .code(code)
                            .name(title)
                            .director(detail.getDirector())
                            .description(detail.getSynopsis())
                            .openDate(openDate)
                            .openStatus(MovieStatus.PENDING)
                            .reservationRate(reservationRate)
                            .postImage(imageSrc)
                            .genre(detail.getGenre())
                            .ageGrade(ageRating)
                            .externalLink(detailUrl)
                            .build();

                    movieEntity.updateFrom(newData);
                    log.info("🔄 UPDATED: {}", title);

                    movieStillCutsRepository.deleteByMovieNo(movieEntity.getNo());

                } else {
                    // ✅ 새로운 영화 → 추가
                    movieEntity = Movies.builder()
                            .code(code)
                            .name(title)
                            .director(detail.getDirector())
                            .description(detail.getSynopsis())
                            .openDate(openDate)
                            .openStatus(MovieStatus.PENDING)
                            .reservationRate(reservationRate)
                            .postImage(imageSrc)
                            .genre(detail.getGenre())
                            .ageGrade(ageRating)
                            .externalLink(detailUrl)
                            .build();
                    log.info("🆕 ADDED: {}", title);
                }

                Movies saved = moviesRepository.save(movieEntity);

                for (String stillCutImage : detail.getImageList()) {
                    stillCutsToSave.add(MovieStillCuts.builder()
                            .movieNo(saved.getNo())
                            .imageLink(stillCutImage)
                            .build());
                }
            }

            movieStillCutsRepository.saveAll(stillCutsToSave);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
