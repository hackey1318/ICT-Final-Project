import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../js/public/axiosConfig';

export default function WithdrawPage() {
  const [step, setStep] = useState('confirm');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConfirm = (yes) => {
    if (yes) setStep('password');
    else navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/user/withdraw', { password });
      // 1) sessionStorage에서 토큰 삭제
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userInfo');
      // 2) 사용자에게 알리고 메인으로
      alert('회원 탈퇴가 완료되었습니다.');
      window.location.replace('/');
    } catch (err) {
      if (err.response?.status === 400) {
        setError('비밀번호가 일치하지 않습니다.');
      } else {
        setError('서버 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="withdraw-page">
      {step === 'confirm' && (
        <>
          <h2>정말로 회원 탈퇴를 진행하시겠습니까?</h2>
          <button className="btn btn-secondary" onClick={() => handleConfirm(false)}>아니요</button>
          <button className="btn btn-danger"    onClick={() => handleConfirm(true)}>네, 탈퇴할게요</button>
        </>
      )}

      {step === 'password' && (
        <form onSubmit={handleSubmit}>
          <h2>비밀번호 확인</h2>
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-danger">탈퇴하기</button>
        </form>
      )}
    </div>
  );
}