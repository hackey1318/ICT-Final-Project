import './App.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './page/user/Main'
import Layout from './page/user/Layout';
import KakaoLogin from './page/user/LoginForm';
import KakaoCallback from './page/user/KakaoCallback';
import FindId from './page/user/FindId';
import FindPwd from './page/user/FindPwd';
import PwdReset from './page/user/PwdReset';
import ManagerLogin from './page/admin/ManagerLogin';

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
        <Route path='/manager' element={<ManagerLogin />}>
          <Route index element={<ManagerLogin />} />
          <Route path='user/findId' element={<FindId />} />
          <Route path='user/findPwd' element={<FindPwd />} />
          <Route path='user/pwdReset' element={<PwdReset />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
