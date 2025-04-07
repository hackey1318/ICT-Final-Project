import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useKakaoCallback = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // 폼 제출 로딩 상태
    const [initialLoading, setInitialLoading] = useState(true); // 초기 카카오 정보 로딩 상태
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState("");

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

    const [errors, setErrors] = useState({});

    // --- 아이디 중복 확인 관련 상태 ---
    const [idCheckLoading, setIdCheckLoading] = useState(false);
    const [idCheckStatus, setIdCheckStatus] = useState('unchecked');
    const [idCheckMessage, setIdCheckMessage] = useState('');
    const lastCheckedId = useRef(null);
    // --- ---

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
                    else error = "";
                } else {
                     error = "";
                }
                return { phone: error };
            default:
                break;
        }
        return { [name]: error };
    }, []); // formData에 대한 의존성 제거 (매개변수로 받으므로)

    // 입력 필드 변경 핸들러
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        // setFormData를 호출할 때 함수형 업데이트를 사용하여 최신 상태 보장
        setFormData(prevFormData => {
            const updatedFormData = { ...prevFormData, [name]: value };

            // 업데이트된 formData를 기반으로 유효성 검사
            const fieldErrors = validateField(name, value, updatedFormData);
            setErrors(prevErrors => ({ ...prevErrors, ...fieldErrors }));

            // 비밀번호 변경 시 비밀번호 확인 필드도 재검증
            if (name === 'password') {
                const confirmErrors = validateField('passwordConfirm', updatedFormData.passwordConfirm, updatedFormData);
                setErrors(prevErrors => ({ ...prevErrors, ...confirmErrors }));
            }

            // 전화번호 필드 변경 시 전화번호 에러 업데이트
             if (name.startsWith('phone')) {
                 const phoneErrors = validateField(name, value, updatedFormData);
                 setErrors(prevErrors => ({ ...prevErrors, ...phoneErrors }));
             }

             return updatedFormData; // 새로운 상태 반환
         });


        // --- 아이디 필드가 변경되면 중복 확인 상태 초기화 ---
        if (name === 'id') {
            setIdCheckStatus('unchecked');
            setIdCheckMessage('');
            // lastCheckedId.current는 여기서 바꾸지 않음. 확인 성공 시에만 업데이트.
        }
        // --- ---

    }, [validateField]); // formData 의존성 제거

    // 전체 폼 유효성 검사 함수
    const validateForm = useCallback(() => {
        let formIsValid = true;
        const newErrors = {};

        Object.keys(formData).forEach(fieldName => {
            if (fieldName.startsWith('phone')) return;
            if (fieldName === 'id') {
                const idFormatError = validateField('id', formData.id, formData).id;
                if (idFormatError) {
                    newErrors.id = idFormatError;
                    formIsValid = false;
                }
            } else {
                const fieldErrorObj = validateField(fieldName, formData[fieldName], formData);
                const errorMsg = fieldErrorObj[fieldName];
                if (errorMsg) {
                    newErrors[fieldName] = errorMsg;
                    formIsValid = false;
                }
            }
        });

        const { phone1, phone2, phone3 } = formData;
        const phoneFilled = phone1 || phone2 || phone3;
        if (phoneFilled) {
            const phoneErrorObj = validateField('phone1', phone1, formData);
             if (phoneErrorObj.phone) {
                 newErrors.phone = phoneErrorObj.phone;
                 formIsValid = false;
            }
        } else {
             if(newErrors.phone) delete newErrors.phone;
        }

        setErrors(newErrors);
        return formIsValid;
    }, [formData, validateField]); // formData 의존성 추가

    // --- 아이디 중복 확인 함수 ---
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
            // 아이디 중복 확인 API 엔드포인트 확인 필요 (이전 대화 내용 기반)
            await axios.get(`http://localhost:9988/oauth/kakao/api/users/check-id/${formData.id}`);
            setIdCheckStatus('available');
            setIdCheckMessage('사용 가능한 아이디입니다.');
            lastCheckedId.current = formData.id;
            setErrors(prev => ({ ...prev, id: '' }));
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    setIdCheckStatus('duplicate');
                    setIdCheckMessage('이미 사용 중인 아이디입니다.');
                    lastCheckedId.current = null;
                    setErrors(prev => ({ ...prev, id: '이미 사용 중인 아이디입니다.' }));
                } else if (error.response.status === 400) {
                     setIdCheckStatus('error');
                     setIdCheckMessage('아이디 형식이 올바르지 않거나 유효하지 않습니다.');
                     lastCheckedId.current = null;
                     setErrors(prev => ({ ...prev, id: '아이디 형식이 올바르지 않습니다.' }));
                } else {
                    setIdCheckStatus('error');
                    setIdCheckMessage('아이디 중복 확인 중 오류가 발생했습니다.');
                    lastCheckedId.current = null;
                    setErrors(prev => ({ ...prev, id: '서버 오류 발생' }));
                }
            } else {
                setIdCheckStatus('error');
                setIdCheckMessage('네트워크 오류가 발생했습니다. 연결을 확인해주세요.');
                lastCheckedId.current = null;
                setErrors(prev => ({ ...prev, id: '네트워크 오류' }));
            }
            console.error("아이디 중복 확인 오류:", error);
        } finally {
            setIdCheckLoading(false);
        }
    }, [formData.id, idCheckLoading, validateField]); // formData.id 의존성 추가

    // 컴포넌트 마운트 시 카카오 코드 처리 및 가입 여부 확인
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        // user 상태가 없고, 초기 로딩 중일 때만 실행
        if (!user && initialLoading) {
            if (code) {
                axios.get(`http://localhost:9988/oauth/kakao/login?code=${code}`)
                    .then(response => {
                        if (response.data.existUser === true) {
                            setApiError("이미 가입된 카카오 계정입니다. 로그인 페이지로 이동합니다.");
                            setTimeout(() => navigate("/login"), 3000);
                        } else if (response.data.existUser === false && response.data.kakaoUserInfoDto) {
                            setUser(response.data); // user 상태 설정 (이것이 폼 렌더링 트리거)
                            const kakaoNickname = response.data.kakaoUserInfoDto.knickName;
                            setFormData(prev => ({ ...prev, nickName: kakaoNickname }));
                            // 닉네임 유효성 검사는 handleChange에서 처리되거나, 필요시 여기서 직접 호출
                            const nickNameError = validateField('nickName', kakaoNickname, {...formData, nickName: kakaoNickname});
                            setErrors(prevErrors => ({ ...prevErrors, ...nickNameError }));

                            window.history.replaceState({}, document.title, window.location.pathname);
                        } else {
                            console.error("백엔드 응답 형식 오류:", response.data);
                            setApiError("사용자 정보를 처리하는 중 오류가 발생했습니다.");
                        }
                    })
                    .catch(error => {
                        console.error("카카오 로그인 정보 확인 실패:", error.response?.data || error.message);
                        const backendErrorMsg = error.response?.data?.errorMessage;
                        setApiError(backendErrorMsg || "카카오 로그인 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
                    })
                    .finally(() => {
                        setInitialLoading(false);
                    });
            } else {
                setApiError("유효하지 않은 접근입니다. 카카오 로그인을 다시 진행해주세요.");
                setInitialLoading(false);
            }
        } else if (user && initialLoading) {
             // 이미 user 정보가 있는 상태로 컴포넌트가 다시 마운트되는 경우 등
             setInitialLoading(false);
        }
    }, [user, initialLoading, navigate, validateField]); // 의존성 배열 점검

    // 최종 회원가입 제출 핸들러
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setApiError("");
        setSuccess("");

        if (!validateForm()) {
            console.log("폼 유효성 검사 실패:", errors);
            setApiError("입력 내용을 다시 확인해주세요.");
            return;
        }
        if (idCheckStatus !== 'available') {
            setApiError("아이디 중복 확인을 완료해주세요.");
            document.getElementById('id')?.focus();
            return;
        }
        if (formData.id !== lastCheckedId.current) {
            setApiError("아이디가 변경되었습니다. 다시 중복 확인을 해주세요.");
            setIdCheckStatus('unchecked');
            setIdCheckMessage('');
            lastCheckedId.current = null;
            document.getElementById('id')?.focus();
            return;
        }
        if (!user || !user.kakaoUserInfoDto) {
            setApiError("카카오 사용자 정보가 없습니다. 로그인 과정을 다시 진행해주세요.");
            return;
        }

        try {
            setLoading(true);
            const registerRequest = {
                id: formData.id,
                password: formData.password,
                nickName: formData.nickName,
                gender: formData.gender,
                phone: (formData.phone1 && formData.phone2 && formData.phone3 && !errors.phone)
                       ? `${formData.phone1}${formData.phone2}${formData.phone3}`
                       : null,
                kakaoUserInfo: {
                    kakaoId: user.kakaoUserInfoDto.kakaoId,
                    email: user.kakaoUserInfoDto.email,
                    knickName: user.kakaoUserInfoDto.knickName,
                    profile: user.kakaoUserInfoDto.profile 

                }
            };

            const response = await axios.post("http://localhost:9988/oauth/kakao/register", registerRequest);

            if (response.status === 200 && response.data) {
                setSuccess("회원가입이 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setApiError(response.data?.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원가입 오류:", error.response?.data || error.message);
            if (error.response?.data?.message) {
                 setApiError(error.response.data.message);
            } else {
                 setApiError("회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        } finally {
            setLoading(false);
        }
    }, [formData, user, errors.phone, idCheckStatus, validateForm, navigate]); // 필요한 의존성 추가

    // 훅이 뷰 컴포넌트에 제공해야 하는 값들을 반환
    return {
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
        navigate, // navigate 함수도 반환하여 뷰에서 직접 사용할 수 있게 함 (예: 에러 시 버튼 클릭)
        lastCheckedId
    };
};

export default useKakaoCallback; // 파일 마지막에 export 추가