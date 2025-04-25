package com.ict.finalProject.cinemate.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CineMateMemberResponse {

    private Integer userNo;

    private String nickName;

    private String profile;

    private boolean isMe = false;

    private boolean isLiked = false;
}
