"use client"

import { useState } from "react"

const LoginForm = () => {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")

  const KAKAO_CLIENT_ID = "83d1dc7f3cbc27e375262210a7b0bdeb" // 카카오 REST API 키
  const REDIRECT_URI = "http://localhost:3000/kakao/callback" // 프론트엔드 콜백 URL

  const handleLogin = () => {
    // 일반 로그인 로직 구현
    console.log("로그인 시도:", userId, password)
  }

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`
    window.location.href = kakaoAuthUrl
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <h1 className="mb-4">로그인</h1>

          <div className="mb-3">
            {/* 아이디 입력 */}
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="form-control mb-3"
            />

            {/* 비밀번호 입력 */}
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control mb-3"
            />

            {/* 로그인 버튼 */}
            <button onClick={handleLogin} className="btn btn-outline-secondary w-100 mb-3">
              로그인
            </button>

            {/* 카카오 로그인 버튼 */}
            <button
              onClick={handleKakaoLogin}
              className="btn w-100 mb-3"
              style={{ backgroundColor: "#FEE500", color: "#000" }}
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
              카카오로 회원가입
            </button>
          </div>

          {/* 아이디/비밀번호 찾기 링크 */}
          <div className="text-center">
            <a href="#" className="text-decoration-none text-secondary">
              아이디 찾기
            </a>
            <span className="mx-2">|</span>
            <a href="#" className="text-decoration-none text-secondary">
              비밀번호 찾기
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm

