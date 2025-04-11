import React from 'react';
import './../../css/user/SectionNewGoods.css'; // 이 컴포넌트 전용 CSS 파일

// 이미지 기본 URL (API 서버 주소)
const BASE_URL = 'http://localhost:9988/file-system/download/';

// --- 더미 데이터 (API 연동 시 대체) ---
const dummyGoodsData = [
  {
    no: 1,
    // postImage 대신 imageId 사용 (값은 실제 ID로 가정)
    imageId: 'e7b63fbcc29849fe', // 예시 ID (실제 백엔드 ID 사용 필요)
    name: '덤보 핀 트레블 스티커',
    price: 5000,
    productUrl: 'https://brand.naver.com/cgv/products/5165399080'
  },
  {
    no: 2,
    imageId: 'd83c2665724f43a4', // 예시 ID
    name: '뮬란 키체인',
    price: 9000,
    productUrl: '#'
  },
  {
    no: 3,
    imageId: 'b2928a3719a14173', // 예시 ID
    name: '밤비 손거울',
    price: 9000,
    productUrl: 'https://brand.naver.com/cgv/products/5030107646'
  },
  {
    no: 4,
    imageId: '5d22918f8207486a', // 예시 ID
    name: '푸우 손거울',
    price: 9000,
    productUrl: '#'
  },
  {
    no: 5,
    imageId: '68bc03e2c6924c95', // 예시 ID
    name: '릴로와 스티치 뱃지',
    price: 7000,
    productUrl: '#'
  },
  {
    no: 6,
    imageId: '6a267a1d0d6347c1', // 예시 ID
    name: '덤보 뱃지',
    price: 7000,
    productUrl: '#'
  },
];
// -----------------------------------

// 개별 상품 아이템 컴포넌트
const GoodsItem = ({ item }) => (
  <a
    href={item.productUrl || '#'}
    target="_blank"
    rel="noopener noreferrer"
    className="Goods_item_link"
  >
    <div className="Goods_item">
      <div className="Goods_item_image_container">
        {/* ⭐ 이미지 src를 BASE_URL과 item.imageId를 조합하여 생성 */}
        <img
          src={`${BASE_URL}${item.imageId}`} // 템플릿 리터럴 사용
          alt={item.name}
          className="Goods_item_image"
          // onError 핸들러 추가 (선택 사항): 이미지를 불러오지 못했을 때 대체 이미지 표시 등
          onError={(e) => { e.target.onerror = null; e.target.src="placeholder.png"; /* 대체 이미지 경로 */ }}
        />
      </div>
      <div className="Goods_item_info">
        <p className="Goods_item_name">{item.name}</p>
        <p className="Goods_item_price">{item.price.toLocaleString()}원</p>
      </div>
    </div>
  </a>
);


function SectionNewGoods() {
  return (
    <section className="Main_section Goods_section">
      <div className="Goods_header">
        <h2>새로운 굿즈!</h2>
        <p>새롭게 입고된 굿즈를 만나보세요!</p>
      </div>

      <div className="Goods_list">
        {dummyGoodsData.map((item) => (
          <GoodsItem key={item.no} item={item} />
        ))}
      </div>

      <div className="Goods_footer">
        <a href="/goods" className="Goods_seeAll">모두 보기 {'>'}
        </a>
      </div>
    </section>
  );
}

export default SectionNewGoods;