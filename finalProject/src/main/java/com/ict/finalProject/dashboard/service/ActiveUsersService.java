package com.ict.finalProject.dashboard.service;

import com.ict.finalProject.dashboard.controller.response.ActiveUsersResponse;
import com.ict.finalProject.dashboard.domain.constant.Activity;
import com.ict.finalProject.oauth.repository.domain.Users;

import java.util.List;

public interface ActiveUsersService {

    void saveActivateLog(Users users, String ip, Activity activity);

    //활동인원수 리스트(일별)
    List<ActiveUsersResponse> getDayActiveUsersList(String start, String end);

    //활동인원수 리스트(월별)
    List<ActiveUsersResponse> getMonthActiveUsersList();

    //활동인원수 총합계
    Long getTotalActiveUsers(String startData, String endDate);
}
