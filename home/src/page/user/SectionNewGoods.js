import React, { useEffect, useState } from 'react';
import './../../css/user/SectionNewGoods.css'; // 이 컴포넌트 전용 CSS 파일
import axios from 'axios';
import { Link } from 'react-router-dom';
import apiNoAccessClient from '../../js/public/axiosConfigNoAccess';

// 이미지 기본 URL (API 서버 주소)
const BASE_URL = `${apiNoAccessClient.defaults.baseURL}/file-system/download/`;

// 개별 상품 아이템 컴포넌트
const GoodsItem = ({ item }) => (
	<Link to={`/mdshop/${item.id}`} className="Goods_item_link">
		<div className="Goods_item">
			<div className="Goods_item_image_container">
				{/* ⭐ 이미지 src를 BASE_URL과 item.imageId를 조합하여 생성 */}
				<img
					src={item.imageUrls?.[0] ? `${BASE_URL}${item.imageUrls[0]}` : 'placeholder.png'}
					alt={item.name}
					className="Goods_item_image"
					// onError 핸들러 추가 (선택 사항): 이미지를 불러오지 못했을 때 대체 이미지 표시 등
					onError={(e) => { e.target.onerror = null; e.target.src = "placeholder.png"; /* 대체 이미지 경로 */ }}
				/>
			</div>
			<div className="Goods_item_info">
				<p className="Goods_item_name">{item.name}</p>
				<p className="Goods_item_price">{item.price.toLocaleString()}원</p>
			</div>
		</div>
	</Link>
);


function SectionNewGoods() {

	const [goodsList, setGoodsList] = useState([]);

	useEffect(() => {
		const fetchGoods = async () => {
			const size = getPageSizeByWindowWidth();
			try {
				const res = await apiNoAccessClient.get(`/md-shop/lists?page=0&size=${size}`);
				setGoodsList(res.data.content); // Page<MdShopDto>의 content
			} catch (err) {
				console.error('굿즈 목록 조회 실패:', err);
			}
		};

		fetchGoods();
	}, []);

	// 사이즈 계산 함수
	const getPageSizeByWindowWidth = () => {
		const width = window.innerWidth;
		if (width >= 1024) return 8;     // PC
		if (width >= 768) return 4;      // 태블릿
		return 2;                        // 모바일
	};

	return (
		<section className="Main_section Goods_section">
			<div className="Goods_header">
				<h2>새로운 굿즈!</h2>
				<p>새롭게 입고된 굿즈를 만나보세요!</p>
			</div>

			<div className="Goods_list">
				{goodsList.map((item) => (
					<GoodsItem key={item.id} item={item} />
				))}
			</div>

			<div className="Goods_footer">
				<a href="/mdshop" className="Goods_seeAll">모두 보기 {'>'}
				</a>
			</div>
		</section>
	);
}

export default SectionNewGoods;