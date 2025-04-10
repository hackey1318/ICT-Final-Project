import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './page/public/MainPage';
import InquiryPage from './page/inquiry/InquiryPage';
import Main from './page/user/Main';
import Layout from './page/user/Layout';
import KakaoLogin from './page/user/LoginForm';
import KakaoCallback from './page/user/KakaoCallback';
import FindId from './page/user/FindId';
import FindPwd from './page/user/FindPwd';
import PwdReset from './page/user/PwdReset';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='login' element={<KakaoLogin />} />
          <Route path='kakao/callback' element={<KakaoCallback />} />
          <Route path='user/findId' element={<FindId />} />
          <Route path='user/findPwd' element={<FindPwd />} />
          <Route path='user/pwdReset' element={<PwdReset />} />
        </Route>
        <Route path='/manager' element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='login' element={<KakaoLogin />} />
          <Route path='kakao/callback' element={<KakaoCallback />} />
          <Route path='user/findId' element={<FindId />} />
        </Route>
        <Route path='/' element={<MainPage />} />
        <Route path='/kakao/login' element={<KakaoLogin />} />
        <Route path='/kakao/callback' element={<KakaoCallback />} />
        <Route path='/inquiry' element={<InquiryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
