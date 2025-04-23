package com.ict.finalProject.report.controller;

import com.ict.finalProject.domain.constant.ReportStatus;
import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.oauth.repository.domain.Users;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

//ReportController에서 유저 정보를 활용하기 위한 로직 구현
public class CustomUserDetails implements UserDetails {

    private final Users member;

    public CustomUserDetails(Users users) {
        this.member = users;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + member.getRole().name()));
    }

    @Override
    public String getUsername() {
        return member.getId();
    }

    @Override
    public String getPassword() {
        return member.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return member.getStatus() != StatusInfo.DEACTIVE; } // 예: 블랙리스트 필드 활용

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return member.getStatus() != StatusInfo.DEACTIVE; }

    public Users getMember() {
        return member;
    }
}
