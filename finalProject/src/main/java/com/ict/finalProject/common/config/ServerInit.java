package com.ict.finalProject.common.config;


import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserGender;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServerInit {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostConstruct
    public void generateAdminUser() {

        String adminId = "admin";

        Users admin = usersRepository.findById(adminId).orElse(null);
        if (admin == null) {
            usersRepository.save(
                    Users.builder()
                            .id(adminId)
                            .password(bCryptPasswordEncoder.encode("admin123"))
                            .kakaoId(adminId)
                            .nickname(adminId)
                            .knickname(adminId)
                            .email("admin@test.com")
                            .role(UserRole.ADMIN)
                            .gender(UserGender.MALE)
                            .status(StatusInfo.ACTIVE).build());
        }
    }
}
