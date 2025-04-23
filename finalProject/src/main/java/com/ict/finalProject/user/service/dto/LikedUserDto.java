package com.ict.finalProject.user.service.dto;

import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.repository.domain.constant.LikeType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikedUserDto extends LikeItemDto {
    private Integer id;
    private String nickname;
    private String profileImageUrl;
    private String postImage;

    public LikedUserDto(Users users) {
        super(LikeType.MOVIE);
        this.id = users.getNo();
        this.nickname = users.getNickname();
        this.profileImageUrl = users.getProfileImageUrl();
    }
}
