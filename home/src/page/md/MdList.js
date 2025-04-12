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
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [sortField, setSortField] = useState("updatedAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchKeyword, setSearchKeyword] = useState("")
  const accessToken = sessionStorage.getItem("accessToken")

  useEffect(() => {
    getMdList()
  }, [page, sortField, sortDirection])

  useEffect(() => {
    if (modalOpen && movieSearch.length > 0) {
      fetchMovieList()
      setShowDropdown(true)
    }
  }, [movieSearch])

  const getMdList = () => {
    axios
      .get(`http://localhost:9988/md/items?page=${page}&size=${size}&sort=${sortField},${sortDirection}&name=${encodeURIComponent(searchKeyword)}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log("정보", res.data)
        setMdList(res.data.content)
        setTotalPages(res.data.totalPages)
      })
      .catch((err) => console.error(err))
  }

  const fetchMovieList = async () => {
    if (!modalOpen) return
    try {
      const response = await axios.get(
        `http://localhost:9988/md/insert-moviename?movieSearch=${encodeURIComponent(movieSearch)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      setMovieList(response.data)
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
      .post(
        "http://localhost:9988/md/insert",
        {
          ...form,
          price: Number(form.price),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
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

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalOpen && !e.target.closest(".md_modal-wrapper")) {
        closeModal()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [modalOpen])

  return (
    <div className="md-yes-container">
      <h2>굿즈 리스트</h2>
      {/* 👇 검색/정렬 UI */}
      <div className="md_search-sort-controls">
        <div className="md_search-container">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="굿즈명을 검색하세요"
            className="md_search-input"
          />
          <button
            className="md_search-btn"
            onClick={() => {
              setPage(0)
              getMdList()
            }}
          >
            검색
          </button>
        </div>

        <div className="md_sort-container">
          <label>정렬 기준: </label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="updatedAt">등록일</option>
            <option value="name">이름</option>
            <option value="price">가격</option>
          </select>

          <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>
      </div>

      {/*굿즈리스트 */}
      <div className="md_table-container">
        <table className="md_table">
          <thead>
            <tr>
              <th>No.</th>
              <th>굿즈명</th>
              <th>영화</th>
              <th>종류</th>
              <th>가격</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {mdList.map((item, idx) => (
              <tr key={idx} className="md_item">
                <td>{page*size + idx+1}</td>
                <td><span className="md_text-ellipsis-name" title={item.name}>{item.name}</span></td>
                <td><span className="md_text-ellipsis-moviename" title={item.movieName}>{item.movieName}</span></td>
                <td>{item.type}</td>
                <td>{item.price.toLocaleString()}원</td>
                <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
            {mdList.length === 0 && (
              <tr>
                <td colSpan={7} className="md_no-data">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div id ="md-button-wrapper">
      <button id="md-register-btn" className="btn btn-primary" onClick={openModal}>
        등록하기
      </button>
      </div>

      <div className="md_pagination">
        <button className="md_pagination-btn" onClick={() => handlePageChange(0)} disabled={page === 0}>
          처음
        </button>
        <button className="md_pagination-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          &lt;
        </button>

        {/* 페이지네이션 버튼 */}
        {(() => {
          const pageButtons = []
          const pageGroup = Math.floor(page / 5)
          const startPage = pageGroup * 5
          const endPage = Math.min(startPage + 4, totalPages - 1)

          for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
              <button
                key={i}
                className={`md_pagination-btn ${page === i ? "md_pagination-active" : ""}`}
                onClick={() => handlePageChange(i)}
              >
                {i + 1}
              </button>,
            )
          }

          return pageButtons
        })()}

        <button
          className="md_pagination-btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
        >
          &gt;
        </button>
        <button
          className="md_pagination-btn"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page === totalPages - 1}
        >
          마지막
        </button>
      </div>

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
                  {form.movieNo && <div className="selected-movie">선택된 영화: {movieSearch}</div>}
                  {showDropdown && movieList.length > 0 && (
                    <div className="movie-dropdown">
                      {movieList.map((item) => (
                        <div
                          key={item.no}
                          className="movie-option"
                          onClick={(e) => {
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
                  <select name="type" className="md_form-input" value={form.type} onChange={handleChange}>
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
