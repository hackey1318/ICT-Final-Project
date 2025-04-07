import React from "react";
// import { useNavigate } from "react-router-dom"; // 훅에서 반환하므로 여기서 직접 사용 안 함
import "bootstrap/dist/css/bootstrap.min.css";
import { useKakaoCallback } from "./../../js/user/useKakaoCallback"; // 커스텀 훅 import (경로 확인!)

const KakaoCallback = () => {
    // 커스텀 훅 호출하여 상태와 함수들 가져오기
    const {
        user,
        loading,
        initialLoading,
        apiError,
        success,
        formData,
        errors,
        idCheckLoading,
        idCheckStatus,
        idCheckMessage,
        handleChange,
        handleIdCheck,
        handleSubmit,
        navigate // 훅에서 반환된 navigate 사용
    } = useKakaoCallback();

    // --- 로딩 및 에러 처리 UI ---
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

    // user 정보가 없고 로딩이 끝났을 때 (에러 또는 이미 가입된 경우)
    if (!user && !initialLoading) {
        return (
            <div className="container py-5 text-center">
                 <h2 className="text-danger mb-3">알림</h2> {/* 타이틀 변경 */}
                 <p className="lead my-3">{apiError || "카카오 정보를 불러오지 못했습니다."}</p>
                 <button onClick={() => navigate('/login')} className="btn btn-primary">
                    로그인 페이지로 돌아가기
                 </button>
            </div>
        );
    }
    // --- ---

    // --- 메인 회원가입 폼 ---
    // user 정보가 있어야 이 부분이 렌더링됨 (훅에서 user 상태 설정 시)
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="mb-4 text-center">회원가입 (카카오 연동)</h2>

                    {/* 서버 API 에러 메시지 */}
                    {apiError && <div className="alert alert-danger" role="alert">{apiError}</div>}
                    {/* 성공 메시지 */}
                    {success && <div className="alert alert-success" role="alert">{success}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* 아이디 + 중복 확인 버튼 */}
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">아이디 <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control ${(errors.id || idCheckStatus === 'duplicate') ? 'is-invalid' : (idCheckStatus === 'available' ? 'is-valid' : '')}`}
                                    id="id"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange} // 훅에서 가져온 핸들러 연결
                                    required
                                    aria-describedby="idHelp idCheckHelp idError"
                                    aria-invalid={!!errors.id || idCheckStatus === 'duplicate'}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={handleIdCheck} // 훅에서 가져온 핸들러 연결
                                    disabled={idCheckLoading || formData.id.length < 4}
                                >
                                    {idCheckLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            확인 중
                                        </>
                                    ) : "중복 확인"}
                                </button>
                            </div>
                            {errors.id && idCheckStatus !== 'duplicate' && <div id="idError" className="invalid-feedback d-block">{errors.id}</div>}
                             <div
                                id="idCheckHelp"
                                className={`form-text ${
                                    idCheckStatus === 'available' ? 'text-success' :
                                    idCheckStatus === 'duplicate' || idCheckStatus === 'error' || idCheckStatus === 'invalid' ? 'text-danger' :
                                    'text-muted'
                                }`}
                                style={{ minHeight: '1.2em' }}
                            >
                                {idCheckMessage || "로그인 시 사용할 아이디 (4자 이상)"}
                            </div>
                        </div>

                         {/* 비밀번호 */}
                         <div className="mb-3">
                            <label htmlFor="password" className="form-label">비밀번호 <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange} // 훅에서 가져온 핸들러 연결
                                required
                                aria-describedby="passwordHelp passwordError"
                                aria-invalid={!!errors.password}
                            />
                            {errors.password && <div id="passwordError" className="invalid-feedback">{errors.password}</div>}
                            <div id="passwordHelp" className="form-text">비밀번호 (8자 이상)</div>
                        </div>

                        {/* 비밀번호 확인 */}
                        <div className="mb-3">
                            <label htmlFor="passwordConfirm" className="form-label">비밀번호 확인 <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                                id="passwordConfirm"
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleChange} // 훅에서 가져온 핸들러 연결
                                required
                                aria-describedby="passwordConfirmError"
                                aria-invalid={!!errors.passwordConfirm}
                            />
                            {errors.passwordConfirm && <div id="passwordConfirmError" className="invalid-feedback">{errors.passwordConfirm}</div>}
                        </div>

                        {/* 카카오 프로필 이미지 */}
                        {user?.kakaoUserInfoDto?.profile && (
                             <div className="mb-3 text-center">
                                <img
                                    src={user.kakaoUserInfoDto.profile}
                                    alt="카카오 프로필"
                                    className="rounded-circle shadow-sm"
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                />
                             </div>
                        )}

                        {/* 이메일 (읽기 전용) */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">이메일 (카카오 제공)</label>
                            <input type="email" className="form-control" id="email" value={user?.kakaoUserInfoDto?.email || '비공개'} readOnly disabled />
                        </div>

                        {/* 카카오 닉네임 (읽기 전용, 참고용) */}
                        <div className="mb-3">
                            <label htmlFor="kakaoNickname" className="form-label">카카오 닉네임</label>
                            <input type="text" className="form-control" id="kakaoNickname" value={user?.kakaoUserInfoDto?.knickName || ''} readOnly disabled />
                        </div>

                         {/* 사용할 닉네임 */}
                         <div className="mb-3">
                            <label htmlFor="nickName" className="form-label">사용할 닉네임 <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className={`form-control ${errors.nickName ? 'is-invalid' : ''}`}
                                id="nickName"
                                name="nickName"
                                value={formData.nickName}
                                onChange={handleChange} // 훅에서 가져온 핸들러 연결
                                required
                                maxLength={20}
                                aria-describedby="nickNameError"
                                aria-invalid={!!errors.nickName}
                            />
                            {errors.nickName && <div id="nickNameError" className="invalid-feedback">{errors.nickName}</div>}
                         </div>

                         {/* 연락처 */}
                         <div className="mb-3">
                            <label className="form-label">연락처 (선택)</label>
                             <div className={`input-group ${errors.phone ? 'is-invalid' : ''}`}>
                                <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} placeholder="010" name="phone1" value={formData.phone1} onChange={handleChange} maxLength={3} style={{ flex: "0 0 80px" }} aria-label="연락처 첫 부분" aria-describedby="phoneError" aria-invalid={!!errors.phone}/>
                                <span className="input-group-text">-</span>
                                <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} placeholder="1234" name="phone2" value={formData.phone2} onChange={handleChange} maxLength={4} aria-label="연락처 중간 부분" aria-describedby="phoneError" aria-invalid={!!errors.phone}/>
                                <span className="input-group-text">-</span>
                                <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} placeholder="5678" name="phone3" value={formData.phone3} onChange={handleChange} maxLength={4} aria-label="연락처 마지막 부분" aria-describedby="phoneError" aria-invalid={!!errors.phone}/>
                            </div>
                            {errors.phone && <div id="phoneError" className="invalid-feedback d-block">{errors.phone}</div>}
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
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading || idCheckStatus !== 'available' || formData.id !== lastCheckedId?.current} // lastCheckedId는 ref이므로 .current 접근은 훅 내부에서 처리됨. 훅에서 boolean 플래그를 반환하는 것이 더 깔끔할 수 있음. 하지만 일단 동작은 할 것임.
                            >
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