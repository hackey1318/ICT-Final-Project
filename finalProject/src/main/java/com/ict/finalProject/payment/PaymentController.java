package com.ict.finalProject.payment;

import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@RestController
@RequestMapping("/payment")
public class PaymentController {

    JSONArray tempGoodsArray; // 테스트데이터 전용 임시 변수

    @PostMapping("/save")
    public String savePaymentInfo(@RequestBody String jsonBody) {
        long requestTotalPrice = 0;
        long dbTotalPrice = 0;

        JSONParser parser = new JSONParser();
        try {
            JSONObject requestData = (JSONObject) parser.parse(jsonBody);
            String orderId = (String) requestData.get("orderId");
            requestTotalPrice = (long) requestData.get("totalPrice");
            String customerEmail = (String) requestData.get("customerEmail");
            String customerName = (String) requestData.get("customerName");
            String customerMobilePhone = (String) requestData.get("customerMobilePhone");
            String customerAddress = (String) requestData.get("customerAddress");

            JSONArray goods = (JSONArray) requestData.get("goods");
            tempGoodsArray = goods; // 테스트용 값
            for (Object itemObj : goods) {
                JSONObject item = (JSONObject) itemObj;
                int id = ((Long) item.get("id")).intValue();
                String name = (String) item.get("name");
                long price = (long) item.get("price");
                long quantity = (long) item.get("quantity");
                // ★★★id기반으로 상품테이블 DB조회, 상품명과 가격 일치하는지 확인하는 거 만들어야 함★★★
                boolean isCorrectData = true; // 임시로 true설정
                if (isCorrectData) {
                    dbTotalPrice += price * quantity;
                } else {
                    return "fail";
                }
            }

            // ★★★orderId 및 주문 정보들 DB에 저장하는 거 만들어야 함★★★
            return "success";

        } catch (Exception e) {
            // 취소 시 그냥 주문 상태를 취소로 바꿈
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<JSONObject> confirmPayment(@RequestBody String jsonBody) throws Exception {

        JSONParser parser = new JSONParser();
        String orderId;
        String paymentKey;
        String amount;

        try {
            // 클라이언트에서 받은 JSON 요청 바디입니다.
            JSONObject requestData = (JSONObject) parser.parse(jsonBody);
            orderId = (String) requestData.get("orderId");
            paymentKey = (String) requestData.get("paymentKey");
            amount = (String) requestData.get("amount");

            // ★★★DB에서 주문번호와 금액 일치하는지 확인하는 로직 만들어야 함★★★
            boolean isCorrectRequest = true; // 테스트용 true
            if (!isCorrectRequest) {
                return null;
            }

        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        ;
        JSONObject obj = new JSONObject();
        obj.put("orderId", orderId);
        obj.put("paymentKey", paymentKey);
        obj.put("amount", amount);

        // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
        // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
        String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);

        // 결제를 승인하면 결제수단에서 금액이 차감돼요.
        URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Authorization", authorizations);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        OutputStream outputStream = connection.getOutputStream();
        outputStream.write(obj.toString().getBytes("UTF-8"));

        int code = connection.getResponseCode();
        boolean isSuccess = code == 200;

        InputStream responseStream = isSuccess ? connection.getInputStream() : connection.getErrorStream();

        // 결제 성공 및 실패 비즈니스 로직을 구현하세요.
        Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
        JSONObject jsonObject = (JSONObject) parser.parse(reader);
        responseStream.close();

        return ResponseEntity.status(code).body(jsonObject);
    }

    @PostMapping("/result")
    public String paymentResult (@RequestBody String orderId) {
        
        // orderId로 사용자 정보 DB에서 추출
        
        // 직접 입력한 임시 더미 데이터값
        JSONArray arr = new JSONArray();

        JSONObject customerInfo = new JSONObject();
        customerInfo.put("customerEmail", "customer123@gmail.com");
        customerInfo.put("customerName", "김씨네마투게더");
        customerInfo.put("customerMobilePhone", "01012341234");
        customerInfo.put("customerAddress", "서울 성동구 왕십리로");

        arr.add(customerInfo);

        for (int i = 0; i < tempGoodsArray.size(); i++) {
            arr.add(tempGoodsArray.get(i));
        }

        return arr.toString();
    }
}