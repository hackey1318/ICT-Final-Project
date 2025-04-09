package com.ict.finalProject.inquiry.service.impl;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.fileSystem.domain.InquiryImages;
import com.ict.finalProject.inquiry.controller.request.InquiryRequest;
import com.ict.finalProject.inquiry.repository.InquiryRepository;
import com.ict.finalProject.inquiry.repository.domain.Inquiry;
import com.ict.finalProject.inquiry.service.InquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;
    
    @Override
    @Transactional
    public boolean inquiryWrite(InquiryRequest request) {  //문의등록
        try {
            Inquiry saveInquiry = inquiryRepository.save(Inquiry.builder()
                    .userNo(request.getUserNo())
                    .subject(request.getSubject())
                    .content(request.getContent())
                    .status(StatusInfo.ACTIVE).build());

            List<InquiryImages> inquiryImagesList = new ArrayList<>();
            if(request.getImageList() != null) {
                for (String imageId : request.getImageList()) {
                    inquiryImagesList.add(InquiryImages.builder()
                            .no(saveInquiry.getNo())
                            .originName(imageId)
                            .status(StatusInfo.ACTIVE).build());
                }
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
    public List<InquiryRequest> getInquiry(String request) {
        return List.of();
    }

    /*@Override
    public List<InquiryResponse> getInquiry(int no) {
        List<InquiryResponse> inquiryList = inquiryRepository.findByNoOrderByNoDesc(no);
        for(InquiryResponse inquiryResponse : inquiryList) {

        }
        return List.of();
    }*/
}
