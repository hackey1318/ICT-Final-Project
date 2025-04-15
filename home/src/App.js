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
        <Route path='/manager'>
          <Route index element={<ManagerLogin />} />
          <Route path='user/findId' element={<FindId />} />
          <Route path='user/findPwd' element={<FindPwd />} />
          <Route path='user/pwdReset' element={<PwdReset />} />
          <Route path='dashboard/userdau' element={<UserDau />} />
          <Route path='mdlists' element={<MdList />} />
        </Route>
      </Routes>
  );
}

export default App;
