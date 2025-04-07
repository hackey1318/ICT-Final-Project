import { useState } from "react";

const KAKAO_CLIENT_ID = "83d1dc7f3cbc27e375262210a7b0bdeb"; // 카카오 REST API 키
const REDIRECT_URI = "http://localhost:3000/kakao/callback"; // 프론트엔드 콜백 URL

export const useLoginForm = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    // 일반 로그인 처리 로직 (실제 구현 필요)
    const handleLogin = () => {
        // TODO: 실제 API 호출 등 로그인 로직 구현
        console.log("로그인 시도:", userId, password);
        // 예: axios.post('/api/login', { userId, password }).then(...).catch(...);
    };

    // 카카오 로그인 시작 로직
    const handleKakaoLogin = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl; // 카카오 인증 페이지로 리다이렉트
    };

    // 뷰 컴포넌트에 필요한 상태와 함수들을 반환
    return {
        userId,
        setUserId,
        password,
        setPassword,
        handleLogin,
        handleKakaoLogin
        // KAKAO_CLIENT_ID,
        // REDIRECT_URI, 상수들 return 안해도 되는거 같아서 주석 잡아놨는데, 필요하면 주석 풀고 사용하겠습니다.
    };
};

export default useLoginForm;