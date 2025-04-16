import './App.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Route, Routes, useLocation } from 'react-router-dom';
import Main from './page/user/Main'
import Layout from './page/user/Layout';
import KakaoLogin from './page/user/LoginForm';
import KakaoCallback from './page/user/KakaoCallback';
import FindId from './page/user/FindId';
import FindPwd from './page/user/FindPwd';
import PwdReset from './page/user/PwdReset';
import InquiryPage from './page/inquiry/InquiryPage';
import InquiryView from './page/inquiry/InquiryView';
import UserDau from './page/dashboard/UserDau';
import ManagerLogin from './page/admin/ManagerLogin';
import { useEffect } from 'react';
import MovieDetail from './page/movie/MovieDetail';
import GenreMovie from './page/movie/GenreMovie';
import MdList from './page/md/MdList';
import Admin from './page/admin/Admin';
import DashBoard from './page/dashboard/UserDau';
import MemberList from './page/admin/MemberList';

function App() {

  const location = useLocation();

  useEffect(() => {
    const isManagerPage = location.pathname.startsWith('/manager');
    document.body.classList.toggle('manager-page', isManagerPage);
  }, [location.pathname]);

  return (
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='login' element={<KakaoLogin />} />
          <Route path='kakao/callback' element={<KakaoCallback />} />
          <Route path='user/findId' element={<FindId />} />
          <Route path='user/findPwd' element={<FindPwd />} />
          <Route path='user/pwdReset' element={<PwdReset />} /><Route path='movies' element={<GenreMovie />} />
          <Route path='movies/:id' element={<MovieDetail />} />
          <Route path='/inquiry' element={<InquiryPage />} />
          <Route path='/inquiryView/:no' element={<InquiryView />} />
        </Route>

        {/* 로그인 & 비로그인 페이지 (사이드바 없음) */}
        <Route path="/manager">
          <Route index element={<ManagerLogin />} />
          <Route path="findId" element={<FindId />} />
          <Route path="findPwd" element={<FindPwd />} />
          <Route path="pwdReset" element={<PwdReset />} />
          
          {/* 로그인 이후 관리자 레이아웃 (사이드바 포함) */}
          <Route path="home" element={<Admin />}>
            <Route index element={<DashBoard/>} />
            <Route path="dau" element={<UserDau />} />
            <Route path="member-list" element={<MemberList />} />
            <Route path="mdlists" element={<MdList />} />
          </Route>
        </Route>

      </Routes>
  );
}

export default App;
