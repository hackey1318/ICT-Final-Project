import React from 'react';
import { useGeneralRegisterForm } from './../../js/user/useGeneralRegisterForm'; 
import { Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const GeneralRegisterForm = () => {
    const {
        formData,
        errors,
        loading,
        apiError,
        success,
        idCheckLoading,
        idCheckStatus,
        idCheckMessage,
        handleChange,
        handleIdCheck,
        handleSubmit,
        uploadLoading,
        uploadError,
        previewImageUrl,
        handleFileChange,
        phoneCheckLoading,
        phoneCheckStatus,
        phoneCheckMessage,
        handlePhoneCheck,
    } = useGeneralRegisterForm();

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="mb-4 text-center">회원가입</h2>

                    {/* API 에러 및 성공 메시지 */}
                    {apiError && <Alert variant="danger">{apiError}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* 프로필 이미지 (선택) */}
                        <div className="mb-4 text-center">
                            <label className="form-label d-block mb-2">프로필 이미지 (필수)</label>
                            <div className="d-inline-flex align-items-center">
                                <div
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        backgroundColor: "#f5f5f5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    {previewImageUrl
                                        ? <img
                                            src={previewImageUrl}
                                            alt="프로필"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                          />
                                        : <span style={{ color: "#aaa" }}>No Image</span>
                                    }
                                </div>
                                <div className="d-flex flex-column">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => document.getElementById("profileImage").click()}
                                        disabled={uploadLoading}
                                    >
                                        {uploadLoading ? "업로드 중…" : "이미지 변경"}
                                    </button>
                                    <input
                                        type="file"
                                        id="profileImage"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        hidden
                                    />
                                </div>
                            </div>
                            <div className="form-text mt-2">5MB 이하의 이미지 파일을 선택해주세요.</div>
                        </div>

                        {/* 아이디 + 중복 확인 */}
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">
                                아이디 <span className="text-danger">*</span>
                            </label>
                            <div className="input-group" style={{alignItems: "center"}}>
                                <input
                                    type="text"
                                    id="id"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    required
                                    className={`form-control ${
                                        errors.id
                                            ? 'is-invalid'
                                            : (idCheckStatus === 'available' ? 'is-valid' : '')
                                    }`}
                                    aria-describedby="idHelp idCheckHelp idError"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleIdCheck}
                                    disabled={idCheckLoading || formData.id.length < 4 || loading}
                                    style={{height:"45.5px"}}
                                >
                                    {idCheckLoading
                                        ? <Spinner animation="border" size="sm" />
                                        : "중복 확인"
                                    }
                                </button>
                            </div>
                            {errors.id && (
                                <div id="idError" className="invalid-feedback d-block">
                                    {errors.id}
                                </div>
                            )}
                            <div
                                id="idCheckHelp"
                                className={`form-text mt-1 ${
                                    idCheckStatus === 'available'
                                        ? 'text-success'
                                        : (['duplicate','error','invalid'].includes(idCheckStatus)
                                            ? 'text-danger'
                                            : 'text-muted')
                                }`}
                                style={{ minHeight: '1.2em' }}
                            >
                                {idCheckMessage || "로그인 시 사용할 아이디 (4자 이상)"}
                            </div>
                        </div>

                        {/* 비밀번호 */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                비밀번호 <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                aria-describedby="passwordHelp passwordError"
                                disabled={loading}
                            />
                            {errors.password && (
                                <div id="passwordError" className="invalid-feedback">
                                    {errors.password}
                                </div>
                            )}
                            <div id="passwordHelp" className="form-text">
                                비밀번호 (8자 이상)
                            </div>
                        </div>

                        {/* 비밀번호 확인 */}
                        <div className="mb-3">
                            <label htmlFor="passwordConfirm" className="form-label">
                                비밀번호 확인 <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                id="passwordConfirm"
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                required
                                className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                                aria-describedby="passwordConfirmError"
                                disabled={loading}
                            />
                            {errors.passwordConfirm && (
                                <div id="passwordConfirmError" className="invalid-feedback">
                                    {errors.passwordConfirm}
                                </div>
                            )}
                        </div>

                        {/* 닉네임 */}
                        <div className="mb-3">
                            <label htmlFor="nickName" className="form-label">
                                닉네임 <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                id="nickName"
                                name="nickName"
                                value={formData.nickName}
                                onChange={handleChange}
                                required
                                maxLength={20}
                                className={`form-control ${errors.nickName ? 'is-invalid' : ''}`}
                                aria-describedby="nickNameError"
                                disabled={loading}
                            />
                            {errors.nickName && (
                                <div id="nickNameError" className="invalid-feedback">
                                    {errors.nickName}
                                </div>
                            )}
                            <div className="form-text">서비스 내에서 사용할 닉네임 (20자 이하)</div>
                        </div>

                        {/* 이메일 */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                이메일 <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                aria-describedby="emailError"
                                disabled={loading}
                            />
                            {errors.email && (
                                <div id="emailError" className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* 연락처 (선택) */}
                        <div className="mb-3">
                          <label htmlFor="phone1" className="form-label">
                            연락처 <span className="text-danger">*</span>
                          </label>
                            <div className={`input-group ${errors.phone ? 'is-invalid' : ''}`} style={{alignItems:"center"}}>
                                <input
                                    type="tel"
                                    name="phone1"
                                    placeholder="010"
                                    maxLength={3}
                                    value={formData.phone1}
                                    onChange={handleChange}
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    style={{ flex: "0 0 80px" }}
                                    disabled={loading}
                                />
                                <span className="input-group-text" style={{height:"46px"}}>-</span>
                                <input
                                    type="tel"
                                    name="phone2"
                                    placeholder="1234"
                                    maxLength={4}
                                    value={formData.phone2}
                                    onChange={handleChange}
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    disabled={loading}  
                                />
                                <span className="input-group-text" style={{height:"46px"}}>-</span>
                                <input
                                    type="tel"
                                    name="phone3"
                                    placeholder="5678"
                                    maxLength={4}
                                    value={formData.phone3}
                                    onChange={handleChange}
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    disabled={loading}
                                />


                                      <button
                                          type="button"
                                          className="btn btn-outline-secondary"
                                          onClick={handlePhoneCheck}
                                          disabled={phoneCheckLoading || errors.phone}
                                          style={{height:"45.5px"}}
                                        >
                                          {phoneCheckLoading ? '확인 중…' : '중복 확인'}
                                        </button>




                            </div>
                            <div className={`form-text ${phoneCheckStatus==='available'? 'text-success':'text-danger'}`}>
                              {phoneCheckMessage}
                            </div>
                            {errors.phone && (
                                <div className="invalid-feedback d-block">
                                    {errors.phone}
                                </div>
                            )}
                            <div className="form-text">
                              하이픈 없이 숫자만 입력해 주세요.
                            </div>
                        </div>

                        {/* 성별 */}
                        <fieldset className="mb-3">
                            <legend className="col-form-label pt-0 fs-6">
                                성별 <span className="text-danger">*</span>
                            </legend>
                            <div className="d-flex gap-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        value="MALE"
                                        checked={formData.gender === "MALE"}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    <label className="form-check-label" htmlFor="male">
                                        남성
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="female"
                                        value="FEMALE"
                                        checked={formData.gender === "FEMALE"}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    <label className="form-check-label" htmlFor="female">
                                        여성
                                    </label>
                                </div>
                            </div>
                        </fieldset>

                        {/* 가입 버튼 */}
                        <div className="d-grid mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={
                                    loading ||
                                    uploadLoading ||
                                    idCheckStatus !== 'available' ||
                                    !(formData.phone1 && formData.phone2 && formData.phone3 && phoneCheckStatus === 'available')
                                }
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="me-2" /> 가입 처리 중...
                                    </>
                                ) : (
                                    '가입하기'
                                )}
                            </button>
                        </div>

                        {/* 로그인 페이지 이동 링크 */}
                        <div className="text-center mt-3 small">
                            <span className="text-secondary">이미 계정이 있으신가요? </span>
                            <Link to="/login" className="text-decoration-none">
                                로그인
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GeneralRegisterForm;
