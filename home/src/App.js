import GeneralRegisterForm from './page/user/GeneralRegisterForm';
import './App.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
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
import TossPayment from './js/payment/TossPayment';
import TossPaymentSuccess from './js/payment/TossPaymentSuccess';
import TossPaymentFail from './js/payment/TossPaymentFail';
import PaymentResult from './js/payment/PaymentResult';
import ManagerLogin from './page/admin/ManagerLogin';
import { useEffect } from 'react';
import MovieDetail from './page/movie/MovieDetail';
import ReviewListPage from './page/movie/ReviewListPage';
import ReviewWritePage from './page/movie/ReviewWritePage';
import ReviewEditPage from './page/movie/ReviewEditPage';
import GenreMovie from './page/movie/GenreMovie';
import CurrentMovie from './page/movie/CurrentMovie';
import UpcomingMovie from './page/movie/UpcomingMovie';
import MdList from './page/md/MdList';
import Admin from './page/admin/Admin';
import DashBoard from './page/dashboard/UserDau';
import Cart from './js/cart/Cart';
import OrderList from './js/order/OrderList';
import OrderDetail from './js/order/OrderDetail';
import OrderError from './js/order/OrderError';
import MemberList from './page/admin/MemberList';
import ManagerList from './page/admin/ManagerList';
import Gender from './page/admin/Gender';
import InquiryReply from './page/admin/InquiryReply';
import InquiryReplyView from './page/admin/InquiryReplyView';
import GoodsDetail from './page/md/GoodsDetail';
import MdShop from './page/md/MdShop';
import RelatedMovie from './page/movie/RelatedMovie';
import BlackList from './page/admin/BlackList';
import UserAnnounce from './page/user/UserAnnounce';
import UserAnnounceDetail from './page/user/UserAnnounceDetail';
import AnnounceList from './page/admin/AnnounceList';
import AnnounceDetail from './page/admin/AnnounceDetail';
import ManagerRegister from './page/admin/ManagerRegisterForm';
import AdminFindId from './page/admin/AdminFindId';
import AdminFindPwd from './page/admin/AdminFindPwd';
import Report from './page/admin/Report';
import BannerList from './page/admin/banner/BannerList';
import MypageSidebar from './js/sidebar/MyPageSidebar';
import LikedItemsPage from './page/user/mypage/LikedItemsPage';
import MovieTheater from './page/cinemate/MovieTheater';
import MovieList from './page/cinemate/MovieList';
import MovieListDetail from './page/cinemate/MovieListDetail';
import MovieRoom from './page/cinemate/MovieRoom';


function App() {

	const location = useLocation();

	function ReviewListRoute() {
		const { id } = useParams();                    // URL :movies/:id/reviews
		const stored = sessionStorage.getItem('userInfo');
		const currentUser = stored ? JSON.parse(stored) : null;
		const currentUserNo = currentUser?.userNo;
		return (
			<>
				<ReviewListPage
					movieNo={Number(id)}
					currentUserNo={currentUserNo}

				/>

				<Outlet />
			</>
		);
	}

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
				<Route path="/register" element={<GeneralRegisterForm />} />
				<Route path='user/findId' element={<FindId />} />
				<Route path='user/findPwd' element={<FindPwd />} />
				<Route path='user/pwdReset' element={<PwdReset />} />
				<Route path='movies' element={<GenreMovie />} />
				<Route path='payment/tossPayment' element={<TossPayment />} />
				<Route path='payment/tossPaymentSuccess' element={<TossPaymentSuccess />} />
				<Route path='payment/tossPaymentFail' element={<TossPaymentFail />} />
				<Route path='payment/result' element={<PaymentResult />} />
				<Route path='movies/:id' element={<MovieDetail />} />
				<Route path='movies/:id/reviews' element={<ReviewListRoute />}>
					<Route path='write' element={<ReviewWritePage />} />
					<Route path='edit/:reviewNo' element={<ReviewEditPage />} />
				</Route>
				<Route path='movies/current' element={<CurrentMovie />} />
				<Route path='movies/upcoming' element={<UpcomingMovie />} />
				<Route path='/inquiry' element={<InquiryPage />} />
				<Route path='/inquiryView/:no' element={<InquiryView />} />
				<Route path='cart' element={<Cart />} />


				<Route path='order/error' element={<OrderError />} />
				<Route path='mdshop' element={<MdShop />} />
				<Route path="mdshop/:goodsNo" element={<GoodsDetail />} />
				<Route path="/related-movie/:movieId" element={<RelatedMovie />} />
				<Route path="/announcements" element={<UserAnnounce />} />
				<Route path="/announcements/:id" element={<UserAnnounceDetail />} />
				<Route path="mypage" element={<MypageSidebar />} >
					<Route index element={<LikedItemsPage />} />
					<Route path="likes" element={<LikedItemsPage />} />
					<Route path='order/list' element={<OrderList />} />
					<Route path='order/detail' element={<OrderDetail />} />
				</Route>

				{/* 시네메이트 */}
				<Route path="cinemate" element={<MovieTheater />} >
					<Route index element={<MovieList />} />
					<Route path="movies" element={<MovieList />} />
				</Route>
				<Route path="/cinemate/movies/:movieNo" element={<MovieListDetail />} />
				<Route path="/cinemate/movies/:movieNo/room/:no" element={<MovieRoom />} />
			</Route>

			{/* 로그인 & 비로그인 페이지 (사이드바 없음) */}
			<Route path="/manager">
				<Route index element={<ManagerLogin />} />
				<Route path="find-id" element={<AdminFindId />} />
				<Route path="find-pwd" element={<AdminFindPwd />} />
				<Route path="pwdReset" element={<PwdReset />} />
				<Route path="register" element={<ManagerRegister />} />

				{/* 로그인 이후 관리자 레이아웃 (사이드바 포함) */}
				<Route path="home" element={<Admin />}>
					<Route index element={<DashBoard />} />
					<Route path="dau" element={<UserDau />} />
					<Route path="member-list" element={<MemberList />} />
					<Route path="manager-list" element={<ManagerList />} />
					<Route path="blacklist" element={<BlackList />} />
					<Route path="gender" element={<Gender />} />
					<Route path="mdlists" element={<MdList />} />
					<Route path="inquiry" element={<InquiryReply />} />
					<Route path="inquiry/:no" element={<InquiryReplyView />} />
					<Route path="announce" element={<AnnounceList />} />
					<Route path="announce/:no" element={<AnnounceDetail />} />
					<Route path="report" element={<Report />} />
					<Route path='banner' element={<BannerList />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
