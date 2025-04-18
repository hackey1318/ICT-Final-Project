package com.ict.finalProject.orders.controller;

import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.movie.service.TheatersService;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import com.ict.finalProject.orders.repository.domain.Orders;
import com.ict.finalProject.orders.service.OrdersService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final MdShopService mdShopService;
    private final OrdersService ordersService;
    private final UserService userService;
    private final TheatersService theatersService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/theaterList")
    public List<String> theaterList() {
        return theatersService.getAllTheaterNames();
    }


}


