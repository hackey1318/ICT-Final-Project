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
    private int no;
    private String id;
    private String nickname;
    private String email;
    private String gender;
    private String status;
    private String role;
    private String phone;
}
