package com.ict.finalProject.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    OBJECT_NOT_FOUND("정보를 찾지 못하였습니다."),
    UNAUTHORIZED("인증되지 않은 사용자입니다."),
    INVALID_PARAMETER("입력 값이 잘못하였습니다."),
    ERR_MODIFY_DATA("입력 값이 잘못하였습니다."),
    INTERNAL_SERVER_BUSY("서버가 많은 동작을 하고 있습니다."),
    SIMILAR_REQUEST_FOUND("최근 비슷한 요청 작업이 존재합니다."),
    API_DEVELOP_NOT_YET("해당 기능은 개발 진행 중입니다."),
    INTERNAL_SERVER_ERROR("서버 에러");

    private final String description;

}
