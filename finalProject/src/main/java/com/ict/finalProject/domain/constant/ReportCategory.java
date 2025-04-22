package com.ict.finalProject.domain.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportCategory {

    ABUSE("욕설"),
    CHEAT("사기"),
    ILLEGALAD("불법광고"),
    PORNOGRAPHY("음란물게시"),
    BADSPORT("비매너행위"),
    ETC("기타");

    private final String description;
}
