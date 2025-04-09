import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import KakaoLogin from './js/KakaoLogin';
import KakaoCallback from './js/KakaoCallback';
import MdList from './page/md/MdList';  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<KakaoLogin />} />
        <Route path='/kakao/callback' element={<KakaoCallback />} />
        <Route path='/page/md/list' element={<MdList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
