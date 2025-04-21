package com.ict.finalProject.cart.controller;

import com.ict.finalProject.cart.controller.response.CartRequest;
import com.ict.finalProject.cart.controller.response.CartsResponse;
import com.ict.finalProject.cart.service.CartsService;
import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.fileSystem.domain.Images;
import com.ict.finalProject.fileSystem.service.FileSystemService;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.oauth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/cart")
@AllArgsConstructor
public class CartsController {

    private final FileSystemService fileSystemService;
    private final CartsService cartsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final MdShopService mdShopService;

    private int getUserNoFromRequest(HttpServletRequest request) {
        final String token = request.getHeader("Authorization");
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7); // "Bearer " 제거
            String userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
            return userService.getUser(userId).getNo();
        }
        return -1;
    }

    @GetMapping("/addGoods")
    public ResponseEntity<String> addGoods(@RequestParam("goodsId") int goodsId, @RequestParam("goodsQuantity") int goodsQuantity, HttpServletRequest request) {
        final String token = request.getHeader("Authorization");
        String userId = null;
        int userNo = -1;
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);

            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
            userNo = userService.getUser(userId).getNo();
        }

        if (mdShopService.getGoodsInfo(goodsId).getCount() < 1) {
            return ResponseEntity.ok("재고가 없는 상품입니다.");
        }

        if (cartsService.checkCartGoodsExist(userNo, goodsId)) {
            return ResponseEntity.ok("이미 장바구니에 있는 상품입니다.");
        } else {
            cartsService.insertCartGoods(userNo, goodsId, goodsQuantity);
            return ResponseEntity.ok("장바구니에 상품이 추가되었습니다.");
        }
    }

    @GetMapping("/goods")
    public ResponseEntity<List<CartsResponse>> cartGoods(HttpServletRequest request) {
        final String token = request.getHeader("Authorization");
        String userId = null;
        int userNo = -1;
        if (token != null && !token.isEmpty()) {
            String jwtToken = token.substring(7);

            userId = jwtTokenProvider.getUserNameFromToken(jwtToken);
            userNo = userService.getUser(userId).getNo();
        }
        List<CartsResponse> cartsResponses = cartsService.getCartsGoods(userNo);
        System.out.println(cartsResponses);
        return ResponseEntity.ok(cartsResponses);
    }

    @PostMapping("/deleteGoods")
    public void deleteGoods(@RequestBody List<String> goodsIds, HttpServletRequest request) {
        int userNo = getUserNoFromRequest(request);
        for (String element : goodsIds) {
            cartsService.deleteCartGoods(userNo, Integer.parseInt(element));
        }
    }

//    @GetMapping("/images")
//    public List<Images> getGoodsImages(@RequestParam("goodsId") int goodsId) {
//
//        List<String> imageIds = fileSystemService.getCartFileIds(goodsId);
//        List<Images> images = fileSystemService.getImageInfo(imageIds);
//        System.out.println("응답체크");
//        System.out.println(images);
//        return images;
//    }

    @PostMapping("/updateQuantity")
    public void updateQuantity (@RequestBody CartRequest cartRequest, HttpServletRequest request){
        int userNo = getUserNoFromRequest(request);
        List<Integer> goodsNos = cartRequest.getGoodsNos();
        List<Integer> goodsQuantities = cartRequest.getGoodsQuantities();
        cartsService.updateCartGoods(userNo, goodsNos, goodsQuantities);
    }
}
