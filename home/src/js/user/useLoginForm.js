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
        console.log("로그인 시도:", userId, password);

        try {
            const response = await fetch('http://localhost:9988/oauth/kakao/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, password: password }),
            });

            // 응답 상태 확인
            if (!response.ok) { // 4xx, 5xx 에러 포함
                let errorMessage = `로그인 실패: ${response.status}`; // 기본 에러 메시지
                try {
                    // *** 백엔드가 본문에 보내준 JSON 에러 메시지 파싱 시도 ***
                    const errorData = await response.json();
                    // *** 백엔드 응답에서 'message' 필드를 읽어 에러 메시지로 사용 ***
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    // JSON 파싱 실패 시 (예: 500 에러인데 HTML 응답 등) 기본 메시지 유지
                    console.error("Error parsing error response body:", jsonError);
                }
                // 최종 결정된 에러 메시지로 Error 객체 생성
                throw new Error(errorMessage);
            }

            // --- 성공 응답 처리 ---
            const accessToken = response.headers.get('accessToken');
            if (!accessToken) {
                console.error("로그인은 성공했지만 응답 헤더에 accessToken이 없습니다.");
                throw new Error("인증 토큰을 받지 못했습니다. 서버 설정을 확인하세요.");
            }
            sessionStorage.setItem('accessToken', accessToken);
            console.log("로그인 성공! accessToken 저장:", accessToken);
            navigate('/');

        } catch (error) {
            // 여기서 잡힌 error.message는 위 if(!response.ok) 블록에서 throw한 메시지이거나,
            // 네트워크 오류 등의 다른 예외 메시지일 수 있음.
            console.error("로그인 API 호출 또는 처리 중 에러:", error);
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