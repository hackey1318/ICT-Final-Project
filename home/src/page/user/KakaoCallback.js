import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useKakaoCallback } from "./../../js/user/useKakaoCallback"; // 커스텀 훅 import (경로 확인!)
import { Spinner } from 'react-bootstrap'; // 로딩 스피너 사용 (선택적)

const KakaoCallback = () => {
    // 커스텀 훅 호출하여 필요한 모든 상태와 함수 가져오기
    const {
        user,
        loading, // 회원가입 폼 제출 로딩
        initialLoading, // 초기 카카오 정보 로딩
        apiError, // 회원가입 API 에러
        success, // 회원가입 성공 메시지
        formData,
        errors,
        idCheckLoading,
        idCheckStatus,
        idCheckMessage,
        // --- 이미지 관련 ---
        // selectedFile, // 직접 사용할 일은 적음
        // uploadedImageId, // 상태 표시에 사용 가능
        uploadLoading, // 파일 업로드 로딩
        uploadError, // 파일 업로드 에러
        previewImageUrl, // 이미지 미리보기 URL
        handleFileChange, // 파일 선택 핸들러 연결
        handleResetProfileImage, // 이미지 리셋 핸들러 연결 (선택적)
        // --- 핸들러 ---
        handleChange,
        handleIdCheck,
        handleSubmit,
        // --- 기타 ---
        navigate,
        handlePhoneCheck,
        phoneCheckLoading,
        phoneCheckStatus,
        phoneCheckMessage,
        // lastCheckedId // 직접 사용할 일은 적음
    } = useKakaoCallback();

    // --- 로딩 및 초기 에러 처리 UI ---
    if (initialLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <p>카카오 정보를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    // user 정보 없이 로딩 끝났을 때 (카카오 로그인 실패 또는 이미 가입된 경우 등)
    // apiError 상태를 활용
    if (!user && !initialLoading) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 text-center">
                        <h2 className="text-danger mb-3">알림</h2>
                        <p className="lead my-4">{apiError || "카카오 정보를 불러오지 못했습니다."}</p>
                        {/* 로그인 페이지 이동 버튼 또는 카카오 로그인 재시도 버튼 등 */}
                        <button onClick={() => navigate('/login')} className="btn btn-primary me-2">
                            로그인 페이지로
                        </button>
                        {/* 카카오 로그인 재시도 로직은 복잡하므로 여기서는 생략 */}
                    </div>
                </div>
            </div>
        );
    }
    // --- ---

    // --- 메인 회원가입 폼 (user 정보가 있을 때 렌더링) ---
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="mb-4 text-center">회원가입 (카카오 연동)</h2>

                    {/* --- 에러 및 성공 메시지 표시 --- */}
                    {/* 회원가입 API 에러 */}
                    {apiError && <div className="alert alert-danger" role="alert">{apiError}</div>}
                    {/* 회원가입 성공 */}
                    {success && <div className="alert alert-success" role="alert">{success}</div>}
                    {/* 파일 업로드 에러 */}
                    {uploadError && <div className="alert alert-warning" role="alert">{uploadError}</div>}
                    {/* --- --- */}


                    <form onSubmit={handleSubmit} noValidate>

                        {/* --- 프로필 이미지 섹션 --- */}
                        <div className="mb-4 text-center">
                             <label htmlFor="profileImageUpload" className="form-label d-block mb-2">프로필 이미지 (필수)</label>
                             {/* 이미지 미리보기 */}
                             <img
                                 src={previewImageUrl || '/path/to/default/avatar.png'} // previewImageUrl 사용, 없을 경우 기본 이미지 경로
                                 alt="프로필 미리보기"
                                 className="rounded-circle shadow-sm mb-2"
                                 style={{ width: "100px", height: "100px", objectFit: "cover", cursor: 'pointer', border: uploadError ? '2px solid red' : 'none' }}
                                 // 이미지 클릭 시 파일 입력 트리거
                                 onClick={() => document.getElementById('profileImageUpload').click()}
                             />
                             {/* 파일 업로드 로딩 표시 */}
                             {uploadLoading && (
                                 <div className="d-flex justify-content-center align-items-center mt-1">
                                     <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                                     <span>업로드 중...</span>
                                 </div>
                             )}

                             {/* 파일 입력 (숨김 처리하고 label이나 이미지 클릭으로 트리거) */}
                             <input
                                 type="file"
                                 className="form-control d-none" // 시각적으로 숨김
                                 id="profileImageUpload"
                                 accept="image/*" // 이미지 파일만 선택하도록 유도
                                 onChange={handleFileChange} // 파일 선택 시 핸들러 호출
                             />
                             {/* 파일 선택 버튼 (스타일링된 버튼) */}
                             <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm mt-2"
                                onClick={() => document.getElementById('profileImageUpload').click()}
                                disabled={uploadLoading} // 업로드 중 비활성화
                             >
                                이미지 변경
                             </button>
                             {/* 업로드된 이미지 제거 버튼 (선택적) */}
                             {previewImageUrl && previewImageUrl !== user?.kakaoUserInfoDto?.profile && ( // 현재 이미지가 카카오 기본 이미지가 아닐 때만 표시
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm mt-2 ms-2"
                                    onClick={handleResetProfileImage} // 리셋 핸들러 호출
                                    disabled={uploadLoading}
                                >
                                    기본 이미지로
                                </button>
                             )}
                             <div className="form-text mt-1">5MB 이하의 이미지 파일을 선택해주세요.</div>
                        </div>
                        {/* --- --- */}


                        {/* 아이디 + 중복 확인 버튼 */}
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">아이디 <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control ${(errors.id || idCheckStatus === 'duplicate' || idCheckStatus === 'invalid') ? 'is-invalid' : (idCheckStatus === 'available' ? 'is-valid' : '')}`}
                                    id="id"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    required
                                    aria-describedby="idHelp idCheckHelp idError"
                                    aria-invalid={!!errors.id || idCheckStatus === 'duplicate' || idCheckStatus === 'invalid'}
                                    disabled={loading} // 전체 폼 제출 중 비활성화
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={handleIdCheck}
                                    disabled={idCheckLoading || formData.id.length < 4 || loading} // 아이디 길이 조건 추가, 전체 폼 제출 중 비활성화
                                >
                                    {idCheckLoading ? (
                                        <><Spinner animation="border" size="sm" className="me-1" /> 확인 중</>
                                    ) : "중복 확인"}
                                </button>
                            </div>
                            {/* 유효성 검사 에러 메시지 (중복 에러는 idCheckMessage로 처리됨) */}
                            {errors.id && idCheckStatus !== 'duplicate' && idCheckStatus !== 'invalid' &&
                                <div id="idError" className="invalid-feedback d-block">{errors.id}</div>
                            }
                            {/* 중복 확인 결과 메시지 */}
                             <div
                                id="idCheckHelp"
                                className={`form-text mt-1 ${
                                    idCheckStatus === 'available' ? 'text-success' :
                                    (idCheckStatus === 'duplicate' || idCheckStatus === 'error' || idCheckStatus === 'invalid') ? 'text-danger' :
                                    'text-muted' // unchecked, checking
                                }`}
                                style={{ minHeight: '1.2em' }} // 메시지 공간 확보
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
                                onChange={handleChange}
                                required
                                aria-describedby="passwordHelp passwordError"
                                aria-invalid={!!errors.password}
                                disabled={loading}
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
                                onChange={handleChange}
                                required
                                aria-describedby="passwordConfirmError"
                                aria-invalid={!!errors.passwordConfirm}
                                disabled={loading}
                            />
                            {errors.passwordConfirm && <div id="passwordConfirmError" className="invalid-feedback">{errors.passwordConfirm}</div>}
                        </div>

                        {/* 이메일 (읽기 전용) */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">이메일 (카카오 제공)</label>
                            <input type="email" className="form-control" id="email" value={user?.kakaoUserInfoDto?.email || '비공개 또는 없음'} readOnly disabled />
                        </div>

                        {/* 카카오 닉네임 (참고용, 읽기 전용) */}
                        {/* <div className="mb-3">
                            <label htmlFor="kakaoNickname" className="form-label">카카오 닉네임</label>
                            <input type="text" className="form-control" id="kakaoNickname" value={user?.kakaoUserInfoDto?.knickName || ''} readOnly disabled />
                        </div> */}

                         {/* 사용할 닉네임 */}
                         <div className="mb-3">
                            <label htmlFor="nickName" className="form-label">사용할 닉네임 <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className={`form-control ${errors.nickName ? 'is-invalid' : ''}`}
                                id="nickName"
                                name="nickName"
                                value={formData.nickName} // 카카오 닉네임으로 초기화됨 (훅에서)
                                onChange={handleChange}
                                required
                                maxLength={20}
                                aria-describedby="nickNameError"
                                aria-invalid={!!errors.nickName}
                                disabled={loading}
                            />
                            {errors.nickName && <div id="nickNameError" className="invalid-feedback">{errors.nickName}</div>}
                            <div className="form-text">서비스 내에서 사용할 닉네임 (20자 이하)</div>
                         </div>

                         {/* 연락처 */}
                         <div className="mb-3">
                            <label className="form-label">연락처<span className="text-danger">*</span></label>
                            <div className={`input-group ${errors.phone ? 'is-invalid' : ''}`}>
                                <input type="tel" name="phone1" value={formData.phone1} onChange={handleChange} maxLength={3} className={`form-control ${errors.phone ? 'is-invalid' : ''}`} />
                                <span className="input-group-text">-</span>
                                <input type="tel" name="phone2" value={formData.phone2} onChange={handleChange} maxLength={4} className={`form-control ${errors.phone ? 'is-invalid' : ''}`} />
                                <span className="input-group-text">-</span>
                                <input type="tel" name="phone3" value={formData.phone3} onChange={handleChange} maxLength={4} className={`form-control ${errors.phone ? 'is-invalid' : ''}`} />
                                <button type="button" className="btn btn-outline-secondary" onClick={handlePhoneCheck} disabled={phoneCheckLoading || errors.phone || !formData.phone1 || !formData.phone2 || !formData.phone3}>
                                {phoneCheckLoading ? '확인 중…' : '중복 확인'}
                                </button>
                            </div>
                            <div className={`form-text ${phoneCheckStatus==='available' ? 'text-success' : 'text-danger'}`}>{phoneCheckMessage}</div>
                            </div>

                         {/* 성별 */}
                        <fieldset className="mb-3">
                            <legend className="col-form-label pt-0 fs-6">성별 <span className="text-danger">*</span></legend>
                            <div className="d-flex gap-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="gender" id="male" value="MALE" checked={formData.gender === "MALE"} onChange={handleChange} disabled={loading}/>
                                    <label className="form-check-label" htmlFor="male">남성</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="gender" id="female" value="FEMALE" checked={formData.gender === "FEMALE"} onChange={handleChange} disabled={loading}/>
                                    <label className="form-check-label" htmlFor="female">여성</label>
                                </div>
                                {/* 필요하다면 '선택 안함' 등 추가 */}
                            </div>
                        </fieldset>

                        {/* 가입 버튼 */}
                        <div className="d-grid mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                // 제출 비활성화 조건:
                                // 1. 회원가입 제출 로딩 중 (loading)
                                // 2. 아이디 중복 확인 미완료 (idCheckStatus !== 'available')
                                // 3. 중복 확인 후 아이디 변경됨 (formData.id !== lastCheckedId.current - 훅 내부에서 처리)
                                // 4. 파일 업로드 진행 중 (uploadLoading)
                                disabled={
                                    loading || 
                                    uploadLoading ||
                                    idCheckStatus !== 'available' || 
                                    
                                    !(formData.phone1 && formData.phone2 && formData.phone3 && phoneCheckStatus === 'available')
                                }
                            >
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        가입 처리 중...
                                    </>
                                ) : "가입하기"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KakaoCallback;