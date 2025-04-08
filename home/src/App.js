import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import KakaoLogin from './js/KakaoLogin';
import KakaoCallback from './js/KakaoCallback';
import FindId from './page/user/FindId';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<KakaoLogin />} />
        <Route path='/kakao/callback' element={<KakaoCallback />} />
        <Route path='/user/findId' element={<FindId />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
