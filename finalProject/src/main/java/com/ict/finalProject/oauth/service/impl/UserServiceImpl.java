package com.ict.finalProject.oauth.service.impl;

import com.ict.finalProject.common.config.JwtTokenProvider;
import com.ict.finalProject.common.exception.custom.NotFoundException;
import com.ict.finalProject.common.exception.custom.UserStatusException;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.Images;
import com.ict.finalProject.fileSystem.service.FileSystemService;
import com.ict.finalProject.oauth.controller.request.RegisterRequest;
import com.ict.finalProject.oauth.repository.UsersRepository;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.oauth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;


    private final UsersRepository usersRepository;

    // *** FileSystemService 주입 ***
    private final FileSystemService fileSystemService;

    @Override
    @Transactional // 여러 DB 작업이 있을 수 있으므로 트랜잭션 추가
    public boolean registerUser(RegisterRequest request) {

        Optional<Users> existingUser = usersRepository.findByKakaoId(request.getKakaoUserInfo().getKakaoId());

        log.info("회원가입 요청 수신: {}", request);
        if (request.getKakaoUserInfo() == null) {
            log.error("회원가입 요청에 카카오 사용자 정보가 없습니다!");
            throw new IllegalArgumentException("카카오 사용자 정보가 누락되었습니다."); // 더 구체적인 예외
        } else {
            log.info("요청 내 카카오 프로필 URL: '{}'", request.getKakaoUserInfo().getProfile());
            log.info("요청 내 업로드된 프로필 이미지 ID: '{}'", request.getUploadedProfileImageId()); // 새 필드 로그 추가
        }


        if (existingUser.isPresent()) {
            throw new RuntimeException("이미 가입된 카카오 계정입니다.");
        }

        try {
            String finalProfileImageUrl; // 최종적으로 저장될 프로필 이미지 URL

            // *** 사용자가 직접 이미지를 업로드했는지 확인 ***
            if (request.getUploadedProfileImageId() != null && !request.getUploadedProfileImageId().isEmpty()) {
                log.info("업로드된 이미지 사용 시도. ID: {}", request.getUploadedProfileImageId());
                try {
                    // FileSystemService를 사용하여 이미지 정보 조회
                    // getImageInfo는 List를 받으므로 ID를 List로 감싸서 전달
                    List<Images> imageInfoList = fileSystemService.getImageInfo(Collections.singletonList(request.getUploadedProfileImageId()));

                    if (imageInfoList.isEmpty()) {
                        // 해당 ID의 이미지가 없는 경우 (오류 상황)
                        log.warn("업로드된 이미지 ID '{}'에 해당하는 이미지를 찾을 수 없습니다. 카카오 프로필을 사용합니다.", request.getUploadedProfileImageId());
                        finalProfileImageUrl = request.getKakaoUserInfo().getProfile(); // 카카오 URL로 대체
                    } else {
                        // 이미지 정보를 찾았으면 해당 파일 경로 사용
                        Images imageInfo = imageInfoList.get(0);
                        finalProfileImageUrl = imageInfo.getPath();
                        log.info("업로드된 이미지 경로 사용: {}", finalProfileImageUrl);
                    }
                } catch (NotFoundException e) {
                    // getImageInfo에서 NotFoundException 발생 시 처리
                    log.warn("이미지 정보 조회 중 오류 발생 (ID: {}). 카카오 프로필을 사용합니다. 오류: {}", request.getUploadedProfileImageId(), e.getMessage());
                    finalProfileImageUrl = request.getKakaoUserInfo().getProfile();
                } catch (Exception e) {
                    // 기타 예외 처리
                    log.error("이미지 정보 조회 중 예상치 못한 오류 발생 (ID: {}). 카카오 프로필을 사용합니다.", request.getUploadedProfileImageId(), e);
                    finalProfileImageUrl = request.getKakaoUserInfo().getProfile();
                }

            } else {
                // 업로드된 이미지 ID가 없으면 카카오 프로필 URL 사용
                log.info("업로드된 이미지 ID 없음. 카카오 프로필 URL 사용.");
                finalProfileImageUrl = request.getKakaoUserInfo().getProfile();
            }

            // Users 엔티티 생성 시 finalProfileImageUrl 사용
            Users user = Users.builder()
                    .kakaoId(request.getKakaoUserInfo().getKakaoId())
                    .email(request.getKakaoUserInfo().getEmail())
                    .knickname(request.getKakaoUserInfo().getKnickName())
                    .nickname(request.getNickName())
                    .id(request.getId())
                    .password(passwordEncoder.encode(request.getPassword())) // 비밀번호 암호화
                    .gender(request.getGender())
                    .profileImageUrl(finalProfileImageUrl) // 결정된 프로필 이미지 URL 저장
                    // StatusInfo는 기본값이나 Enum으로 설정하는 것이 좋음 (예: .status(StatusInfo.ACTIVE))
                    .status(StatusInfo.ACTIVE) // 예시: 기본 상태를 ACTIVE로 설정
                    .build();
            usersRepository.save(user);

        } catch (Exception e) {
            // UsersRepository 저장 실패 등 다른 예외 처리
            log.error("회원가입 처리 중 오류 발생 [{}]: {}", request.getId(), e.getMessage(), e); // 스택 트레이스 로깅 추가 고려
            return false; // 실패 반환
        }
        return true; // 성공 반환
    }


    public String login(String id, String password) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("아이디가 존재하지 않습니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        if (!StatusInfo.ACTIVE.equals(user.getStatus())) {
            throw new UserStatusException("활성화 되지 않은 사용자입니다. 관리자에게 문의 바랍니다.");
        }

        return jwtTokenProvider.generateAccessToken(id, user.getStatus().name());
    }

    @Override
    public Optional<Users> existUser(String kakaoId) {
        return usersRepository.findByKakaoId(kakaoId);
    }

    @Transactional(readOnly = true) // 데이터베이스 조회만 하므로 readOnly 설정
    @Override
    public boolean existsByUserId(String userId) {
        // UsersRepository에 정의된 findById(String id) 메소드를 사용
        // Optional 객체가 값을 가지고 있는지(isPresent()) 여부로 존재 확인
        return usersRepository.findById(userId).isPresent();
    }
}
