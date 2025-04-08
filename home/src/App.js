import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import KakaoLogin from './js/KakaoLogin';
import KakaoCallback from './js/KakaoCallback';
import FindId from './page/user/FindId';
import FindPwd from './page/user/FindPwd';
import PwdReset from './page/user/PwdReset';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<KakaoLogin />} />
        <Route path='/kakao/callback' element={<KakaoCallback />} />
        <Route path='/user/findId' element={<FindId />} />
        <Route path='/user/findPwd' element={<FindPwd />} />
        <Route path='/user/pwdReset' element={<PwdReset />} />	
      </Routes>
    </BrowserRouter>
  );
}

export default App;
