import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "";

export const useGeneralRegisterForm = (role = 'user') => {
  const navigate = useNavigate();

  const isManager = role === 'manager';  

  //회원가입 버튼 클릭시, role이 user인지 manager인지에 따라 axios 주소값 변경
  const registerEndpoint = isManager
    ? `${API_BASE_URL}/manager/home/register`
    : `${API_BASE_URL}/oauth/kakao/register/local`;

  // ── 폼 데이터 상태 ──
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    nickName: '',
    gender: 'MALE',
    email: '',
    phone1: '',
    phone2: '',
    phone3: ''
  });

  // ── 상태 ──
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const [idCheckLoading, setIdCheckLoading] = useState(false);
  const [idCheckStatus, setIdCheckStatus] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState('');

  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const [phoneCheckLoading, setPhoneCheckLoading] = useState(false);
  const [phoneCheckStatus, setPhoneCheckStatus] = useState('');   // '', 'checking', 'available', 'duplicate'
  const [phoneCheckMessage, setPhoneCheckMessage] = useState('');

  // ── 필드별 유효성 검사 ──
  const validateField = useCallback((name, value, data) => {
    let error = '';
    switch (name) {
      case 'id':
        if (!value.trim()) error = '아이디를 입력해주세요.';
        else if (value.length < 4) error = '아이디는 4자 이상이어야 합니다.';
        break;
      case 'password':
        if (!value) error = '비밀번호를 입력해주세요.';
        else if (value.length < 8) error = '비밀번호는 8자 이상이어야 합니다.';
        break;
      case 'passwordConfirm':
        if (!value) error = '비밀번호 확인을 입력해주세요.';
        else if (data.password !== value) error = '비밀번호가 일치하지 않습니다.';
        break;
      case 'nickName':
        if (!value.trim()) error = '사용할 닉네임을 입력해주세요.';
        else if (value.length > 20) error = '닉네임은 20자를 초과할 수 없습니다.';
        break;
      case 'email':
        if (!value.trim()) error = '이메일을 입력해주세요.';
        else if (!/\S+@\S+\.\S+/.test(value)) error = '유효한 이메일 형식이 아닙니다.';
        break;
      case 'phone1':
      case 'phone2':
      case 'phone3': {
        const p1 = name === 'phone1' ? value : data.phone1;
        const p2 = name === 'phone2' ? value : data.phone2;
        const p3 = name === 'phone3' ? value : data.phone3;
              if (!p1 && !p2 && !p3) {
                  error = '연락처를 입력해주세요.';
              }
              // 2) 각 부분별 형식 검증
              else if (!/^0\d{1,2}$/.test(p1)) {
                error = '연락처 첫 부분은 010 혹은 지역번호(02, 031 등)여야 합니다.';
              } else if (!/^\d{3,4}$/.test(p2)) {
                error = '연락처 중간 부분은 3~4자리 숫자여야 합니다.';
              } else if (!/^\d{4}$/.test(p3)) {
                error = '연락처 마지막 부분은 4자리 숫자여야 합니다.';
              }
        return { phone: error };
      }
      default:
        break;
    }
    return { [name]: error };
  }, []);

  // ── 입력 변경 핸들러 (실시간 유효성 검사) ──
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      const fieldResult = validateField(name, value, updated);
      setErrors(prevErr => {
        const newErr = { ...prevErr, ...fieldResult };
        // password 변경 시 확인 필드 재검증
        if (name === 'password' && updated.passwordConfirm) {
          const confirmErr = validateField('passwordConfirm', updated.passwordConfirm, updated).passwordConfirm;
          newErr.passwordConfirm = confirmErr;
        }
        // phone 부분 변경 시 기존 phone1/2/3 에러 제거
        if (name.startsWith('phone')) {
          delete newErr.phone1; delete newErr.phone2; delete newErr.phone3;
        }
        return newErr;
      });
      return updated;
    });
    if (name === 'id') {
      setIdCheckStatus('');
      setIdCheckMessage('');
    }
  }, [validateField]);

  // ── 아이디 중복 확인 ──
  const handleIdCheck = useCallback(async () => {
    const idError = validateField('id', formData.id, formData).id;
    if (idError) {
      setErrors(prev => ({ ...prev, id: idError }));
      return;
    }
    setIdCheckLoading(true);
    try {
      await axios.get(`${API_BASE_URL}/oauth/kakao/api/users/check-id/${formData.id}`);
      setIdCheckStatus('available');
      setIdCheckMessage('사용 가능한 아이디입니다.');
    } catch {
      setIdCheckStatus('invalid');
      setIdCheckMessage('이미 사용 중인 아이디입니다.');
    } finally {
      setIdCheckLoading(false);
    }
  }, [formData.id, validateField]);

  // ── 이미지 업로드 ──
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError(''); setUploadLoading(true); setPreviewImageUrl(null);
    try {
      const reader = new FileReader(); reader.onloadend = () => setPreviewImageUrl(reader.result);
      reader.readAsDataURL(file);
      const form = new FormData(); form.append('files', file);
      const resp = await axios.post(`${API_BASE_URL}/file-system/upload/register-image`, form, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: false });
      setUploadedImageId(resp.data[0]?.imageId ?? null);
    } catch {
      setUploadError('이미지 업로드에 실패했습니다.');
    } finally { setUploadLoading(false); }
  }, []);

  // 휴대폰 번호 중복 확인 로직
  const handlePhoneCheck = useCallback(async () => {
    const raw = formData.phone1 + formData.phone2 + formData.phone3;
    setPhoneCheckLoading(true);
    try {
      await axios.get(`${API_BASE_URL}/oauth/kakao/check-phone/${raw}`);
      setPhoneCheckStatus('available');
      setPhoneCheckMessage('사용 가능한 휴대폰 번호입니다.');
    } catch {
      setPhoneCheckStatus('duplicate');
      setPhoneCheckMessage('이미 사용 중인 휴대폰 번호입니다.');
    } finally {
      setPhoneCheckLoading(false);
    }
  }, [formData.phone1, formData.phone2, formData.phone3]);

  // ── 전체 폼 유효성 검사 ──
  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = {};
    ['id','password','passwordConfirm','nickName','email'].forEach(field => {
      const err = validateField(field, formData[field], formData)[field];
      if (err) { newErrors[field] = err; valid = false; }
    });
    // 연락처 검증
    const phoneErr = validateField('phone1', formData.phone1, formData).phone;
    if (phoneErr) { newErrors.phone = phoneErr; valid = false; }

    if (!uploadedImageId) { newErrors.profileImage = '프로필 이미지를 업로드해주세요.'; valid = false; }
    setErrors(newErrors);
    return valid;
  }, [formData, uploadedImageId, validateField]);

  // ── 제출 핸들러 ──
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); setApiError('');
    const payload = {
      id: formData.id,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      nickName: formData.nickName,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone1 && formData.phone2 && formData.phone3
      ? `${formData.phone1}${formData.phone2}${formData.phone3}`
      : null,
      uploadedProfileImageId: uploadedImageId
    };
    try {
      //registerEndpoint는 role이 user, manager에 따라 다름름
      await axios.post(registerEndpoint, payload);
      setSuccess(true); 

      if(role === 'user'){
        navigate('/login');
      }else if(role === 'manager'){
        navigate('/manager');
      }
    } catch (err) {
      setApiError(err.response?.data?.errorMsg || '회원가입에 실패했습니다.');
    } finally { setLoading(false); }
  }, [formData, uploadedImageId, navigate, validateForm]);

  return {
    formData, errors, loading, apiError, success,
    idCheckLoading, idCheckStatus, idCheckMessage,
    handleChange, handleIdCheck, handleFileChange, handleSubmit,
    previewImageUrl, uploadLoading, uploadError,
    phoneCheckLoading,phoneCheckStatus,phoneCheckMessage,handlePhoneCheck,
  };
};

export default useGeneralRegisterForm;
