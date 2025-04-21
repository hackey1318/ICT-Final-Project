package com.ict.finalProject.Announcement.repository.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AnnounceSearchType {
    ALL("제목 + 본문"),
    TITLE("제목"),
    CONTENT("본문");

    private final String description;
}
