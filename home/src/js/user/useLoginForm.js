import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 import

const KAKAO_CLIENT_ID = "83d1dc7f3cbc27e375262210a7b0bdeb"; // 카카오 REST API 키
const REDIRECT_URI = "http://localhost:3000/kakao/callback"; // 프론트엔드 콜백 URL

export const useLoginForm = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const [loginError, setLoginError] = useState(null); // 에러 상태 추가
    const navigate = useNavigate(); // 페이지 이동 훅

    // 일반 로그인 처리 로직 (API 호출 및 토큰 저장)
    const handleLogin = async () => {
        setIsLoading(true);
        setLoginError(null);

        try {
            const response = await fetch('/oauth/kakao/login', { // 백엔드 주소 확인
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, password: password }),
            });

            const accessToken = response.headers.get('accessToken');
            const responseBody = await response.json(); // 응답 본문 (이제 더 많은 키를 가진 객체)

            if (!response.ok) {
                throw new Error(responseBody.message || `로그인 실패: ${response.status}`);
            }

            if (!accessToken) { /* ... 기존 에러 처리 ... */ }
            if (!responseBody || !responseBody.result) { /* ... 기존 에러 처리 ... */ }

            // 1. accessToken 저장
            sessionStorage.setItem('accessToken', accessToken);

            // --- 2. responseBody(Map 객체)에서 직접 정보 추출하여 userInfo 객체 생성 ---
            const userInfo = {
                userNo: responseBody.userNo,
                nickname: responseBody.nickname,
                profileImageUrl: responseBody.profileImageUrl,
                role: responseBody.role
            };
            // --- 생성된 userInfo 객체를 문자열로 변환하여 저장 ---
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

            // 3. 페이지 이동
            const redirectAfterLoginPath = sessionStorage.getItem('redirectAfterLoginPath');
            if (redirectAfterLoginPath) {
                sessionStorage.removeItem('redirectAfterLoginPath');
                window.location.href = redirectAfterLoginPath;
            } else {
                window.location.href = "/";
            }
        } catch (error) {
            setLoginError(error.message || "로그인 중 알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 카카오 로그인 시작 로직 (기존과 동일)
    const handleKakaoLogin = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    // 뷰 컴포넌트에 필요한 상태와 함수들을 반환
    return {
        userId,
        setUserId,
        password,
        setPassword,
        handleLogin,
        handleKakaoLogin,
        isLoading, // 로딩 상태 반환
        loginError, // 에러 상태 반환
    };
};

export default useLoginForm;