package com.ict.finalProject.report.service.impl;

import com.ict.finalProject.domain.constant.ReportBoard;
import com.ict.finalProject.domain.constant.ReportStatus;
import com.ict.finalProject.oauth.repository.domain.Users;
import com.ict.finalProject.report.controller.request.ReportRequest;
import com.ict.finalProject.report.controller.response.ReportResponse;
import com.ict.finalProject.report.repository.ReportRepository;
import com.ict.finalProject.report.repository.domain.Report;
import com.ict.finalProject.report.service.ReportService;
import com.ict.finalProject.review.repository.MovieReviewRepository;
import com.ict.finalProject.review.repository.domain.MovieReview;
import com.ict.finalProject.user.repository.FindUserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final FindUserRepository findUserRepository;
    private final MovieReviewRepository movieReviewRepository;

    @Override
    public ReportResponse reportUser(ReportRequest request, int reporterNo) {
        log.info("신고 생성 서비스 시작 - reporter: {}, request: {}", reporterNo, request);

        Integer targetUserId = findTargetUserId(request.getType(), request.getBoardNo());
        if (targetUserId == null) {
            log.warn("신고대상 콘텐츠 또는 작성자를 찾을 수 없음 : type={}, id={}", request.getType(), request.getBoardNo());
            throw new EntityNotFoundException("신고하려는 대상을 찾을 수 없습니다. (ID:" + request.getBoardNo() + ")");
        }
        log.debug("신고 대상자 ID 확인 : {}", targetUserId);

        Report report = Report.builder()
                .reporterNo(reporterNo)
                .targetNo(targetUserId)
                .boardNo(request.getBoardNo())
                .category(request.getCategory())
                .content(request.getContent())
                .type(request.getType())
                .status(ReportStatus.PENDING)
                .build();
        log.debug("저장될 Report 엔티티: {}", report);

        Report savedReport;
        try {
            savedReport = reportRepository.save(report);
            log.info("신고 정보 DB 저장 성공: reportNo={}", savedReport.getNo());
        } catch (Exception e) {
            log.error("Report 저장 중 DB 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("신고 정보 저장 중 오류가 발생했습니다.", e);
        }

        ReportResponse reportResponse = mapToResponseDto(savedReport);
        if (reportResponse == null) {
            log.error("결과 DTO 변환 중 오류 발생: reportNo={}", savedReport.getNo());
            throw new RuntimeException("신고 처리 결과 생성 중 오류가 발생했습니다.");
        }
        log.info("신고 생성 서비스 종료 - reportNo: {}", reportResponse.getNo());
        return reportResponse;
    }

    @Override
    public Page<ReportResponse> getReportList(Pageable pageable) {
        Page<Report> reportPage = reportRepository.findAllByOrderByNoDesc(pageable);
        Page<ReportResponse> reportResponsePage = reportPage.map(report -> {
            try {
                ReportResponse reportResponse = mapToResponseDto(report);
                return reportResponse;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        });
        return reportResponsePage;
    }

    //신고상세페이지
    @Override
    public ReportResponse getReportDetail(int no) {
        log.info("신고 상세 정보 조회 서비스 시작 - reportNo: {}", no);
        Report reportEntity = reportRepository.findById(no)
                .orElseThrow(() -> {
                    log.warn("ID {}에 해당하는 신고를 찾을 수 없습니다.", no);
                    return new EntityNotFoundException("ID " + no + "에 해당하는 신고를 찾을 수 없습니다.");
                });

        try {
            ReportResponse reportResponse = mapToResponseDto(reportEntity);

            if (reportResponse == null) {
                // mapToResponseDto가 내부 오류로 null을 반환한 경우
                log.error("Report 엔티티를 ReportResponse DTO로 변환하는 데 실패했습니다. (reportNo={})", no);
                // 이 경우 null을 반환하거나, 별도의 예외를 발생시킬 수 있음
                // 여기서는 null을 반환하여 컨트롤러에서 500 에러 처리를 유도
                return null;
            }

            log.info("신고 상세 정보 조회 서비스 완료 - reportNo: {}", no);
            return reportResponse;

        } catch (Exception e) {
            // mapToResponseDto 실행 중 예상치 못한 예외 발생 시
            log.error("mapToResponseDto 실행 중 예외 발생 (reportNo={}): {}", no, e.getMessage(), e);
            // 여기서도 null 반환 또는 예외 발생 가능
            // RuntimeException을 던져서 컨트롤러에서 500 에러 처리 유도 가능
            throw new RuntimeException("신고 상세 정보 변환 중 오류가 발생했습니다.", e);
        }
    }

    private Integer findTargetUserId(ReportBoard type, int boardNo) {
        log.debug("신고 대상 사용자 ID 조회 시작: type={}, contentId={}", type, boardNo);
        Optional<Integer> targetUserIdOpt = Optional.empty();

        try {
            if (type == ReportBoard.MOVIEREVIEW) {
                log.debug("ID {} 에 해당하는 영화 리뷰 작성자 ID 조회 시작", boardNo);
                targetUserIdOpt = movieReviewRepository.findById(boardNo)
                        .map(MovieReview::getUserNo);
                if (!targetUserIdOpt.isPresent()) {
                    log.warn("ID {}에 해당하는 영화 리뷰를 찾을 수 없습니다.", boardNo);
                } else {
                    log.debug("ID {} 영화 리뷰 작성자 ID 조회 성공: {}", boardNo, targetUserIdOpt.get());
                }
            } else if (type == ReportBoard.GOODSREVIEW) {
                log.warn("GOODSREVIEW 타입에 대한 findTargetUserId 로직 구현 필요!");
            } else if (type == ReportBoard.CINEMATE) {
                log.warn("CINEMATE 타입에 대한 findTargetUserId 로직 구현 필요!");
            } else {
                log.warn("지원하지 않는 신고 대상 타입: {}", type);
                return null;
            }
        } catch (Exception e) {
            log.error("대상 사용자 ID 조회 중 오류 발생: type={}, id={}", type, boardNo, e);
            return null;
        }
        return targetUserIdOpt.orElse(null);
    }

    private ReportResponse mapToResponseDto(Report report) {
        log.debug("Report 엔티티 -> DTO 변환 시작: reportNo={}", report.getNo());
        if (report == null) {
            log.warn("입력된 Report 엔티티가 null입니다.");
            return null;
        }

        try {
            String reporterNickname = Optional.ofNullable(report.getReporterNo())
                    .flatMap(findUserRepository::findById)
                    .map(Users::getNickname)
                    .orElse("알 수 없음");

            String targetNickname = Optional.ofNullable(report.getTargetNo())
                    .flatMap(findUserRepository::findById)
                    .map(Users::getNickname)
                    .orElse("알 수 없음");

            String staffNickname = Optional.ofNullable(report.getStaffNo())
                    .flatMap(findUserRepository::findById)
                    .map(Users::getNickname)
                    .orElse(null);

            return ReportResponse.builder()
                    .no(report.getNo())
                    .reporterNickname(reporterNickname)
                    .targetNickname(targetNickname)
                    .boardNo(report.getBoardNo())
                    .category(report.getCategory())
                    .content(report.getContent())
                    .type(report.getType())
                    .status(report.getStatus())
                    .createdAt(report.getCreatedAt())
                    .build();
        } catch (Exception e) {
            log.error("DTO 변환 중 오류 발생: reportNo={}", report.getNo(), e);
            return null;
        }
    }
}
