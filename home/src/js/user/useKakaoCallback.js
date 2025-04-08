import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- 환경 변수 또는 설정 파일에서 API 기본 URL 가져오기 (권장) ---
const API_BASE_URL = "http://localhost:9988"; // 실제 환경에 맞게 수정

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
        phone1: "",
        phone2: "",
        phone3: ""
    });
    const [errors, setErrors] = useState({}); // 폼 필드 유효성 검사 에러

    // --- 아이디 중복 확인 상태 ---
    const [idCheckLoading, setIdCheckLoading] = useState(false);
    const [idCheckStatus, setIdCheckStatus] = useState('unchecked'); // 'unchecked', 'checking', 'available', 'duplicate', 'invalid', 'error'
    const [idCheckMessage, setIdCheckMessage] = useState('');
    const lastCheckedId = useRef(null);

    // --- *** 프로필 이미지 업로드 관련 상태 추가 *** ---
    const [selectedFile, setSelectedFile] = useState(null); // 사용자가 선택한 파일 객체
    const [uploadedImageId, setUploadedImageId] = useState(null); // 파일 업로드 성공 시 받은 imageId
    const [uploadLoading, setUploadLoading] = useState(false); // 파일 업로드 로딩 상태
    const [uploadError, setUploadError] = useState(''); // 파일 업로드 에러 메시지
    const [previewImageUrl, setPreviewImageUrl] = useState(null); // 이미지 미리보기 URL (카카오 프로필 또는 업로드된 파일)
    // --- ---

    // 필드 유효성 검사 함수 (변경 없음)
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

    // 입력 필드 변경 핸들러 (변경 없음)
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            const updatedFormData = { ...prevFormData, [name]: value };
            const fieldErrors = validateField(name, value, updatedFormData);
            const phoneErrorKey = Object.keys(fieldErrors).find(key => key === 'phone'); // 'phone' 에러 키 찾기

            setErrors(prevErrors => {
                const newErrors = { ...prevErrors, ...fieldErrors };
                // 전화번호 필드 변경 시, 'phone' 에러만 업데이트하고 개별 phone1,2,3 에러는 제거
                if (name.startsWith('phone')) {
                    if (phoneErrorKey) {
                        newErrors.phone = fieldErrors.phone; // 공통 phone 에러 업데이트
                    } else {
                        delete newErrors.phone; // 에러 없으면 제거
                    }
                    // 이전 개별 필드 에러 제거 (필요 시)
                    delete newErrors.phone1;
                    delete newErrors.phone2;
                    delete newErrors.phone3;
                }
                // 비밀번호 변경 시 확인 필드 재검증
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

    // 전체 폼 유효성 검사 함수 (변경 없음)
    const validateForm = useCallback(() => {
        let formIsValid = true;
        const newErrors = {};

        // id, password, passwordConfirm, nickName 유효성 검사
        ['id', 'password', 'passwordConfirm', 'nickName'].forEach(fieldName => {
            const fieldErrorObj = validateField(fieldName, formData[fieldName], formData);
            const errorMsg = fieldErrorObj[fieldName];
            if (errorMsg) {
                newErrors[fieldName] = errorMsg;
                formIsValid = false;
            }
        });

        // 전화번호 유효성 검사 (하나라도 입력된 경우)
        const { phone1, phone2, phone3 } = formData;
        if (phone1 || phone2 || phone3) {
            const phoneErrorObj = validateField('phone1', phone1, formData); // 어떤 phone 필드로 검사해도 동일
             if (phoneErrorObj.phone) {
                 newErrors.phone = phoneErrorObj.phone;
                 formIsValid = false;
            }
        } else {
            // 전화번호가 모두 비어있으면 'phone' 에러는 제거
            if(newErrors.phone) delete newErrors.phone;
        }

        setErrors(newErrors);
        return formIsValid;
    }, [formData, validateField]);

    // 아이디 중복 확인 함수 (변경 없음)
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
            await axios.get(`${API_BASE_URL}/oauth/kakao/api/users/check-id/${formData.id}`);
            setIdCheckStatus('available');
            setIdCheckMessage('사용 가능한 아이디입니다.');
            lastCheckedId.current = formData.id;
            setErrors(prev => ({ ...prev, id: '' })); // 에러 메시지 제거
        } catch (error) {
             // ... (기존 에러 처리) ...
             const status = error.response?.status;
             if (status === 409) {
                 setIdCheckStatus('duplicate');
                 setIdCheckMessage('이미 사용 중인 아이디입니다.');
                 setErrors(prev => ({ ...prev, id: '이미 사용 중인 아이디입니다.' }));
             } else if (status === 400) {
                 setIdCheckStatus('invalid'); // 상태 변경
                 setIdCheckMessage('아이디 형식이 올바르지 않습니다.');
                 setErrors(prev => ({ ...prev, id: '아이디 형식이 올바르지 않습니다.' }));
             } else {
                 setIdCheckStatus('error');
                 setIdCheckMessage('아이디 중복 확인 중 오류가 발생했습니다.');
                 setErrors(prev => ({ ...prev, id: '서버 오류 발생' }));
             }
             lastCheckedId.current = null; // 확인 실패 시 lastCheckedId 초기화
             console.error("아이디 중복 확인 오류:", error);
        } finally {
            setIdCheckLoading(false);
        }
    }, [formData.id, idCheckLoading, validateField]);

    // --- *** 파일 업로드 함수 추가 *** ---
    const uploadProfileImage = useCallback(async (file) => {
        if (!file) return;

        setUploadLoading(true);
        setUploadError('');
        setApiError(''); // 다른 API 에러 초기화

        const uploadFormData = new FormData();
        uploadFormData.append('files', file); // 백엔드 @RequestParam("files") 이름과 일치

        try {
            // !!! 중요: 실제 서비스에서는 로그인 후 저장된 토큰을 사용해야 합니다.
            const token = localStorage.getItem('accessToken'); // 예시: 로컬 스토리지에서 토큰 가져오기
            if (!token) {
                 // 토큰이 없으면 업로드 불가 처리 또는 로그인 페이지로 리다이렉트
                 throw new Error("로그인이 필요합니다. 파일 업로드를 위해 다시 로그인해주세요.");
            }

            const response = await axios.post(`${API_BASE_URL}/file-system/upload`, uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // JWT 토큰 헤더 추가
                }
            });

            // 백엔드 응답이 List<FileUploadResponse> 형태라고 가정
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const imageId = response.data[0].imageId; // 첫 번째 파일의 imageId 사용
                if(imageId) {
                    setUploadedImageId(imageId);
                    console.log("프로필 이미지 업로드 성공, Image ID:", imageId);
                    // 성공 시 에러 메시지 초기화
                    setUploadError('');
                } else {
                    throw new Error("업로드 응답에 imageId가 없습니다.");
                }
            } else {
                 throw new Error("파일 업로드 후 서버 응답 형식이 올바르지 않습니다.");
            }

        } catch (error) {
            console.error("파일 업로드 실패:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message || "파일 업로드 중 오류 발생";
            // 사용자 친화적 메시지로 변환
            let displayError = `프로필 이미지 업로드 실패: ${errorMsg}`;
            if (error.message === "로그인이 필요합니다. 파일 업로드를 위해 다시 로그인해주세요.") {
                displayError = error.message; // 로그인 필요 메시지 그대로 사용
                // 필요하다면 여기서 navigate('/login') 호출
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                displayError = "파일 업로드 권한이 없습니다. 다시 로그인해주세요.";
                // 필요하다면 여기서 navigate('/login') 호출
            }
            setUploadError(displayError);
            setUploadedImageId(null); // 실패 시 ID 초기화
            // 실패 시 미리보기를 카카오 기본 이미지로 되돌리기 (선택적)
            setPreviewImageUrl(user?.kakaoUserInfoDto?.profile || null);
            setSelectedFile(null); // 선택된 파일 상태도 초기화
        } finally {
            setUploadLoading(false);
        }
    }, [user, navigate]); // user(카카오 정보 복구용), navigate(로그인 이동용) 의존성 추가

    // --- *** 파일 선택 핸들러 추가 *** ---
    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files[0];
        setUploadError(''); // 이전 에러 메시지 초기화
        setApiError('');   // 다른 API 에러 초기화

        if (file) {
            // 파일 기본 검증 (예: 크기 5MB, 타입 이미지)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError("파일 크기는 5MB를 초과할 수 없습니다.");
                event.target.value = null; // 파일 선택 취소 효과
                return;
            }
            if (!file.type.startsWith('image/')) {
                setUploadError("이미지 파일(jpg, png, gif 등)만 업로드 가능합니다.");
                event.target.value = null; // 파일 선택 취소 효과
                return;
            }

            setSelectedFile(file);
            setUploadedImageId(null); // 새 파일 선택 시 이전 업로드 ID 초기화

            // 1. 파일 미리보기 설정
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImageUrl(reader.result); // 데이터 URL로 미리보기 설정
            };
            reader.readAsDataURL(file);

            // 2. 파일 선택 즉시 업로드 호출
            await uploadProfileImage(file); // await 사용 가능 (async 함수이므로)

        } else {
            // 파일 선택 취소 시
            setSelectedFile(null);
            setUploadedImageId(null);
            setPreviewImageUrl(user?.kakaoUserInfoDto?.profile || null); // 카카오 이미지로 복원
        }
    }, [user, uploadProfileImage]); // user(카카오 정보용), uploadProfileImage 의존성 추가

    // 컴포넌트 마운트 시 카카오 코드 처리 및 가입 여부 확인
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!user && initialLoading && code) { // user 없고, 초기 로딩중이고, code 있을 때만 실행
             axios.get(`${API_BASE_URL}/oauth/kakao/login?code=${code}`)
                .then(response => {
                    if (response.data.existUser === true) {
                        setApiError("이미 가입된 카카오 계정입니다. 로그인 페이지로 이동합니다.");
                        setTimeout(() => navigate("/login"), 3000);
                    } else if (response.data.existUser === false && response.data.kakaoUserInfoDto) {
                        setUser(response.data); // user 상태 설정 (폼 렌더링 트리거)
                        const kakaoInfo = response.data.kakaoUserInfoDto;

                        // 카카오 닉네임으로 폼 닉네임 초기 설정
                        setFormData(prev => ({ ...prev, nickName: kakaoInfo.knickName || "" }));
                        // 닉네임 유효성 검사 (선택적)
                        const nickNameError = validateField('nickName', kakaoInfo.knickName || "", {...formData, nickName: kakaoInfo.knickName || ""});
                        setErrors(prevErrors => ({ ...prevErrors, ...nickNameError }));

                        // *** 카카오 프로필 이미지로 초기 미리보기 설정 ***
                        setPreviewImageUrl(kakaoInfo.profile || null);

                        // URL에서 code 파라미터 제거 (새로고침 시 재실행 방지)
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else {
                        console.error("백엔드 응답 형식 오류:", response.data);
                        setApiError("사용자 정보를 처리하는 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
                    }
                })
                .catch(error => {
                    console.error("카카오 로그인 정보 확인 실패:", error.response?.data || error.message);
                    const backendErrorMsg = error.response?.data?.errorMessage || error.response?.data?.message;
                    setApiError(backendErrorMsg || "카카오 로그인 정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
                     // 필요 시 로그인 페이지로 리다이렉트
                    // setTimeout(() => navigate("/login"), 3000);
                })
                .finally(() => {
                    setInitialLoading(false);
                });
        } else if (!code && initialLoading) { // code 없이 접근 시
             setApiError("유효하지 않은 접근입니다. 카카오 로그인을 다시 진행해주세요.");
             setInitialLoading(false);
             // 필요 시 로그인 페이지로 리다이렉트
             // setTimeout(() => navigate("/login"), 3000);
        } else if (user && initialLoading) { // 이미 user 정보가 있는 경우 (예: 뒤로가기 후 다시 진입)
            setInitialLoading(false); // 로딩 상태만 false로 변경
            // 이 경우 previewImageUrl이 이미 설정되어 있어야 함 (useState 초기값 또는 이전 설정값)
            if (!previewImageUrl && user?.kakaoUserInfoDto?.profile) {
                setPreviewImageUrl(user.kakaoUserInfoDto.profile); // 혹시 모르니 재설정
            }
        }
    }, [user, initialLoading, navigate, validateField, previewImageUrl]); // previewImageUrl 의존성 추가 (재설정 로직 때문)

    // 최종 회원가입 제출 핸들러
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setApiError(""); // 이전 API 에러 초기화
        setSuccess("");
        setUploadError(''); // 업로드 에러도 초기화

        // 1. 폼 유효성 검사
        if (!validateForm()) {
            console.log("폼 유효성 검사 실패:", errors);
            // 가장 첫번째 에러 필드로 포커스 이동 (선택적)
            const firstErrorField = Object.keys(errors).find(key => errors[key]);
            if (firstErrorField) {
                document.getElementById(firstErrorField)?.focus();
            }
            setApiError("입력 내용을 다시 확인해주세요.");
            return;
        }

        // 2. 아이디 중복 확인 완료 여부 검사
        if (idCheckStatus !== 'available') {
            setApiError("아이디 중복 확인을 완료해주세요.");
            document.getElementById('id')?.focus();
            return;
        }
        // 3. 중복 확인 후 아이디 변경 여부 검사
        if (formData.id !== lastCheckedId.current) {
            setApiError("아이디가 변경되었습니다. 다시 중복 확인을 해주세요.");
            setIdCheckStatus('unchecked'); // 상태 리셋
            setIdCheckMessage('');
            document.getElementById('id')?.focus();
            return;
        }

        // 4. 파일 업로드 진행 중인지 확인 (선택적이지만 권장)
        if (uploadLoading) {
            setApiError("프로필 이미지 업로드가 진행 중입니다. 잠시만 기다려주세요.");
            return;
        }
        // 5. 파일 업로드 실패 상태인지 확인 (선택적)
        // if (uploadError && selectedFile) { // 에러가 있고, 파일이 선택된 상태라면 (업로드 실패 후 수정 안 한 경우)
        //     setApiError("프로필 이미지 업로드에 실패했습니다. 이미지를 다시 선택하거나 기본 이미지를 사용해주세요.");
        //     document.getElementById('profileImageUpload')?.focus();
        //     return;
        // }

        // 6. 카카오 사용자 정보 존재 여부 확인
        if (!user || !user.kakaoUserInfoDto) {
            setApiError("카카오 사용자 정보가 없습니다. 로그인 과정을 다시 진행해주세요.");
            // 필요 시 로그인 페이지로 리다이렉트
            // setTimeout(() => navigate("/login"), 3000);
            return;
        }

        try {
            setLoading(true); // 회원가입 제출 로딩 시작
            const registerRequest = {
                id: formData.id,
                password: formData.password,
                nickName: formData.nickName,
                gender: formData.gender,
                phone: (formData.phone1 && formData.phone2 && formData.phone3 && !errors.phone)
                       ? `${formData.phone1}${formData.phone2}${formData.phone3}`
                       : null, // 유효한 경우에만 조합, 아니면 null
                kakaoUserInfo: { // 카카오 정보 전달
                    kakaoId: user.kakaoUserInfoDto.kakaoId,
                    email: user.kakaoUserInfoDto.email,
                    knickName: user.kakaoUserInfoDto.knickName,
                    profile: user.kakaoUserInfoDto.profile // 카카오 원본 프로필 URL도 일단 같이 보냄
                },
                // *** 업로드된 프로필 이미지 ID 추가 ***
                // uploadedImageId 상태값 사용 (업로드 성공 시 ID 저장됨, 아니면 null)
                uploadedProfileImageId: uploadedImageId
            };

            console.log("회원가입 요청 데이터:", registerRequest); // 전송 데이터 확인

            // 회원가입 API 호출
            const response = await axios.post(`${API_BASE_URL}/oauth/kakao/register`, registerRequest);

            // 성공 처리
            if (response.status === 200 && response.data?.result === true) { // 백엔드 응답 형식 확인 필요 (SuccessOfFailResponse 가정)
                setSuccess("회원가입이 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.");
                // 성공 후 로컬 스토리지 정리 등 (선택적)
                localStorage.removeItem('accessToken'); // 혹시 이전 토큰 남아있으면 제거
                // 로그인 페이지로 이동
                setTimeout(() => navigate("/login"), 2000);
            } else {
                // 백엔드에서 result: false 또는 다른 오류 응답 온 경우
                setApiError(response.data?.message || "회원가입 요청 처리 중 서버에서 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("회원가입 오류:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message || "회원가입 처리 중 오류 발생";
            // 구체적인 에러 메시지 표시
            setApiError(`회원가입 실패: ${errorMsg}`);
            // 예를 들어, ID나 닉네임 중복 에러를 백엔드에서 잡아낸 경우 등
            if (error.response?.status === 409) { // 예시: 중복 에러 코드
                 setApiError("이미 사용 중인 아이디 또는 닉네임입니다.");
            }
        } finally {
            setLoading(false); // 회원가입 제출 로딩 종료
        }
    }, [
        formData, user, errors, idCheckStatus, uploadedImageId, uploadLoading, // uploadError (선택적)
        validateForm, navigate // 필요한 함수 및 상태 의존성 추가
    ]);

    // --- *** (선택 사항) 업로드된 이미지 제거 또는 기본 이미지로 복원하는 함수 *** ---
    const handleResetProfileImage = useCallback(() => {
        setSelectedFile(null);
        setUploadedImageId(null);
        setUploadError('');
        // 파일 입력 필드 값 초기화 (같은 파일 재선택 가능하도록)
        const fileInput = document.getElementById('profileImageUpload');
        if (fileInput) {
            fileInput.value = null;
        }
        // 미리보기를 카카오 기본 이미지로 설정
        setPreviewImageUrl(user?.kakaoUserInfoDto?.profile || null);
    }, [user]);

    // 훅이 뷰 컴포넌트에 제공하는 값들
    return {
        user, // 카카오 사용자 정보 포함 객체
        loading, // 회원가입 제출 로딩
        initialLoading, // 초기 카카오 정보 로딩
        apiError, // 회원가입 API 에러
        success, // 회원가입 성공 메시지
        formData, // 폼 데이터
        errors, // 폼 유효성 에러
        idCheckLoading, // 아이디 중복 확인 로딩
        idCheckStatus, // 아이디 중복 확인 상태
        idCheckMessage, // 아이디 중복 확인 메시지
        // --- 이미지 관련 상태 및 핸들러 추가 ---
        selectedFile, // 선택된 파일 객체
        uploadedImageId, // 업로드 성공 ID
        uploadLoading, // 파일 업로드 로딩
        uploadError, // 파일 업로드 에러
        previewImageUrl, // 이미지 미리보기 URL
        handleFileChange, // 파일 선택/업로드 핸들러
        handleResetProfileImage, // 이미지 리셋 핸들러 (선택적)
        // --- 기존 핸들러 ---
        handleChange, // 폼 입력 변경 핸들러
        handleIdCheck, // 아이디 중복 확인 핸들러
        handleSubmit, // 최종 회원가입 제출 핸들러
        // --- 기타 ---
        navigate, // 페이지 이동 함수
        lastCheckedId // 마지막으로 확인 성공한 ID (ref)
    };
};

export default useKakaoCallback; // 파일 마지막에 export 추가