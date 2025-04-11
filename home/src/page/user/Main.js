import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

import SectionTodayMovies from "./SectionTodayMovies"
import SectionNewGoods from "./SectionNewGoods"

// CSS files
import "./../../css/user/Main.css"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Link } from "react-router-dom"

// Banner data
const dummyBannerList = [
  { imageId: "7da7dd9b9a354d21", title: "패션 오브 01", color: "#1a3b6d", bannerUrl: "/movies/59" },
  { imageId: "3c711d8c63bd4e88", title: "파란 01", color: "#1a3b6d", bannerUrl: "/movies/59" },
  { imageId: "af4635f4d68f4607", title: "너의 췌장 01", color: "#1a3b6d", bannerUrl: "/movies/59" },
  { imageId: "30bd478a1ebe4887", title: "본회퍼 01", color: "#1a3b6d", bannerUrl: "/movies/59" },
  { imageId: "aec156d375f3418f", title: "4월의 불꽃 01", color: "#1a3b6d", bannerUrl: "/movies/59" },
]
const BASE_URL = "http://localhost:9988/file-system/download/"

function Main() {
  return (
    <div className="Main_fullpage-container">
      {/* --- 섹션 1: 메인 배너 (Swiper) --- */}
      <section className="Main_section Main_section-banner">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          spaceBetween={0} // Remove space between slides for full-bleed effect
        >
          {dummyBannerList.map((banner, index) => (
            <SwiperSlide
              key={banner.imageId || index}
              style={{ backgroundColor: banner.color || "#1a3b6d" }} // 배경색 사용 일단 보류중
            >
              <div className="Main_banner-overlay"></div> {/* Overlay for better text visibility */}
              <Link to={banner.bannerUrl} className="Main_banner-link">
                <div className="Main_banner-image-container">
                  <img src={`${BASE_URL}${banner.imageId}`} alt={banner.title} className="Main_banner-image" />
                  {/* Title positioned as overlay */}
                  <div className="Main_banner-title" hidden>{banner.title}</div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* --- 섹션 2: 정보 섹션 --- */}
      <SectionTodayMovies />

      {/* --- 섹션 3: 이벤트 섹션 --- */}
      <SectionNewGoods />
    </div>
  )
}

export default Main
