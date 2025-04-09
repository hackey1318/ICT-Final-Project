import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import KakaoLogin from './js/KakaoLogin';
import KakaoCallback from './js/KakaoCallback';
import MainPage from './page/public/MainPage';
import InquiryPage from './page/inquiry/InquiryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/kakao/login' element={<KakaoLogin />} />
        <Route path='/kakao/callback' element={<KakaoCallback />} />
        <Route path='/inquiry' element={<InquiryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
