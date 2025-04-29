import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiNoAccessClient from './../public/axiosConfigNoAccess';

// --- 환경 변수 또는 설정 파일에서 API 기본 URL 가져오기 (권장) ---
const API_BASE_URL = ""; // 실제 환경에 맞게 수정

export const useKakaoCallback = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // 카카오 로그인 응답 데이터 (kakaoUserInfoDto 포함)
    const [loading, setLoading] = useState(false); // 폼 제출 로딩 상태
    const [initialLoading, setInitialLoading] = useState(true); // 초기 카카오 정보 로딩 상태
    const [apiError, setApiError] = useState(""); // 회원가입 API 에러
    const [success, setSuccess] = useState(""); // 회원가입 성공 메시지
    

    // --- 폼 데이터 상태 ---
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        passwordConfirm: "",
        nickName: "",
        gender: "MALE", // 기본값 설정
        phone1: "", // 전화번호 필드 추가 (선택 사항)
        phone2: "",
        phone3: ""
    });
    const [errors, setErrors] = useState({}); // 폼 필드 유효성 검사 에러

    // --- 아이디 중복 확인 상태 ---
    const [idCheckLoading, setIdCheckLoading] = useState(false);
    const [idCheckStatus, setIdCheckStatus] = useState('unchecked'); // 'unchecked', 'checking', 'available', 'duplicate', 'invalid', 'error'
    const [idCheckMessage, setIdCheckMessage] = useState('');
    const lastCheckedId = useRef(null);

    // --- 프로필 이미지 업로드 관련 상태 ---
    const [selectedFile, setSelectedFile] = useState(null); // 사용자가 선택한 파일 객체
    const [uploadedImageId, setUploadedImageId] = useState(null); // 파일 업로드 성공 시 받은 imageId
    const [uploadLoading, setUploadLoading] = useState(false); // 파일 업로드 로딩 상태
    const [uploadError, setUploadError] = useState(''); // 파일 업로드 에러 메시지
    const [previewImageUrl, setPreviewImageUrl] = useState(null); // 이미지 미리보기 URL

    // 휴대폰 번호 중복 검사 
    const [phoneCheckLoading, setPhoneCheckLoading] = useState(false);
    const [phoneCheckStatus, setPhoneCheckStatus] = useState('');
    const [phoneCheckMessage, setPhoneCheckMessage] = useState('');

    // 필드 유효성 검사 함수
    const validateField = useCallback((name, value, currentFormData) => {
        let error = "";
        switch (name) {
            case 'id':
                if (!value.trim()) error = "아이디를 입력해주세요.";
                else if (value.length < 4) error = "아이디는 4자 이상이어야 합니다.";
                break;
            case 'password':
                if (!value) error = "비밀번호를 입력해주세요.";
                else if (value.length < 8) error = "비밀번호는 8자 이상이어야 합니다.";
                break;
            case 'passwordConfirm':
                if (!value) error = "비밀번호 확인을 입력해주세요.";
                else if (currentFormData.password !== value) error = "비밀번호가 일치하지 않습니다.";
                break;
            case 'nickName':
                if (!value.trim()) error = "사용할 닉네임을 입력해주세요.";
                else if (value.length > 20) error = "닉네임은 20자를 초과할 수 없습니다.";
                break;
            case 'phone1':
            case 'phone2':
            case 'phone3':
                const p1 = name === 'phone1' ? value : currentFormData.phone1;
                const p2 = name === 'phone2' ? value : currentFormData.phone2;
                const p3 = name === 'phone3' ? value : currentFormData.phone3;
                const phoneFilled = p1 || p2 || p3;
                if (phoneFilled) {
                    if (!/^\d{3}$/.test(p1)) error = "연락처 첫 부분은 3자리 숫자여야 합니다.";
                    else if (!/^\d{3,4}$/.test(p2)) error = "연락처 중간 부분은 3~4자리 숫자여야 합니다.";
                    else if (!/^\d{4}$/.test(p3)) error = "연락처 마지막 부분은 4자리 숫자여야 합니다.";
                    else error = ""; // 모든 필드가 유효하면 에러 없음
                } else {
                     error = ""; // 전화번호는 선택사항이므로, 비어있으면 에러 없음
                }
                // 개별 필드가 아닌 'phone'이라는 공통 키로 에러 반환
                return { phone: error };
            default:
                break;
        }
        return { [name]: error };
    }, []);

    // 입력 필드 변경 핸들러
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            const updatedFormData = { ...prevFormData, [name]: value };
            const fieldErrors = validateField(name, value, updatedFormData);
            const phoneErrorKey = Object.keys(fieldErrors).find(key => key === 'phone');

            setErrors(prevErrors => {
                const newErrors = { ...prevErrors, ...fieldErrors };
                if (name.startsWith('phone')) {
                    if (phoneErrorKey) {
                        newErrors.phone = fieldErrors.phone;
                    } else {
                        delete newErrors.phone;
                    }
                    delete newErrors.phone1; delete newErrors.phone2; delete newErrors.phone3;
                }
                if (name === 'password') {
                    const confirmErrors = validateField('passwordConfirm', updatedFormData.passwordConfirm, updatedFormData);
                    newErrors.passwordConfirm = confirmErrors.passwordConfirm;
                }
                return newErrors;
            });

             return updatedFormData;
         });

        if (name === 'id') {
            setIdCheckStatus('unchecked');
            setIdCheckMessage('');
        }
    }, [validateField]);

    // 전체 폼 유효성 검사 함수
    const validateForm = useCallback(() => {
        let formIsValid = true;
        const newErrors = {};
        ['id', 'password', 'passwordConfirm', 'nickName'].forEach(fieldName => {
            const fieldErrorObj = validateField(fieldName, formData[fieldName], formData);
            const errorMsg = fieldErrorObj[fieldName];
            if (errorMsg) {
                newErrors[fieldName] = errorMsg;
                formIsValid = false;
            }
        });
        if (formData.phone1 || formData.phone2 || formData.phone3) {
            const phoneErrorObj = validateField('phone1', formData.phone1, formData);
            if (phoneErrorObj.phone) {
                newErrors.phone = phoneErrorObj.phone;
                formIsValid = false;
            } else if (phoneCheckStatus !== 'available') {
                newErrors.phoneCheck = '휴대폰 번호 중복 확인을 완료해주세요.';
                formIsValid = false;
            }
        }    
    
        setErrors(newErrors);
        return formIsValid;
    }, [formData, validateField, phoneCheckStatus]);

    // 아이디 중복 확인 함수
    const handleIdCheck = useCallback(async () => {
        const idFormatError = validateField('id', formData.id, formData).id;
        if (idFormatError) {
            setErrors(prev => ({ ...prev, id: idFormatError }));
            setIdCheckStatus('invalid');
            setIdCheckMessage(idFormatError);
            return;
        }
        if (idCheckLoading) return;

        setIdCheckLoading(true);
        setIdCheckStatus('checking');
        setIdCheckMessage('아이디 중복 확인 중...');
        setApiError('');
        try {
            await apiNoAccessClient.get(`${API_BASE_URL}/oauth/kakao/api/users/check-id/${formData.id}`);
            setIdCheckStatus('available');
            setIdCheckMessage('사용 가능한 아이디입니다.');
            lastCheckedId.current = formData.id;
            setErrors(prev => ({ ...prev, id: '' }));
        } catch (error) {
             const status = error.response?.status;
             if (status === 409) {
                 setIdCheckStatus('duplicate');
                 setIdCheckMessage('이미 사용 중인 아이디입니다.');
                 setErrors(prev => ({ ...prev, id: '이미 사용 중인 아이디입니다.' }));
             } else if (status === 400) {
                 setIdCheckStatus('invalid');
                 setIdCheckMessage('아이디 형식이 올바르지 않습니다.');
                 setErrors(prev => ({ ...prev, id: '아이디 형식이 올바르지 않습니다.' }));
             } else {
                 setIdCheckStatus('error');
                 setIdCheckMessage('아이디 중복 확인 중 오류가 발생했습니다.');
                 setErrors(prev => ({ ...prev, id: '서버 오류 발생' }));
             }
             lastCheckedId.current = null;
             console.error("아이디 중복 확인 오류:", error);
        } finally {
            setIdCheckLoading(false);
        }
    }, [formData.id, idCheckLoading, validateField]);

    const handlePhoneCheck = useCallback(async () => {
        const rawPhone = formData.phone1 + formData.phone2 + formData.phone3;
        setPhoneCheckLoading(true);
        setPhoneCheckStatus('checking');
        setPhoneCheckMessage('중복 확인 중...');
        try {
            await apiNoAccessClient.get(`${API_BASE_URL}/oauth/kakao/check-phone/${rawPhone}`);
            setPhoneCheckStatus('available');
            setPhoneCheckMessage('사용 가능한 휴대폰 번호입니다.');
        } catch {
            setPhoneCheckStatus('duplicate');
            setPhoneCheckMessage('이미 사용 중인 번호입니다.');
        } finally {
            setPhoneCheckLoading(false);
        }
    }, [formData.phone1, formData.phone2, formData.phone3]);

    // --- 파일 업로드 함수 (새로운 API, 인증 제거, imageId 사용) ---
    const uploadProfileImage = useCallback(async (file) => {
        if (!file) return;

        setUploadLoading(true);
        setUploadError('');
        setApiError('');

        const uploadFormData = new FormData();
        uploadFormData.append('files', file);

        try {
            // 새 API 엔드포인트 사용, Authorization 헤더 제거
            const response = await apiNoAccessClient.post(`${API_BASE_URL}/file-system/upload/register-image`, uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: false
            });

            // 백엔드 FileUploadResponse의 'imageId' 필드를 사용합니다.
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const uploadedId = response.data[0].imageId; // FileUploadResponse의 imageId 필드 사용

                if (uploadedId) {
                    setUploadedImageId(uploadedId); // 상태 업데이트 (회원가입 시 사용할 ID)
                    console.log("프로필 이미지 사전 업로드 성공, ID:", uploadedId);
                    setUploadError(''); // 성공 시 에러 초기화
                } else {
                    console.warn("업로드 응답 데이터에 imageId가 없습니다:", response.data[0]);
                    throw new Error("업로드 응답에 imageId가 없습니다.");
                }
            } else {
                 throw new Error("파일 업로드 후 서버 응답 형식이 올바르지 않습니다.");
            }

        } catch (error) {
            console.error("파일 업로드 실패:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message || "파일 업로드 중 오류 발생";
            let displayError = `프로필 이미지 업로드 실패: ${errorMsg}`;
            if (error.response?.status === 400) {
                displayError = `프로필 이미지 업로드 실패: ${errorMsg || '잘못된 요청입니다.'}`;
            } else if (error.response?.status === 500) {
                displayError = `프로필 이미지 업로드 실패: 서버 내부 오류가 발생했습니다.`;
            }
            setUploadError(displayError);
            setUploadedImageId(null);
            setPreviewImageUrl(user?.kakaoUserInfoDto?.profile || null); // 미리보기 복원
            setSelectedFile(null);
        } finally {
            setUploadLoading(false);
        }
    }, [user]); // user 상태는 미리보기 복원용으로 필요

    // --- 파일 선택 핸들러 ---
    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files[0];
        setUploadError('');
        setApiError('');

        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB 제한 예시
                setUploadError("파일 크기는 5MB를 초과할 수 없습니다.");
                event.target.value = null;
                return;
            }
            if (!file.type.startsWith('image/')) {
                setUploadError("이미지 파일만 업로드 가능합니다.");
                event.target.value = null;
                return;
            }

            setSelectedFile(file);
            setUploadedImageId(null); // 새 파일 선택 시 이전 ID 초기화

            // 1. 미리보기 설정
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImageUrl(reader.result);
            };
            reader.readAsDataURL(file);

            // 2. 파일 선택 즉시 업로드
            await uploadProfileImage(file);

        } else {
            setSelectedFile(null);
            setUploadedImageId(null);
            setPreviewImageUrl(user?.kakaoUserInfoDto?.profile || null); // 카카오 이미지로 복원
        }
    }, [user, uploadProfileImage]);

    // 컴포넌트 마운트 시 카카오 코드 처리
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!user && initialLoading && code) {
            apiNoAccessClient.get(`${API_BASE_URL}/oauth/kakao/login?code=${code}`)
                .then(response => {
                    if (response.data.existUser === true) {
                        sessionStorage.setItem("accessToken", response.data.token);
                        sessionStorage.setItem("userInfo", JSON.stringify(response.data.user));
                    
                        window.location.href = "/";
                    } else if (response.data.existUser === false && response.data.kakaoUserInfoDto) {
                        setUser(response.data);
                        const kakaoInfo = response.data.kakaoUserInfoDto;
                        setFormData(prev => ({ ...prev, nickName: kakaoInfo.knickName || "" }));
                        const nickNameError = validateField('nickName', kakaoInfo.knickName || "", {...formData, nickName: kakaoInfo.knickName || ""});
                        setErrors(prevErrors => ({ ...prevErrors, ...nickNameError }));
                        setPreviewImageUrl(kakaoInfo.profile || null); // 카카오 프로필로 초기 미리보기 설정
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else {
                        console.error("백엔드 응답 형식 오류:", response.data);
                        setApiError("사용자 정보를 처리하는 중 오류가 발생했습니다.");
                    }
                })
                .catch(error => {
                    console.error("카카오 로그인 정보 확인 실패:", error.response?.data || error.message);
                    const backendErrorMsg = error.response?.data?.errorMessage || error.response?.data?.message;
                    setApiError(backendErrorMsg || "카카오 로그인 정보를 가져오는데 실패했습니다.");
                })
                .finally(() => {
                    setInitialLoading(false);
                });
        } else if (!code && initialLoading) {
             setApiError("유효하지 않은 접근입니다. 카카오 로그인을 다시 진행해주세요.");
             setInitialLoading(false);
        } else if (user && initialLoading) {
            setInitialLoading(false);
            if (!previewImageUrl && user?.kakaoUserInfoDto?.profile) {
                setPreviewImageUrl(user.kakaoUserInfoDto.profile);
            }
        }
    }, [user, initialLoading, navigate, validateField, previewImageUrl]);

    // 최종 회원가입 제출 핸들러
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setApiError("");
        setSuccess("");
        setUploadError('');

        if (!validateForm()) {
            setApiError("입력 내용을 다시 확인해주세요.");
            return;
        }
        if (idCheckStatus !== 'available') {
            setApiError("아이디 중복 확인을 완료해주세요.");
            return;
        }
        if (formData.id !== lastCheckedId.current) {
            setApiError("아이디가 변경되었습니다. 다시 중복 확인을 해주세요.");
            setIdCheckStatus('unchecked'); setIdCheckMessage('');
            return;
        }
        if (uploadLoading) {
            setApiError("프로필 이미지 업로드가 진행 중입니다.");
            return;
        }
        // if (uploadError && selectedFile) { // 파일 업로드 실패 시 제출 막는 로직 (선택적)
        //     setApiError("프로필 이미지 업로드에 실패했습니다. 이미지를 다시 선택하거나 제거해주세요.");
        //     return;
        // }
        if (!user || !user.kakaoUserInfoDto) {
            setApiError("카카오 사용자 정보가 없습니다.");
            return;
        }

        try {
            setLoading(true);
            const registerRequest = {
                id: formData.id,
                password: formData.password,
                nickName: formData.nickName,
                gender: formData.gender,
                // 전화번호 조합 (백엔드 요구사항에 따라 수정 필요)
                phone: (formData.phone1 && formData.phone2 && formData.phone3 && !errors.phone)
                       ? `${formData.phone1}${formData.phone2}${formData.phone3}`
                       : null,
                kakaoUserInfo: {
                    kakaoId: user.kakaoUserInfoDto.kakaoId,
                    email: user.kakaoUserInfoDto.email,
                    knickName: user.kakaoUserInfoDto.knickName,
                    profile: user.kakaoUserInfoDto.profile
                },
                // *** 업로드된 프로필 이미지 ID 사용 ***
                uploadedProfileImageId: uploadedImageId // 사전 업로드 성공 시 여기에 imageId가 담김 (실패 시 null)
            };

            console.log("회원가입 요청 데이터:", registerRequest);

            const response = await apiNoAccessClient.post(`${API_BASE_URL}/oauth/kakao/register/kakao`, registerRequest);

            if (response.status === 200 && response.data?.result === true) {
                setSuccess("회원가입이 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setApiError(response.data?.message || "회원가입 요청 처리 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("회원가입 오류:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message || "회원가입 처리 중 오류 발생";
            setApiError(`회원가입 실패: ${errorMsg}`);
            if (error.response?.status === 409) {
                 setApiError("이미 사용 중인 아이디 또는 닉네임/이메일입니다."); // 백엔드 응답에 따라 구체화
            }
        } finally {
            setLoading(false);
        }
    }, [
        formData, user, errors, idCheckStatus, uploadedImageId, uploadLoading, // uploadError (선택적),
        validateForm, navigate
    ]);

    // 프로필 이미지 제거/복원 핸들러
    const handleResetProfileImage = useCallback(() => {
        setSelectedFile(null);
        setUploadedImageId(null);
        setUploadError('');
        const fileInput = document.getElementById('profileImageUpload');
        if (fileInput) fileInput.value = null;
        setPreviewImageUrl(user?.kakaoUserInfoDto?.profile || null); // 카카오 이미지로 복원
    }, [user]);

    // 훅 반환 값
    return {
        user, loading, initialLoading, apiError, success,
        formData, errors,
        idCheckLoading, idCheckStatus, idCheckMessage,
        selectedFile, uploadedImageId, uploadLoading, uploadError, previewImageUrl,
        handleFileChange, handleResetProfileImage,
        handleChange, handleIdCheck, handleSubmit,
        navigate, lastCheckedId,    phoneCheckLoading,
        phoneCheckStatus,
        phoneCheckMessage,
        handlePhoneCheck,
    };
};

// 파일 마지막에 export 추가
export default useKakaoCallback;