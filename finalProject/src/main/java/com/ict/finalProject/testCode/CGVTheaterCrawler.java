package com.ict.finalProject.testCode;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CGVTheaterCrawler {

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
            } else {
                System.out.println("JSON 데이터를 찾을 수 없습니다.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
