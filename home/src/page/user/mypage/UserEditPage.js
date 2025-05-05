// src/page/user/mypage/UserEditPage.js
import React, { useState, useEffect } from 'react';
import axios from '../../../js/public/axiosConfig';
import '../../../css/user/mypage/UserEditPage.css';
import apiClient from '../../../js/public/axiosConfig';
import apiNoAccessClient from '../../../js/public/axiosConfigNoAccess';
import { handleUserLogout } from '../../../js/api/UserLogout';

export default function UserEditPage() {
  const [form, setForm] = useState({
    id: '',
    email: '',
    nickname: '',
    phone: '',
    profileImageUrl: ''
  });
  const [originalForm, setOriginalForm] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [phoneCheckLoading, setPhoneCheckLoading] = useState(false);
  const [phoneCheckStatus, setPhoneCheckStatus] = useState('');
  const [phoneCheckMessage, setPhoneCheckMessage] = useState('');

  // 초기 데이터 로드 및 원본 저장
  useEffect(() => {
    apiClient.get('/user')
      .then(({ data }) => {
        const init = {
          id: data.id || '',
          email: data.email || '',
          nickname: data.nickname || '',
          phone: data.phone || '',
          profileImageUrl: data.profileImageUrl || ''
        };
        setForm(init);
        setOriginalForm(init);
        setPreview(data.profileImageUrl || '');
      })
      .catch(() => setError('프로필 정보를 불러오는 중 오류가 발생했습니다.'));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'phone') {
      setPhoneCheckStatus('');
      setPhoneCheckMessage('');
    }
  };

  const handlePhoneCheck = async () => {
    if (!originalForm) return;
    if (form.phone === originalForm.phone) {
      setPhoneCheckStatus('same');
      setPhoneCheckMessage('기존과 동일한 번호입니다.');
      return;
    }
    if (!form.phone) return;
    setPhoneCheckLoading(true);
    try {
      await axios.get(`/oauth/kakao/check-phone/${form.phone}`);
      setPhoneCheckStatus('available');
      setPhoneCheckMessage('사용 가능한 휴대폰 번호입니다.');
    } catch {
      setPhoneCheckStatus('duplicate');
      setPhoneCheckMessage('이미 사용 중인 휴대폰 번호입니다.');
    } finally {
      setPhoneCheckLoading(false);
    }
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const fd = new FormData();
    fd.append('files', file);
    try {
      const res = await apiClient.post('/file-system/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageId = res.data[0].imageId;
      const imageUrl = `${apiNoAccessClient.defaults.baseURL}/file-system/download/${imageId}`;
      setForm(prev => ({ ...prev, profileImageUrl: imageUrl }));
    } catch(error) {
      if (error.response.status === 423) {
        handleUserLogout();
      }
      setError('프로필 이미지를 업로드하는 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.put('/user', {
        email: form.email,
        nickname: form.nickname,
        phone: form.phone,
        profileImageUrl: form.profileImageUrl
      });
      const stored = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
      sessionStorage.setItem('userInfo', JSON.stringify({
        ...stored,
        email: res.data.email,
        nickname: res.data.nickname,
        phone: res.data.phone,
        profileImageUrl: res.data.profileImageUrl
      }));
      window.location.href = '/mypage';
    } catch (error) {
      if (error.response.status === 423) {
        handleUserLogout();
      }
      setError('회원정보 수정에 실패했습니다. 입력값을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 변경 사항 감지
  const hasChanges = originalForm ? (
    form.email !== originalForm.email ||
    form.nickname !== originalForm.nickname ||
    form.profileImageUrl !== originalForm.profileImageUrl ||
    form.phone !== originalForm.phone
  ) : false;

  // 제출 버튼 활성화 여부
  const canSubmit = hasChanges && (!hasChanges || form.phone === originalForm.phone || phoneCheckStatus === 'available');

  return (
    <div className="user-edit-page">
      <h2>회원 정보 수정</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-form">
        <label>아이디</label>
        <input type="text" name="id" value={form.id} disabled />

        <label>Nickname</label>
        <input
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Phone</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="숫자만 입력"
            required
          />
          <button
            type="button"
            onClick={handlePhoneCheck}
            disabled={phoneCheckLoading}
            className="btn-submit"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
          >
            {phoneCheckLoading ? '확인 중…' : '중복 확인'}
          </button>
        </div>
        {phoneCheckMessage && (
          <p className={
            phoneCheckStatus === 'available' ? 'text-success' :
            phoneCheckStatus === 'same' ? 'text-secondary' :
            'error'
          }>
            {phoneCheckMessage}
          </p>
        )}

        <label>Profile Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="프로필 미리보기" className="preview" />}

        <button type="submit" disabled={!canSubmit || loading} className="btn-submit">
          {loading ? '수정 중...' : '수정 완료'}
        </button>
      </form>
    </div>
  );
}
