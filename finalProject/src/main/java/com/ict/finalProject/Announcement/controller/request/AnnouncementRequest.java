package com.ict.finalProject.Announcement.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementRequest {

    Integer userNo;

    String title;

    String content;

    LocalDateTime expiredAt;
}
