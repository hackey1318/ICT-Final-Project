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
import { useEffect, useState } from "react"
import axios from "axios"
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess"

const BASE_URL = `${apiNoAccessClient.defaults.baseURL}/file-system/download/`

function Main() {

  const [bannerList, setBannerList] = useState([])

  useEffect(() => {
    // 배너 리스트를 가져오는 함수 호출
    readBannerList()
  }, [])

  function readBannerList() {

    apiNoAccessClient.get("/banner/MOVIE")
      .then((response) => {
        const data = response.data
        console.log("배너 리스트:", data)
        setBannerList(data)
      })
      .catch((error) => {
        console.error("배너 리스트 가져오기 오류:", error)
      })
  }

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
          {bannerList.map((banner, index) => (
            <SwiperSlide
              key={banner.imageId || index}
              style={{ backgroundColor: banner.color || "#1a3b6d" }} // 배경색 사용 일단 보류중
            >
              <div className="Main_banner-overlay"></div> {/* Overlay for better text visibility */}
              <Link to={`/movies/${banner.targetNo}`} className="Main_banner-link">
                <div className="Main_banner-image-container">
                  <img src={`${BASE_URL}${banner.fileId}`} alt={`movie-${banner.targetNo}`} className="Main_banner-image" />
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
