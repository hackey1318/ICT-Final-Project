package com.ict.finalProject.Announcement.repository.impl;

import com.ict.finalProject.Announcement.controller.response.AnnouncementResponse;
import com.ict.finalProject.Announcement.repository.AnnouncementsCustomRepository;
import com.ict.finalProject.Announcement.repository.constant.AnnounceSearchType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementsCustomRepositoryImpl implements AnnouncementsCustomRepository {

    private final EntityManager em;

    @Override
    public Page<AnnouncementResponse> searchByCondition(String keyword, AnnounceSearchType type, Pageable pageable, boolean isUser) {

        StringBuilder base = new StringBuilder("SELECT new com.ict.finalProject.Announcement.controller.response.AnnouncementResponse(a.id AS id, a.title AS title, a.createdAt AS createdAt, u.no AS userNo, u.nickname AS nickname, u.role AS role) FROM Announcements AS a LEFT JOIN Users AS u ON a.userNo = u.no");

        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        List<String> conditions = new ArrayList<>();

        if (hasKeyword) {
            String keywordCondition = switch (type) {
                case TITLE -> "a.title LIKE :keyword";
                case CONTENT -> "a.content LIKE :keyword";
                case ALL -> "(a.title LIKE :keyword OR a.content LIKE :keyword)";
            };
            conditions.add(keywordCondition);
        }

        if (isUser) {
            conditions.add("a.status = 'ACTIVE'");
        }

        if (!conditions.isEmpty()) {
            base.append(" WHERE ").append(String.join(" AND ", conditions));
        }

        TypedQuery<AnnouncementResponse> query = em.createQuery(base.toString(), AnnouncementResponse.class);

        if (hasKeyword) {
            query.setParameter("keyword", "%" + keyword + "%");
        }

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<AnnouncementResponse> content = query.getResultList();
        long total = countByCondition(keyword, type, isUser);

        return new PageImpl<>(content, pageable, total);
    }

    private long countByCondition(String keyword, AnnounceSearchType type, boolean isUser) {
        StringBuilder countQuery = new StringBuilder("SELECT COUNT(a) FROM Announcements a");

        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        List<String> conditions = new ArrayList<>();

        if (hasKeyword) {
            String keywordCondition = switch (type) {
                case TITLE -> "a.title LIKE :keyword";
                case CONTENT -> "a.content LIKE :keyword";
                case ALL -> "(a.title LIKE :keyword OR a.content LIKE :keyword)";
            };
            conditions.add(keywordCondition);
        }

        if (isUser) {
            conditions.add("a.status = 'ACTIVE'");
        }

        if (!conditions.isEmpty()) {
            countQuery.append(" WHERE ").append(String.join(" AND ", conditions));
        }

        TypedQuery<Long> query = em.createQuery(countQuery.toString(), Long.class);

        if (hasKeyword) {
            query.setParameter("keyword", "%" + keyword.trim() + "%");
        }

        return query.getSingleResult();
    }
}
