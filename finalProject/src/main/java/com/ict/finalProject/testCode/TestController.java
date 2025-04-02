package com.ict.finalProject.testCode;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

public class TestController {

    private static void getMovieMore() {
        String url = "http://www.cgv.co.kr/common/ajax/movies.aspx/GetMovieMoreList"
                + "?listType=1&orderType=1&filterType=0&_=" + System.currentTimeMillis();
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        headers.set("Referer", "https://www.cgv.co.kr/movies/");
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            // **GET 요청 실행**
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String jsonResponse = response.getBody();

                // **JSON 파싱**
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(jsonResponse);
                // "d" 필드의 JSON 문자열을 다시 파싱
                String dContent = root.path("d").asText();
                JsonNode parsedD = mapper.readTree(dContent);

                JsonNode movieList = parsedD.path("List");

                for (JsonNode movie : movieList) {
                    String title = movie.path("Title").asText();
                    String releaseDate = movie.path("OpenDate").asText();
                    String reservationRate = movie.path("TicketRate").asText();
                    String ageRating = movie.path("MovieGrade").path("GradeText").asText();
                    String imageSrc = movie.path("PosterImage").path("MiddleImage").asText();
                    String openText = movie.path("OpenText").asText();
                    String dday = movie.path("D_Day").asText();
                    String movieIdx = movie.path("MovieIdx").asText();

                    System.out.println("영화 제목: " + title);
                    System.out.println("포스터 이미지 URL: " + imageSrc);
                    System.out.println("연령 등급: " + ageRating);
                    System.out.println("예매율: " + reservationRate);
                    System.out.println("개봉일: " + releaseDate);
                    System.out.println("개봉 상태: " + openText);
                    System.out.println("D-Day: " + dday);
                    System.out.println("--------------------------------");
                }
            } else {
                System.out.println("Request Failed: " + response.getStatusCode());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        String url = "http://www.cgv.co.kr/movies/?lt=1&ft=0"; // CGV 현재 상영작 페이지

        try {
            // HTML 문서 가져오기
            Document doc = Jsoup.connect(url).get();

            // 영화 목록 선택 (영화 제목이 포함된 요소 찾기)
            Elements movies = doc.select("div.sect-movie-chart ol li");
            System.out.println("🎬 현재 상영작 목록 (CGV)");
            for (Element movie : movies) {
                if (movie.childNodeSize() == 0) {
                    getMovieMore();
                    break;
                }
                String detailPage = movie.select("a").attr("href");
                // 1. 영화 포스터 이미지 (img 태그의 src 속성)
                String imageSrc = movie.select("img").attr("src");

                // 2. 영화 연령 (i 태그의 class가 cgvIcon인 요소)
                String ageRating = movie.select("i.cgvIcon").text();

                // 3. 영화 제목 (strong 태그의 class가 title인 요소)
                String title = movie.select("strong.title").text();

                // 4. 예매율 (strong 태그의 class가 percent인 요소)
                String reservationRate = movie.select("strong.percent").text();

                // 날짜 부분 추출
                Element releaseDateElement = doc.selectFirst(".txt-info strong");
                String releaseDate = releaseDateElement != null ? releaseDateElement.ownText().trim() : "N/A";

                // "개봉" 텍스트 추출
                Element openTextElement = doc.selectFirst(".txt-info strong span");
                String openText = openTextElement != null ? openTextElement.text().trim() : "N/A";

                // D-Day 추출
                Element ddayElement = doc.selectFirst(".txt-info strong em.dday");
                String dday = ddayElement != null ? ddayElement.text().trim() : "N/A";

                // 출력
                System.out.println("영화 제목: " + title);
                System.out.println("포스터 이미지 URL: " + imageSrc);
                System.out.println("연령 등급: " + ageRating);
                System.out.println("예매율: " + reservationRate);
                System.out.println("개봉일: " + releaseDate);
                System.out.println("개봉 상태: " + openText);
                System.out.println("D-Day: " + dday);
                System.out.println("----------------------------");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
