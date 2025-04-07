import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const KakaoCallback = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // 카카오 로그인 정보 저장
    const [loading, setLoading] = useState(false); // 회원가입 폼 제출 시 로딩 상태
    const [initialLoading, setInitialLoading] = useState(true); // 초기 카카오 정보 로딩 상태
    const [error, setError] = useState(""); // 오류 메시지
    const [success, setSuccess] = useState(""); // 성공 메시지

    // 회원가입 폼 데이터
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        passwordConfirm: "",
        nickName: "",
        gender: "MALE",
        phone1: "",
        phone2: "",
        phone3: ""
    });

    // 컴포넌트 마운트 시 한 번만 실행하여 카카오 코드 처리
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        // 사용자 정보가 아직 없고, 초기 로딩 중일 때만 코드 처리 시도
        if (!user && initialLoading) {
            if (code) {
                console.log("카카오 인증 코드 발견:", code);
                axios
                    .get(`http://localhost:9988/oauth/kakao/login?code=${code}`)
                    .then(response => {
                        console.log("카카오 로그인 정보 수신:", response.data);
                        setUser(response.data); // 카카오 사용자 정보 저장
                        setFormData(prev => ({
                            ...prev,
                            // 카카오 닉네임을 기본 닉네임으로 설정
                            nickName: response.data.kakaoUserInfoDto.knickName
                        }));

                        // *** 중요: 성공적으로 정보를 받아왔으면 URL에서 code 제거 ***
                        // 새로고침 시 /oauth/kakao/login 재호출 방지
                        window.history.replaceState({}, document.title, window.location.pathname);
                        console.log("URL에서 code 제거 완료.");
                    })
                    .catch(error => {
                        console.error("카카오 로그인 실패:", error.response?.data || error.message);
                        setError("카카오 로그인 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
                         // 실패 시에도 URL 정리를 고려할 수 있으나, 보통 디버깅을 위해 남겨둠
                    })
                    .finally(() => {
                        // 성공/실패 여부와 관계없이 초기 카카오 정보 로딩 상태 종료
                        setInitialLoading(false);
                        console.log("초기 카카오 정보 로딩 종료.");
                    });
            } else {
                // URL에 code 자체가 없는 경우 (직접 /oauth/kakao/callback 접근 등)
                console.log("URL에 카카오 인증 코드가 없습니다.");
                setError("유효하지 않은 접근입니다.");
                setInitialLoading(false); // 로딩 상태 종료 (오류 상태로)
            }
        } else if (user) {
             // 만약 어떤 이유로든 이 effect가 다시 실행되었는데 user 정보가 이미 있다면,
             // initialLoading 상태를 false로 확실히 해준다.
             if (initialLoading) {
                console.log("이미 사용자 정보가 로드됨, 초기 로딩 상태 종료.");
                setInitialLoading(false);
             }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <-- 빈 배열: 마운트 시 1회만 실행

    // 폼 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 폼 제출 핸들러 (회원가입 요청)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- 유효성 검사 ---
        if (!formData.id.trim()) {
            setError("아이디를 입력해주세요.");
            return;
        }
        if (!formData.password) {
            setError("비밀번호를 입력해주세요.");
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!formData.nickName.trim()) {
            setError("사용할 닉네임을 입력해주세요.");
            return;
        }
        // 전화번호 유효성 검사는 선택적으로 추가 (예: 숫자만, 길이)

        // 카카오 사용자 정보가 로드되었는지 확인
        if (!user || !user.kakaoUserInfoDto) {
            setError("카카오 사용자 정보가 없습니다. 로그인 과정을 다시 진행해주세요.");
            return;
        }

        // --- 회원가입 요청 ---
        try {
            setLoading(true); // 로딩 시작
            setError(""); // 이전 오류 메시지 초기화
            setSuccess(""); // 이전 성공 메시지 초기화

            // 백엔드로 보낼 데이터 구성
            // 백엔드의 DTO 구조에 맞춰야 함 (kakaoUserInfo 객체 형태인지, 필드 형태인지 확인)
            const registerRequest = {
                id: formData.id,
                password: formData.password,
                nickName: formData.nickName,
                gender: formData.gender,
                // 필요하다면 전화번호 합치기
                // phone: formData.phone1 && formData.phone2 && formData.phone3 ? `${formData.phone1}${formData.phone2}${formData.phone3}` : null,
                // --- 백엔드가 kakaoUserInfo 객체를 받는 경우 ---
                kakaoUserInfo: {
                    kakaoId: user.kakaoUserInfoDto.kakaoId,
                    email: user.kakaoUserInfoDto.email,
                    knickName: user.kakaoUserInfoDto.knickName
                    // profileImage: user.kakaoUserInfoDto.profile // 필요하다면 프로필 이미지 URL도 전송
                }
                // --- 백엔드가 필드를 직접 받는 경우 ---
                // kakaoId: user.kakaoUserInfoDto.kakaoId,
                // email: user.kakaoUserInfoDto.email,
            };

            console.log("회원가입 요청 데이터:", JSON.stringify(registerRequest, null, 2));

            // 백엔드의 /register 엔드포인트는 Spring Security 설정에서 permitAll 되어 있어야 함
            const response = await axios.post("http://localhost:9988/oauth/kakao/register", registerRequest);

            console.log("회원가입 응답:", response);

            // 백엔드 응답 구조에 따라 성공 여부 판단 및 처리
            // 예시: response.status === 200 또는 response.data.success === true 등
            if (response.status === 200 && response.data) { // 성공 응답 예시 (실제 백엔드 응답에 맞게 수정)
                setSuccess("회원가입이 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.");
                setTimeout(() => {
                    navigate("/login"); // 로그인 페이지로 리디렉션
                }, 2000);
            } else {
                // 백엔드에서 구체적인 실패 메시지를 준 경우 표시
                setError(response.data?.message || "회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
            }
        } catch (error) {
            console.error("회원가입 오류:", error.response?.data || error.message);
            // 서버에서 오는 오류 메시지가 있다면 표시, 없다면 일반 메시지
            setError(error.response?.data?.message || "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    // --- 렌더링 로직 ---

    // 1. 초기 카카오 정보 로딩 중일 때
    if (initialLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>카카오 정보를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    // 2. 초기 로딩 후, 카카오 정보 로드 실패 또는 유효하지 않은 접근일 때
    if (!user) { // initialLoading은 false이고 user가 null인 상태
        return (
            <div className="container py-5 text-center">
                 <h2 className="text-danger">오류 발생</h2>
                 <p className="lead my-3">{error || "카카오 정보를 불러오지 못했습니다."}</p>
                 <button onClick={() => navigate('/login')} className="btn btn-primary">
                    로그인 페이지로 돌아가기
                 </button>
            </div>
        );
    }

    // 3. 카카오 정보 로드 성공 -> 회원가입 폼 표시
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="mb-4 text-center">회원가입 (카카오 연동)</h2>

                    {/* 오류/성공 메시지 표시 */}
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    {success && <div className="alert alert-success" role="alert">{success}</div>}

                    {/* 회원가입 폼 */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* 아이디 */}
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">아이디 <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className={`form-control ${!formData.id && error ? 'is-invalid' : ''}`} // 간단한 유효성 시각화
                                id="id"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                required
                                aria-describedby="idHelp"
                            />
                            <div id="idHelp" className="form-text">로그인 시 사용할 아이디를 입력하세요.</div>
                        </div>

                        {/* 비밀번호 */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">비밀번호 <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                className={`form-control ${(!formData.password || (formData.password !== formData.passwordConfirm && formData.passwordConfirm)) && error ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 비밀번호 확인 */}
                        <div className="mb-3">
                            <label htmlFor="passwordConfirm" className="form-label">비밀번호 확인 <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                className={`form-control ${(formData.password !== formData.passwordConfirm) && error ? 'is-invalid' : ''}`}
                                id="passwordConfirm"
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                required
                            />
                            {formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                                <div className="invalid-feedback d-block">비밀번호가 일치하지 않습니다.</div>
                            )}
                        </div>

                        {/* 카카오 프로필 이미지 (있는 경우) */}
                        {user.kakaoUserInfoDto.profile && (
                             <div className="mb-3 text-center">
                                <img
                                    src={user.kakaoUserInfoDto.profile}
                                    alt="카카오 프로필"
                                    className="rounded-circle shadow-sm"
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                />
                             </div>
                        )}

                        {/* 이메일 (카카오 제공, 읽기 전용) */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">이메일 (카카오 제공)</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={user.kakaoUserInfoDto.email || '비공개 또는 제공되지 않음'}
                                readOnly
                                disabled
                            />
                        </div>

                        {/* 카카오 닉네임 (참고용, 읽기 전용) */}
                        <div className="mb-3">
                            <label htmlFor="kakaoNickname" className="form-label">카카오 닉네임</label>
                            <input
                                type="text"
                                className="form-control"
                                id="kakaoNickname"
                                value={user.kakaoUserInfoDto.knickName}
                                readOnly
                                disabled
                            />
                        </div>

                         {/* 사용할 닉네임 (입력) */}
                         <div className="mb-3">
                            <label htmlFor="nickName" className="form-label">사용할 닉네임 <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className={`form-control ${!formData.nickName && error ? 'is-invalid' : ''}`}
                                id="nickName"
                                name="nickName"
                                value={formData.nickName}
                                onChange={handleChange}
                                required
                                maxLength={20} // 닉네임 길이 제한 예시
                            />
                         </div>

                         {/* 연락처 (선택) */}
                         <div className="mb-3">
                            <label className="form-label">연락처 (선택)</label>
                            <div className="input-group">
                                <input type="tel" className="form-control" placeholder="010" name="phone1" value={formData.phone1} onChange={handleChange} maxLength={3} style={{ flex: "0 0 80px" }} />
                                <span className="input-group-text">-</span>
                                <input type="tel" className="form-control" placeholder="1234" name="phone2" value={formData.phone2} onChange={handleChange} maxLength={4} />
                                <span className="input-group-text">-</span>
                                <input type="tel" className="form-control" placeholder="5678" name="phone3" value={formData.phone3} onChange={handleChange} maxLength={4} />
                            </div>
                            <div className="form-text">입력 시 본인 인증 등에 활용될 수 있습니다.</div>
                        </div>

                         {/* 성별 */}
                        <fieldset className="mb-3">
                            <legend className="col-form-label col-sm-2 pt-0 fs-6">성별 <span className="text-danger">*</span></legend>
                            <div className="d-flex gap-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="gender" id="male" value="MALE" checked={formData.gender === "MALE"} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="male">남성</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="gender" id="female" value="FEMALE" checked={formData.gender === "FEMALE"} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="female">여성</label>
                                </div>
                            </div>
                        </fieldset>

                        {/* 가입 버튼 */}
                        <div className="d-grid mt-4">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        가입 처리 중...
                                    </>
                                ) : "가입 완료하기"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KakaoCallback;