import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import KakaoLogin from './js/KakaoLogin';
import KakaoCallback from './js/KakaoCallback';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<KakaoLogin />} />
        <Route path='/kakao/callback' element={<KakaoCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
