package com.ict.finalProject.cinemate.service.impl;

import com.ict.finalProject.cinemate.controller.request.CineMateRequest;
import com.ict.finalProject.cinemate.repository.CineMateRepository;
import com.ict.finalProject.cinemate.repository.domain.CineMates;
import com.ict.finalProject.cinemate.service.CineMateService;
import com.ict.finalProject.domain.constant.StatusInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CineMateServiceImpl implements CineMateService {

    private final CineMateRepository cineMateRepository;

    @Override
    public boolean generateCineMateInfo(CineMateRequest request) {

        try {
            cineMateRepository.save(CineMates.builder()
                    .userNo(request.getUserNo())
                    .theaterNo(request.getTheaterNo())
                    .movieNo(request.getMovieNo())
                    .maxMemberCount(request.getMaxMemberCount())
                    .meetingDate(request.getMeetingDate())
                    .status(StatusInfo.ACTIVE).build());
            return true;
        } catch (Exception e) {

            return false;
        }
    }
}
