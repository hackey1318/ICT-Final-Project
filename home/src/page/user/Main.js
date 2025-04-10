import React from 'react'; // useEffect, useState는 배너 데이터 로딩에 필요하면 다시 추가
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import SectionTodayMovies from './SectionTodayMovies'; // 이것이 컴포넌트화라는것이다.

// CSS 파일 import
import './../../css/user/Main.css'; // 위에서 정의한 CSS 파일

// Swiper CSS import (이것들은 유지해야 함)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- 기존 데이터 (API 로딩 시 useEffect, useState 필요) ---
const dummyBannerList = [
  { imageId: '7da7dd9b9a354d21', title: '패션 오브 01', color: '#f0e6d2' }, 
  { imageId: '3c711d8c63bd4e88', title: '파란 01', color: '#d0e0f0' },    
  { imageId: 'af4635f4d68f4607', title: '너의 췌장 01', color: '#ffe4e1' }, 
  { imageId: '30bd478a1ebe4887', title: '본회퍼 01', color: '#e0e0e0' },    
  { imageId: 'aec156d375f3418f', title: '4월의 불꽃 01', color: '#ffccbc' }, 
];
const BASE_URL = 'http://localhost:9988/file-system/download/';
// -------------------------------------------------------

// --- 다른 섹션 예시 컴포넌트 (Main.js 내부에 두거나 별도 파일로 분리 가능) ---



const SectionEvent = () => (
  <div>
    <h2>이벤트 및 소식</h2>
    {/* 여기에 내용 추가 */}
  </div>
);
// ----------------------------------------------------------------------

function Main() {
  return (
    // 전체 풀페이지 스크롤 컨테이너
    <div className="Main_fullpage-container">

      {/* --- 섹션 1: 메인 배너 (Swiper) --- */}
      <section className="Main_section Main_section-banner">
        {/* Swiper 컴포넌트 */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          spaceBetween={30} // 슬라이드 간 간격
          // Swiper 자체에 적용할 클래스 추가 가능 (선택사항)
          // className="my-custom-swiper-class"
        >
          {dummyBannerList.map((banner, index) => ( // API 사용 시 banners.map
            <SwiperSlide key={banner.imageId || index}
            style={{ backgroundColor: banner.color || '#ffffff' }} 
                        > {/* 고유 ID 사용 권장 */}
              <div className="Main_banner-image-container">
                <img
                  src={`${BASE_URL}${banner.imageId}`}
                  alt={banner.title}
                  className="Main_banner-image" // CSS 클래스 적용
                  // style 속성 제거 또는 필요한 최소한만 남김
                />
              </div>
              {/* 배너 제목 - 스타일은 CSS에서 제어 */}
              <div className="Main_banner-title">{banner.title}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* --- 섹션 2: 정보 섹션 --- */}
      <SectionTodayMovies />

      {/* --- 섹션 3: 이벤트 섹션 --- */}
      <section className="Main_section Main_section-event">
        <SectionEvent />
      </section>

      {/* --- 필요에 따라 더 많은 섹션 추가 --- */}
      {/*
      <section className="Main_section Main_section-another">
        <h2>네 번째 섹션</h2>
      </section>
      */}

    </div> // Main_fullpage-container 끝
  );
}

export default Main;