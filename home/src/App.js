import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import KakaoLogin from './js/KakaoLogin';
import KakaoCallback from './js/KakaoCallback';
import MainPage from './page/public/MainPage';
import InquiryPage from './page/inquiry/InquiryPage';
import Main from './page/user/Main';
import Layout from './page/user/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='login' element={<Main />} />
          <Route path='kakao/callback' element={<Main />} />
          <Route path='user/findId' element={<Main />} />
        </Route>
        <Route path='/manager' element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='login' element={<Main />} />
          <Route path='kakao/callback' element={<Main />} />
          <Route path='user/findId' element={<Main />} />
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
