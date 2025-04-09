"use client";

import React from "react";
import { useLoginForm } from "./../../js/user/useLoginForm";
import { Link, useNavigate } from "react-router-dom"; // useNavigate import 추가 (혹시 필요할까봐)
import { Spinner, Alert } from 'react-bootstrap'; // 로딩 스피너와 알림창 사용 (선택적)

const LoginForm = () => {
    const {
        userId,
        setUserId,
        password,
        setPassword,
        handleLogin,
        handleKakaoLogin,
        isLoading,    // 로딩 상태 가져오기
        loginError,   // 에러 상태 가져오기
    } = useLoginForm();
    // const navigate = useNavigate(); // 페이지 이동이 필요하면 사용

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <h1 className="mb-4 text-center">로그인</h1> {/* text-center 추가 */}

                    {/* --- 로그인 에러 메시지 표시 --- */}
                    {loginError && (
                        <Alert variant="danger" className="text-center">
                            {loginError}
                        </Alert>
                    )}

                    <div className="mb-3">
                        {/* 아이디 입력 */}
                        <input
                            type="text"
                            placeholder="아이디"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="form-control mb-3"
                            disabled={isLoading} // 로딩 중 비활성화
                        />

                        {/* 비밀번호 입력 */}
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control mb-3"
                            disabled={isLoading} // 로딩 중 비활성화
                            onKeyUp={(e) => { // Enter 키로 로그인 시도
                                if (e.key === 'Enter' && !isLoading) {
                                    handleLogin();
                                }
                            }}
                        />

                        {/* 로그인 버튼 */}
                        <button
                            onClick={handleLogin}
                            className="btn btn-outline-secondary w-100 mb-3"
                            disabled={isLoading || !userId || !password} // 로딩 중이거나 입력값이 없으면 비활성화
                        >
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    로그인 중...
                                </>
                            ) : (
                                "로그인"
                            )}
                        </button>


                        <button
                            onClick={handleKakaoLogin}
                            className="btn w-100 mb-3 d-flex align-items-center justify-content-center" // 아이콘/텍스트 정렬 위해 flex 추가
                            style={{ backgroundColor: "#FEE500", color: "#000" }}
                            disabled={isLoading} // 일반 로그인 중 비활성화
                        >
                            <span className="me-2">
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <g fill="none">
                                        <path
                                            fill="#000000"
                                            d="M9 1.5C4.30875 1.5 0.5 4.45875 0.5 8.1C0.5 10.5262 2.11 12.6325 4.5 13.7175L3.625 16.9725C3.5975 17.0925 3.6325 17.22 3.72 17.3025C3.77625 17.355 3.8475 17.3825 3.92 17.3825C3.9775 17.3825 4.035 17.365 4.085 17.33L7.8 14.9325C8.19625 14.9775 8.59625 15 9 15C13.69 15 17.5 12.0412 17.5 8.1C17.5 4.45875 13.69 1.5 9 1.5Z"
                                        />
                                    </g>
                                </svg>
                            </span>
                            카카오 회원가입
                        </button>
                    </div>

                    {/* 아이디/비밀번호 찾기 및 회원가입 링크 */}
                    <div className="text-center">
                        <Link to="/user/findId" className="text-decoration-none text-secondary">
                            아이디 찾기
                        </Link>
                        <span className="mx-2">|</span>
                        <a href="/user/findPwd" className="text-decoration-none text-secondary">
                            비밀번호 찾기
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;