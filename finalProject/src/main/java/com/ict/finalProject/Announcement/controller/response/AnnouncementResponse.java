package com.ict.finalProject.Announcement.controller.response;

import com.ict.finalProject.domain.constant.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {

    Integer id;

    Integer userNo;

    String nickname;

    UserRole role;

    String title;

    String content;

    LocalDateTime createdAt;
}
