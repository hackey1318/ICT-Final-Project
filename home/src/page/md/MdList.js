"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import "../../css/md/MdList.css"

function MdList() {
  const [mdList, setMdList] = useState([])

  const [form, setForm] = useState({
    name: "",
    movieNo: "",
    type: "",
    price: "",
    options: "",
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [movieList, setMovieList] = useState([])
  const [movieSearch, setMovieSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const accessToken = sessionStorage.getItem("accessToken")

  useEffect(() => {
    getMdList()
  }, [])

  useEffect(() => {
    if (modalOpen && movieSearch.length > 0) {
      fetchMovieList()
      setShowDropdown(true)
    }
  }, [movieSearch])

  const getMdList = () => {
    axios
      .post("http://localhost:9988/md/list",{
        header:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      })
      .then((res) => setMdList(res.data))
      .catch((err) => console.error(err))
  }

  const fetchMovieList = async () => {
    if (!modalOpen) return
    try {
      const response = await axios.get(`http://localhost:9988/md/movies?movieSearch=${movieSearch}`)
      setMovieList(response.data)
      console.log("API 응답:", response.data)
    } catch (err) {
      console.error("영화 리스트 가져오기 실패:", err)
    }
  }

  const handleMovieSelect = (movie) => {
    setForm({ ...form, movieNo: movie.no })
    setMovieSearch(movie.name)
    setShowDropdown(false)
  }

  const handleSubmit = () => {
    if (!form.name || !form.type || !form.price || !form.movieNo) {
      alert("굿즈이름, 종류, 가격, 영화선택은 필수입력입니다.")
      return
    }

    axios
      .post("http://localhost:9988/md/insert", {
        ...form,
        price: Number(form.price),
      })
      .then(() => {
        alert("등록 완료!")
        getMdList()
        setModalOpen(false)
        setForm({
          name: "",
          movieNo: "",
          type: "",
          price: "",
          options: "",
        })
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

  const openModal = () => {
    setModalOpen(true)
    setMovieSearch("")
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm({
      name: "",
      movieNo: "",
      type: "",
      price: "",
      options: "",
    })
    setMovieSearch("")
    setShowDropdown(false)
  }

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
          {item.name} / {item.type} / {item.price}원 / {item.options} / {item.movie_name}
        </div>
      ))}

      <button id="md-register-btn" className="btn btn-primary" onClick={openModal}>
        등록하기
      </button>

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
                    name="name"
                    className="md_form-input"
                    value={form.name}
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
                  {form.movieNo && (
                    <div className="selected-movie">선택된 영화: {movieSearch}</div>
                  )}
                  {showDropdown && movieList.length > 0 && (
                    <div className="movie-dropdown">
                      {movieList.map((item) => (
                        <div
                          key={item.no}
                          className="movie-option"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            handleMovieSelect(item)
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
                  <select
                    name="type"
                    className="md_form-input"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="">종류를 선택하세요</option>
                    <option value="포스터">포스터</option>
                    <option value="인형">인형</option>
                    <option value="머그컵">머그컵</option>
                    <option value="기타">기타</option>
                  </select>
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
                    name="options"
                    className="md_form-input"
                    value={form.options}
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