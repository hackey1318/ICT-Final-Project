package com.ict.finalProject.oauth.controller.request;

import com.ict.finalProject.domain.constant.UserGender;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocalRegisterRequest {
    private String id;
    private String password;
    private String nickName;
    private UserGender gender;
    private String email;
    private String phone;
    private String uploadedProfileImageId;
}
