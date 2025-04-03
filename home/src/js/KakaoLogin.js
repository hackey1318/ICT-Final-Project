import axios from "axios";
const KakaoLogin = () => {
    const KAKAO_CLIENT_ID = "83d1dc7f3cbc27e375262210a7b0bdeb"; // 카카오 REST API 키
    const REDIRECT_URI = "http://localhost:3000/kakao/callback"; // 프론트엔드 콜백 URL

    const handleLogin = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    return <button onClick={handleLogin}>카카오 로그인</button>;
};

export default KakaoLogin;