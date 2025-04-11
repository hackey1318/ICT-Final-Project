package com.ict.finalProject.dashboard.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class ActiveUsersSummaryResponse {
    private List<ActiveUsersResponse> activeUsers; //활동인원수 리스트
    private Long totalCount; //활동인원수 총합계
}
