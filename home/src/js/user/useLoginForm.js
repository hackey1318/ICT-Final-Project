import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 import
import apiClient from '../../js/public/axiosConfig'; // apiClient import

const KAKAO_CLIENT_ID = "83d1dc7f3cbc27e375262210a7b0bdeb"; // 카카오 REST API 키
const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI || "http://localhost:3000/kakao/callback"; // 프론트엔드 콜백 URL

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
            const response = await apiClient.post('/oauth/kakao/login', { // 백엔드 주소 확인
                id: userId,
                password: password
            });

            const { accessToken, userNo, nickname, profileImageUrl, role } = response.data;

            if (!accessToken) {
                throw new Error("로그인 실패: Access token 없음.");
            }
            if (!response.data || !response.data.result) {
                throw new Error("로그인 실패: 응답 데이터 오류.");
            }

            // 1. accessToken 저장
            sessionStorage.setItem('accessToken', accessToken);

            // 2. responseBody에서 직접 정보 추출하여 userInfo 객체 생성
            const userInfo = {
                userNo,
                nickname,
                profileImageUrl,
                role
            };

            // 3. 생성된 userInfo 객체를 문자열로 변환하여 저장
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

            // 4. 페이지 이동
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
