package com.ict.finalProject.dashboard.service.impl;

import com.ict.finalProject.dashboard.controller.response.ActiveUsersResponse;
import com.ict.finalProject.dashboard.domain.ActiveUsers;
import com.ict.finalProject.dashboard.domain.constant.Activity;
import com.ict.finalProject.dashboard.repository.ActiveUsersRepository;
import com.ict.finalProject.dashboard.service.ActiveUsersService;
import com.ict.finalProject.oauth.repository.domain.Users;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActiveUsersServiceImpl implements ActiveUsersService {

    private final ActiveUsersRepository activeUsersRepository;

    @Async
    public void saveActivateLog(Users users, String ip, Activity activity) {

        activeUsersRepository.save(ActiveUsers.builder()
                .userNo((users != null ? users.getNo() : 0))
                .ip(ip)
                .activity(activity).build());
    }

    //일별 활동인원수
    @Override
    public List<ActiveUsersResponse> getDayActiveUsersList(String start, String end) {
        //오늘 날짜로부터 한 달 전의 날짜, 어제 날짜 구하기(시작일, 종료일 구하기 위해)
        String oneMonthAgo = LocalDate.now().minusMonths(1).toString(); //한 달 전
        String yesterday = LocalDate.now().minusDays(1).toString(); //어제 날짜

        //날짜 범위 생성
        List<String> allDates = generateDateRange(oneMonthAgo, yesterday);

        //실제 로그인한 사용자가 있는 날짜
        List<ActiveUsersResponse> activeUsersData = activeUsersRepository.getDayActiveUsersList(oneMonthAgo, yesterday);

        return allDates.stream()
                .map(date -> {
                    long count = activeUsersData.stream()
                            .filter(result -> result.getDateTime().equals(date))
                            .mapToLong(ActiveUsersResponse::getCount)
                            .findFirst()
                            .orElse(0L);
                    return new ActiveUsersResponse(date, count);
                })
                .collect(Collectors.toList());
    }

    //월별 활동인원수
    @Override
    public List<ActiveUsersResponse> getMonthActiveUsersList() {
        //1년 전의 해당 월 1일
        String firstDayOfLastYearMonth = LocalDate.now().minusYears(1).withDayOfMonth(1).toString();
        //지난달의 마지막 날
        String lastDayOfPrevMonth = LocalDate.now().minusMonths(1)
                                    .withDayOfMonth(LocalDate.now().minusMonths(1).lengthOfMonth()).toString();

        //해당 월에 활동한 사용자 데이터 가져오기
        List<ActiveUsersResponse> activeUsersData = activeUsersRepository.getMonthActiveUsersList(firstDayOfLastYearMonth, lastDayOfPrevMonth);

        return activeUsersData;
    }

    //활동인원수 총 합계
    @Override
    public Long getTotalActiveUsers(String startDate, String endDate) {
        return activeUsersRepository.getTotalActiveUsers(startDate, endDate);
    }

    // 날짜 범위 생성하는 메소드 (시작일과 종료일을 받아 날짜 범위를 반환)
    public List<String> generateDateRange(String startDate, String endDate) {
        List<String> dates = new ArrayList<>();

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        // startDate부터 endDate까지 모든 날짜를 리스트에 추가
        while (!start.isAfter(end)) {
            dates.add(start.toString()); // 날짜를 문자열로 변환하여 리스트에 추가
            start = start.plusDays(1); // 하루씩 증가
        }

        return dates;
    }
}
