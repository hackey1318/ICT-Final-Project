"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import MdRegisterModal from "./MdRegisterModal"
import "../../css/md/MdList.css"

function MdList() {
  const [mdList, setMdList] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [sortField, setSortField] = useState("updatedAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchType, setSearchType] = useState("name")
  const [searchValue, setSearchValue] = useState("")
  const [editTarget, setEditTarget] = useState(null);
  const accessToken = sessionStorage.getItem("accessToken")

  useEffect(() => {
    getMdList()
  }, [page, sortField, sortDirection])

  const getMdList = () => {
    const params = {
      page,
      size,
      sort: `${sortField},${sortDirection}`,
    }
    if (searchValue.trim() !== "") {
      params[searchType] = searchValue
    }

    axios
      .get("http://localhost:9988/md-shop/items", {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setMdList(res.data.content)
        setTotalPages(res.data.totalPages)
      })
      .catch((err) => console.error(err))
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
    }
  }

  const openModal = () => {
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
  
    try {
      await axios.delete(`http://localhost:9988/md-shop/items?id=${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      alert("삭제 완료!");
      getMdList();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 실패!");
    }
  };

  return (
    <div className="md-yes-container">
      <h2>굿즈 리스트</h2>
      <div className="md_search-sort-controls">
        <div className="md_search-container">
          <select
            className="md_dropdown"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="name">굿즈명</option>
            <option value="movie">영화명</option>
          </select>

          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="md_search-input"
          />

          <button className="md_search-btn" onClick={() => {
            setPage(0)
            getMdList()
          }}>
            검색
          </button>
        </div>

        <div className="md_sort-container">
          <select className="md_dropdown" value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="updatedAt">등록일</option>
            <option value="name">이름</option>
            <option value="price">가격</option>
          </select>

          <select className="md_dropdown" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>
      </div>

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
                <td>{page * size + idx + 1}</td>
                <td><span className="md_text-ellipsis-name" title={item.name}>{item.name}</span></td>
                <td><span className="md_text-ellipsis-moviename" title={item.movieName}>{item.movieName}</span></td>
                <td>{item.type}</td>
                <td>{item.price.toLocaleString()}원</td>
                <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}</td>
                <td>
                  <button onClick={() => {
                    setEditTarget(item);
                    setModalOpen(true);
                  }}>수정</button>

                  <button onClick={() => handleDelete(item.id)}>삭제</button>
                </td>
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

      <div id="md-button-wrapper">
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
      <MdRegisterModal
        closeModal={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        refreshList={getMdList}
        editTarget={editTarget}
  />
)}
    </div>
  )
}

export default MdList;
