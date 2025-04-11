import { useState } from "react"

import "../../css/admin/admin.css" // CSS 파일 임포트 (실제 경로로 수정 필요)


// 로고 이미지 임포트 (실제 경로로 수정 필요)
import logo from "../../img/cinetogether.png"
import useLoginForm from "../../js/user/useLoginForm";
import { Alert, Spinner } from "react-bootstrap";


export default function ManagerLogin() {
	const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const [loginError, setLoginError] = useState(null); // 에러 상태 추가

	const handleLogin = async () => {
        setIsLoading(true);
        setLoginError(null);

        try {
            const response = await fetch('http://localhost:9988/oauth/kakao/login', { // 백엔드 주소 확인
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
            window.location.href = "/manager/home";

        } catch (error) {
            setLoginError(error.message || "로그인 중 알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

	return (
		<div className="container d-flex justify-content-center align-items-center vh-100">
			<div className="card shadow rounded position-relative custom-card">
				{/* --- 로그인 에러 메시지 표시 --- */}
				{loginError && (
                    <Alert variant="danger" className="text-center">
                        {loginError}
                    </Alert>
                )}
				<div className="logo-container mb-4">
					<img src={logo} alt="CINETOGETHER" className="logo-img" />
				</div>

				<form onSubmit={handleLogin}>
					<div className="mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="아이디"
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
							disabled={isLoading} // 로딩 중 비활성화
						/>
					</div>

					<div className="mb-3">
						<input
							type="password"
							className="form-control"
							placeholder="비밀번호"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading} // 로딩 중 비활성화
							onKeyUp={(e) => { // Enter 키로 로그인 시도
                                if (e.key === 'Enter' && !isLoading) {
                                    handleLogin();
                                }
                            }}
						/>
					</div>

					<div className="d-grid mb-3">
						<button
                            onClick={handleLogin}
                            className="btn btn-light"
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
					</div>
				</form>

				<div className="text-center mt-3 small">
					<a href="/manager/find-id" className="text-decoration-none text-secondary">
						아이디 찾기
					</a>
					<span className="divider">|</span>
					<a href="/manager/find-password" className="text-decoration-none text-secondary">
						비밀번호 찾기
					</a>
					<span className="divider">|</span>
					<a href="/manager/register" className="text-decoration-none text-secondary">
						회원가입
					</a>
				</div>
			</div>
		</div>
	)
}