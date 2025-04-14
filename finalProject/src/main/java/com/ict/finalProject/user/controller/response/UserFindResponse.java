package com.ict.finalProject.user.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFindResponse {
    String status; //상태값 담을 변수

    String id; //사용자 아이디

    String nickname; //사용자 닉네임
}
