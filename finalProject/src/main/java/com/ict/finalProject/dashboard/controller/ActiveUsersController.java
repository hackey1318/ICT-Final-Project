package com.ict.finalProject.dashboard.controller;

import com.ict.finalProject.dashboard.controller.response.ActiveUsersResponse;
import com.ict.finalProject.dashboard.controller.response.ActiveUsersSummaryResponse;
import com.ict.finalProject.dashboard.service.ActiveUsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class ActiveUsersController {
    private final ActiveUsersService activeUsersService;

    @GetMapping("/getDauList")
    public ActiveUsersSummaryResponse getDayActiveUsersList(){
        LocalDate endDate = LocalDate.now().minusDays(1); //어제 날짜
        LocalDate startDate = endDate.minusMonths(1).plusDays(1); //한 달 전 날짜

        String start = startDate.toString();
        String end = endDate.toString();

        List<ActiveUsersResponse> activeUsersList = activeUsersService.getDayActiveUsersList(start, end);

        //활동인원수 총합계
        Long totalCount = activeUsersService.getTotalActiveUsers(start, end);

        return ActiveUsersSummaryResponse.builder()
                .activeUsers(activeUsersList)
                .totalCount(totalCount)
                .build();
    }

    @GetMapping("/getMauList")
    public ActiveUsersSummaryResponse getMonthActiveUsersList(){
        //1년 전의 해당 월 1일
        String startDate = LocalDate.now().minusYears(1).withDayOfMonth(1).toString();
        //지난달의 마지막 날
        String endDate = LocalDate.now().minusMonths(1)
                .withDayOfMonth(LocalDate.now().minusMonths(1).lengthOfMonth()).toString();

        List<ActiveUsersResponse> monthUsers = activeUsersService.getMonthActiveUsersList();

        //활동인원수 총합계
        Long totalCount = activeUsersService.getTotalActiveUsers(startDate, endDate);

        return ActiveUsersSummaryResponse.builder()
                .activeUsers(monthUsers)
                .totalCount(totalCount)
                .build();
    }
}
