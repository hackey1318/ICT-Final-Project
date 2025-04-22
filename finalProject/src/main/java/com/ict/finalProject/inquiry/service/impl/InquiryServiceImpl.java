package com.ict.finalProject.inquiry.service.impl;

import com.ict.finalProject.common.config.AuthCheck;
import com.ict.finalProject.common.exception.custom.UserAuthenticationException;
import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.InquiryProceed;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.inquiry.controller.request.InquiryCommentRequest;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryCommentResponse;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.InquiryRepository;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import com.ict.finalProject.inquiry.repository.domain.InquiryComment;
import com.ict.finalProject.inquiry.service.InquiryService;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.service.FindUserService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;
    private final ImageInfoRepository imageInfoRepository;
    private final FindUserService findUserService;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    //문의등록
    @Override
    @Transactional
    public boolean inquiryWrite(InquiryRequest request) {
        try {
            String hashedPwd = null;
            if(request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                hashedPwd = passwordEncoder.encode(request.getPassword().trim());
            }

            Inquiry saveInquiry = inquiryRepository.save(Inquiry.builder()
                    .userNo(request.getUserNo())
                    .subject(request.getSubject())
                    .content(request.getContent())
                    .password(hashedPwd)
                    .proceed(InquiryProceed.BEFORE)
                    .status(StatusInfo.ACTIVE).build());

            List<ImageInfo> inquiryImagesList = new ArrayList<>();
            if(request.getImageList() != null) {
                for (String imageId : request.getImageList()) {
                    inquiryImagesList.add(ImageInfo.builder()
                                    .type(ImageWriteType.INQUIRY)
                                    .boardNo(saveInquiry.getNo())
                                    .imageId(imageId)
                                    .status(StatusInfo.ACTIVE).build());
                }
                imageInfoRepository.saveAll(inquiryImagesList);
            }
        } catch(Exception e) {
            e.printStackTrace();
            log.error("문의 작성 실패 {} : {}", request.getSubject(), e.getMessage());
            return false;
        }
        return true;
    }

    //문의리스트
    @Override
    public List<InquiryResponse> getInquiry() {
        List<Inquiry> inquiries = inquiryRepository.findAllByOrderByNoDesc();
        System.out.println(inquiries);
        if(inquiries.isEmpty()) {
            return Collections.emptyList();
        }

        List<Integer> userNos = inquiries.stream()
                                        .map(Inquiry::getUserNo)
                                        .distinct()
                                        .collect(Collectors.toList());

        List<Users> users = findUserService.findUsersByUserNo(userNos);

        Map<Integer, String> userNicknameMap = users.stream()
                .collect(Collectors.toMap(Users::getNo, Users::getNickname, (existing, replacement) -> existing)); //여기까지 추가

        return inquiries.stream().map(inquiry -> {

            String nickname = userNicknameMap.getOrDefault(inquiry.getUserNo(), "알 수 없음");
            boolean isPrivate = inquiry.getPassword() != null && !inquiry.getPassword().isEmpty();

            return InquiryResponse.builder()
                    .no(inquiry.getNo())
                    .subject(inquiry.getSubject())
                    .createdAt(inquiry.getCreatedAt())
                    .proceed(inquiry.getProceed())
                    .proceedDescription(inquiry.getProceed().getDescription())
                    .status(inquiry.getStatus())
                    .nickname(nickname)
                    .isPrivate(isPrivate)
                    .build();
        })
        .collect(Collectors.toList());
    }

    //문의상세페이지
    @Override
    public InquiryResponse getInquiryByNo(int no) {
        Optional<Inquiry> inquiryOpt = inquiryRepository.findByNo(no);

        Inquiry inquiry = inquiryOpt.orElseThrow(() ->
                new NoSuchElementException("inquiry not found with no" + no));

        Optional<Users> usersOpt = findUserService.findUser(inquiry.getUserNo());
        String nickname = usersOpt.map(Users::getNickname).orElse("알 수 없음");
        UserRole userRole = usersOpt.map(Users::getRole).orElse(null);
        boolean isPrivate = inquiry.getPassword() != null && !inquiry.getPassword().isEmpty();

        // 이미지 ID 목록 조회 로직 추가 "확인" 필요@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        /*List<String> imageIdList = imageInfoRepository.findByTypeAndBoardNoAndStatus(ImageWriteType.INQUIRY, no, StatusInfo.ACTIVE)
                .stream()
                .map(ImageInfo::getImageId)
                .collect(Collectors.toList());*/

        return InquiryResponse.builder()
                .no(inquiry.getNo())
                .userNo(inquiry.getUserNo())
                .nickname(nickname)
                .subject(inquiry.getSubject())
                .content(inquiry.getContent())
                .isPrivate(isPrivate)
                .createdAt(inquiry.getCreatedAt())
                .updatedAt(inquiry.getUpdatedAt())
                .status(inquiry.getStatus())
                .role(userRole)
                .proceed(inquiry.getProceed())
                .proceedDescription(inquiry.getProceed().getDescription())
                .build();
    }

    //비밀글 비밀번호체크
    @Override
    public boolean checkPwd(int no, String password) {
        Inquiry inquiry = inquiryRepository.findByNo(no)
                .orElseThrow(() -> new NoSuchElementException("Inquiry not found with no:" + no));

        if(inquiry.getPassword() == null || inquiry.getPassword().isEmpty()) {
            return false;
        }
        return passwordEncoder.matches(password, inquiry.getPassword());
    }

    //문의삭제
    @Override
    public void inquiryDel(int no) {
        Inquiry inquiry = inquiryRepository.findByNo(no)
                                           .orElseThrow(() -> new RuntimeException("문의 찾기 실패"));
        inquiry.setStatus(StatusInfo.DELETE);
        inquiryRepository.save(inquiry);
    }

    //관리자용 문의리스트
    @Override
    public List<InquiryResponse> getAllInquiry() {
        List<Inquiry> inquiries = inquiryRepository.findAllByOrderByNoDescForAdmin();

        if(inquiries.isEmpty()) {
            return Collections.emptyList();
        }

        List<Integer> userNos = inquiries.stream()
                .map(Inquiry::getUserNo)
                .distinct()
                .collect(Collectors.toList());

        List<Users> users = findUserService.findUsersByUserNo(userNos);

        Map<Integer, String> userNicknameMap = users.stream()
                .collect(Collectors.toMap(Users::getNo, Users::getNickname, (existing, replacement) -> existing)); //여기까지 추가

        return inquiries.stream().map(inquiry -> {

                    String nickname = userNicknameMap.getOrDefault(inquiry.getUserNo(), "알 수 없음");
                    boolean isPrivate = inquiry.getPassword() != null && !inquiry.getPassword().isEmpty();

                    return InquiryResponse.builder()
                            .no(inquiry.getNo())
                            .subject(inquiry.getSubject())
                            .nickname(nickname)
                            .createdAt(inquiry.getCreatedAt())
                            .isPrivate(isPrivate)
                            .proceed(inquiry.getProceed())
                            .proceedDescription(inquiry.getProceed().getDescription())
                            .status(inquiry.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

    //문의 댓글 목록조회
    @Override
    public List<InquiryCommentResponse> getComments(int inquiryNo) {

        List<InquiryComment> comments = inquiryRepository.findCommentsByInquiryNoOrderByCreatedAtAsc(inquiryNo);

        if(comments.isEmpty()) {
            return Collections.emptyList();
        }

        List<Integer> userNos = comments.stream()
                .map(InquiryComment::getUserNo)
                .distinct()
                .collect(Collectors.toList());

        Map<Integer, String> userNicknameMap = new HashMap<>();
        if(!userNos.isEmpty()) {
            List<Users> users = findUserService.findUsersByUserNo(userNos);
            userNicknameMap = users.stream()
                    .collect(Collectors.toMap(Users::getNo, Users::getNickname));
        }

        Map<Integer, String> finalUserNicknameMap = userNicknameMap;

        return comments.stream()
                .map(comment -> {
                    String nickname = finalUserNicknameMap.getOrDefault(comment.getUserNo(), "알수없음");

                return InquiryCommentResponse.builder()
                        .no(comment.getNo())
                        .content(comment.getContent())
                        .nickname(nickname)
                        .userNo(comment.getUserNo())
                        .createdAt(comment.getCreatedAt() != null
                            ? comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yy-MM-dd HH:mm:ss"))
                            : null)
                        .build();
                })
                .collect(Collectors.toList());
    }

    //문의 댓글 작성
    @Override
    @Transactional
    public boolean writeComment(int no, InquiryCommentRequest request) {
        Inquiry inquiry = inquiryRepository.findByNo(no)
                .orElseThrow(() -> new NoSuchElementException("댓글을 작성할 문의글을 찾을 수 없습니다: " + no));

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Users currentUser = null;
            String userId = null;
            UserRole currentRole = null;

            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                log.warn("인증되지 않은 사용자의 댓글 작성 시도. inquiryNo : {}", no);
                throw new UserAuthenticationException("인증되지 않은 사용자입니다.");
            }

            Object principal = authentication.getPrincipal();
            if (!(principal instanceof String)) {
                log.error("예상치 못한 Principal 타입: {}", principal.getClass());
                throw new UserAuthenticationException("사용자 식별 정보를 가져올 수 없습니다.");
            }
            userId = (String) principal;
            final String finalUserId = userId;

            currentUser = findUserService.findUserById(finalUserId)
                    .orElseThrow(() -> new NoSuchElementException("댓글 작성자 정보를 찾을 수 없습니다. userId : " + finalUserId));

            currentRole = currentUser.getRole();
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                throw new IllegalArgumentException("댓글 내용을 입력해주세요.");
            }

            InquiryComment comment = InquiryComment.builder()
                    .inquiryNo(inquiry.getNo())
                    .userNo(currentUser.getNo())
                    .content(request.getContent().trim())
                    .build();

            entityManager.persist(comment);
            log.info("새 댓글 저장됨. inquiryNo: {}, commentId: {}, userNo: {}", no, comment.getNo(), comment.getUserNo());

            if (inquiry.getProceed() == InquiryProceed.BEFORE && currentRole == UserRole.ADMIN) {
                inquiry.setProceed(InquiryProceed.PROCEEDING);
                inquiryRepository.save(inquiry);
                log.info("문의글(No: {}) 상태가 '처리중'으로 변경되었습니다.", no);
            }

            return true;

        } catch (UserAuthenticationException | IllegalStateException e) {
            log.warn("댓글 작성 권한 오류 (inquiryNo: {}): {}", no, e.getMessage());
            return false;
        } catch (NoSuchElementException | IllegalArgumentException e) {
            log.warn("댓글 작성 실패 - 잘못된 요청 또는 데이터 없음 (inquiryNo: {}): {}", no, e.getMessage());
            return false;
        } catch (Exception e) {
            log.error("댓글 작성 중 예상치 못한 서버 오류 발생 (inquiryNo: {}): {}", no, e.getMessage(), e);
            return false;
        }
    }

    @Override
    @Transactional
    public boolean updateInquiryStatus(int inquiryNo, InquiryProceed newStatus) {
        try {
            Inquiry inquiry = inquiryRepository.findByNo(inquiryNo)
                    .orElseThrow(() -> new NoSuchElementException("상태변경할 문의글을 찾을 수 없습니다." + inquiryNo));

            log.info("문의 상태 변경 시도: inquiryNo={}, 현재 상태={}, 변경할 상태={}",
                    inquiryNo, inquiry.getProceed(), newStatus);
            inquiry.setProceed(newStatus);

            inquiryRepository.save(inquiry);
            log.info("문의 상태 변경 완료: inquiryNo={}, 변경된 상태={}", inquiryNo, newStatus);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
