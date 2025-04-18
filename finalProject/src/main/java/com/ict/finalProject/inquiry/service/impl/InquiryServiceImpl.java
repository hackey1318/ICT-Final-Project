package com.ict.finalProject.inquiry.service.impl;

import com.ict.finalProject.domain.constant.ImageWriteType;
import com.ict.finalProject.domain.constant.InquiryProceed;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.domain.constant.UserRole;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.ImageInfoRepository;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.InquiryRepository;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import com.ict.finalProject.inquiry.service.InquiryService;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.user.service.FindUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                            .status(inquiry.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
