import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import KakaoLogin from './page/user/LoginForm';
import KakaoCallback from './page/user/KakaoCallback';
import FindId from './page/user/FindId';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<KakaoLogin />} />
        <Route path='/kakao/callback' element={<KakaoCallback />} />
        <Route path='/user/findId' element={<FindId />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
