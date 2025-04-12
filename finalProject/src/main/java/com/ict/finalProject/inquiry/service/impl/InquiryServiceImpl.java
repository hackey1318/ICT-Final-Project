package com.ict.finalProject.inquiry.service.impl;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.ImageInfo;
import com.ict.finalProject.fileSystem.repository.FileSystemRepository;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.controller.response.InquiryResponse;
import com.ict.finalProject.inquiry.repository.InquiryRepository;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import com.ict.finalProject.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;
    private final ImageInfoRepository imageInfoRepository;
    private final FileSystemRepository fileSystemRepository;

    //문의등록
    @Override
    @Transactional
    public boolean inquiryWrite(InquiryRequest request) {
        try {
            Inquiry saveInquiry = inquiryRepository.save(Inquiry.builder()
                    .userNo(request.getUserNo())
                    .subject(request.getSubject())
                    .content(request.getContent())
                    .status(StatusInfo.ACTIVE).build());

            List<ImageInfo> inquiryImagesList = new ArrayList<>();
            if(request.getImageList() != null) {
                for (String imageId : request.getImageList()) {
                    inquiryImagesList.add(ImageInfo.builder()
                                    .type(ImageWriteType.INQUIRY)
                                    .boardNo(saveInquiry.getNo())
                                    .fileId(imageId)
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

        return inquiries.stream()
                .map(inquiry -> InquiryResponse.builder()
                        .no(inquiry.getNo())
                        .subject(inquiry.getSubject())
                        .content(inquiry.getContent())
                        .createdAt(inquiry.getCreatedAt())
                        .status(StatusInfo.ACTIVE)
                        //.nickname(userFindResponse.getNickname())
                        .build())
                .collect(Collectors.toList());
    }

    /*@Override
    public List<InquiryResponse> getInquiry(int no) {
        List<InquiryResponse> inquiryList = inquiryRepository.findByNoOrderByNoDesc(no);
        for(InquiryResponse inquiryResponse : inquiryList) {

        }
        return List.of();
    }*/
}
