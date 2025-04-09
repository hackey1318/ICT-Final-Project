package com.ict.finalProject.user.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFindRequest {
    String id; //사용자 아이디
    String nickname;
    String email;
}
