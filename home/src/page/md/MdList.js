"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import "../../css/md/MdList.css"

function MdList() {
  const [mdList, setMdList] = useState([]) // 리스트 상태
  const [form, setForm] = useState({
    // 입력 폼 상태
    goods_name: "",
    movie_name: "",
    type: "",
    price: "",
    goods_option: "",
  })
  const [modalOpen, setModalOpen] = useState(false) // 모달 상태
  const [movieList, setMovieList] = useState([]) // 영화(등록검색용용)
  const [movieSearch, setMovieSearch] = useState("") // 영화 검색 상태
  const [showDropdown, setShowDropdown] = useState(false) // 드롭다운 표시 상태 추가

  // 페이지 로딩 시 리스트 가져오기
  useEffect(() => {
    getMdList()
    fetchMovieList() // 영화 리스트 가져오기
  }, [])

  // 리스트 불러오기(수정예정 확인용)
  const getMdList = () => {
    axios
      .post("http://localhost:9988/md/list")
      .then((res) => setMdList(res.data))
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    fetchMovieList()
    // 검색어가 있을 때 드롭다운 표시
    if (movieSearch.length > 0) {
      setShowDropdown(true)
    }
    console.log("영화 리스트:", movieList)
    console.log("검색어:", movieSearch)
    console.log("드롭다운 표시:", showDropdown)
  }, [movieSearch])

  const fetchMovieList = async () => {
    try {
      const response = await axios.get(`http://localhost:9988/md/movies?movieSearch=${movieSearch}`)
      setMovieList(response.data) // 영화 리스트 상태 업데이트
      console.log("API 응답:", response.data)
    } catch (err) {
      console.error("영화 리스트 가져오기 실패:", err)
    }
  }

  // 영화 선택 핸들러
  const handleMovieSelect = (movieName) => {
    setForm({ ...form, movie_name: movieName })
    setMovieSearch(movieName)
    setShowDropdown(false)
  }

  // 폼 제출 (등록)
  const handleSubmit = () => {
    // 유효성 검사
    if (!form.goods_name || !form.type || !form.price || !form.movie_name) {
      alert("굿즈이름, 종류, 가격, 영화이름은 필수입력입니다.")
      return
    }

    axios
      .post("http://localhost:9988/md/insert", {
        ...form,
        price: Number(form.price), // 문자열을 숫자로 변환 (int형 필드와 맞춤)
      })
      .then(() => {
        alert("등록 완료!")
        getMdList() // 등록 후 리스트 갱신
        setModalOpen(false) // 모달 닫기
        setForm({
          goods_name: "",
          movie_name: "",
          type: "",
          price: "",
          goods_option: "",
        }) // 폼 초기화
        setMovieSearch("")
      })
      .catch((err) => {
        console.error("등록 중 오류:", err)
        alert("등록 실패! 콘솔을 확인해주세요.")
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const openModal = () => setModalOpen(true) // 모달 열기
  const closeModal = () => {
    setModalOpen(false) // 모달 닫기
    setForm({
      goods_name: "",
      movie_name: "",
      type: "",
      price: "",
      goods_option: "",
    }) // 폼 초기화
    setMovieSearch("")
    setShowDropdown(false)
  }

  // 검색창 외부 클릭 시 드롭다운 닫기
  const handleClickOutside = () => {
    setTimeout(() => {
      setShowDropdown(false)
    }, 200)
  }

  return (
    <div className="md-container">
      <h2>📋 굿즈 리스트</h2>
      {mdList.map((item, idx) => (
        <div key={idx}>
          {item.goods_name} / {item.type} / {item.price}원 / {item.goods_option} / {item.movie_name}
        </div>
      ))}

      {/* 등록 */}
      <button id="md-register-btn" className="btn btn-primary" onClick={openModal}>
        등록하기
      </button>

      {/* 등록모달 */}
      {modalOpen && (
        <div className="md_modal-overlay">
          <div className="md_modal-wrapper">
            <div className="md_modal-content">
              <div className="md_modal-header">
                <h2 className="md_modal-title">굿즈 등록</h2>
                <button className="md_close-btn" onClick={closeModal}>
                  &times;
                </button>
              </div>

              <div className="md_modal-body">
                <div className="md_form-group">
                  <label>굿즈명</label>
                  <input
                    type="text"
                    name="goods_name"
                    className="md_form-input"
                    value={form.goods_name}
                    onChange={handleChange}
                    placeholder="굿즈명을 입력하세요"
                  />
                </div>

                <div className="md_form-group movie-search-container">
                  <label>영화 선택</label>
                  <input
                    type="text"
                    className="md_form-input"
                    value={movieSearch}
                    onChange={(e) => setMovieSearch(e.target.value)}
                    onFocus={() => {
                      if (movieSearch.length > 0) setShowDropdown(true)
                    }}
                    onBlur={handleClickOutside}
                    placeholder="영화명을 입력하세요"
                  />
                  {form.movie_name && <div className="selected-movie">선택된 영화: {form.movie_name}</div>}
                  {showDropdown && movieList.length > 0 && (
                    <div className="movie-dropdown">
                      {movieList.map((item) => (
                        <div
                          key={item.no}
                          className="movie-option"
                          onMouseDown={(e) => {
                            e.preventDefault() // onBlur 이벤트 방지
                            handleMovieSelect(item.name)
                          }}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {showDropdown && movieList.length === 0 && (
                    <div className="movie-dropdown">
                      <div className="movie-option">검색 결과 없음</div>
                    </div>
                  )}
                </div>

                <div className="md_form-group">
                  <label>종류</label>
                  <input
                    type="text"
                    name="type"
                    className="md_form-input"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="종류를 입력하세요"
                  />
                </div>

                <div className="md_form-group">
                  <label>가격</label>
                  <input
                    type="number"
                    name="price"
                    className="md_form-input"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="가격을 입력하세요"
                  />
                </div>

                <div className="md_form-group">
                  <label>옵션</label>
                  <input
                    type="text"
                    name="goods_option"
                    className="md_form-input"
                    value={form.goods_option}
                    onChange={handleChange}
                    placeholder="옵션을 입력하세요"
                  />
                </div>

                <div className="md_option-buttons">
                  <button className="md_add-option-btn">+</button>
                </div>
              </div>

              <div className="md_modal-footer">
                <button className="md_register-btn" onClick={handleSubmit}>
                  등록
                </button>
                <button className="md_cancel-btn" onClick={closeModal}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MdList
