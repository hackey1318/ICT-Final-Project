package com.ict.finalProject.admin.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    int no;
    String id;
    String nickname;
    String email;
    String gender;
    String status;
    String role;
}
