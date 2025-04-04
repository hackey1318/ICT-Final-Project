package com.ict.finalProject.testCode;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CGVTheaterCrawler {

    private static final String KAKAO_API_KEY = "47d3d6c7b00ecb8beb627eeafe04d4a9"; // 본인 API 키 사용
//    private static final String KAKAO_API_KEY = "83d1dc7f3cbc27e375262210a7b0bdeb"; // 본인 API 키 사용

    public static void getGeoInfo(List<String> theaterNameList) {

        String apiUrl = "https://dapi.kakao.com/v2/local/search/keyword.json?query=";

        for (String theaterName : theaterNameList) {

            if (theaterName.contains("(임시휴업)")) {
                theaterName = theaterName.replace("(임시휴업)", "");
            } else if (theaterName.contains("CINE de CHEF")) {
                theaterName = theaterName.replace("CINE de CHEF", "씨네드쉐프");
            }
            try {
                System.out.print(theaterName + " 좌표: ");
                URL url = new URL(apiUrl + URLEncoder.encode(theaterName, "UTF-8"));
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Authorization", "KakaoAK " + KAKAO_API_KEY);

                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String response = br.readLine();
                br.close();

                // JSON 파싱
                JSONObject json = new JSONObject(response);
                JSONObject location = json.getJSONArray("documents").getJSONObject(0);
                String latitude = location.getString("y");
                String longitude = location.getString("x");

                System.out.println(latitude + ", " + longitude);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    public static void main(String[] args) {
        String url = "http://www.cgv.co.kr/theaters/";

        try {
            Document doc = Jsoup.connect(url).get();
            String scriptContent = doc.html(); // 전체 HTML 가져오기

            // theaterJsonData = [...] 형태의 JSON 추출을 위한 정규식
            Pattern pattern = Pattern.compile("var theaterJsonData = (\\[.*?\\]);", Pattern.DOTALL);
            Matcher matcher = pattern.matcher(scriptContent);

            if (matcher.find()) {
                String json = matcher.group(1); // JSON 부분만 추출
                System.out.println("🎬 CGV 극장 JSON 데이터:");
                JSONArray theaterList = new JSONArray(json);
                List<String> theaterNameList = new ArrayList<>();
                for (int i = 0; i < theaterList.length(); i++) {
                    JSONArray regionTheaterList = theaterList.getJSONObject(i).optJSONArray("AreaTheaterDetailList");
                    for (int j = 0; j < regionTheaterList.length(); j++) {
                        JSONObject theater = regionTheaterList.getJSONObject(j);
                        theaterNameList.add(theater.getString("TheaterName"));
                    }
                }
                // lat, lng 정보 parsing 후 -> DB 저장
                System.out.println(theaterNameList);
                getGeoInfo(theaterNameList);

            } else {
                System.out.println("JSON 데이터를 찾을 수 없습니다.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
