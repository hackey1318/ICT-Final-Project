package com.ict.finalProject.dashboard.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class ActiveUsersResponse {
    private String dateTime; //날짜
    private Long count; //해당 날짜의 활동인원수
}
