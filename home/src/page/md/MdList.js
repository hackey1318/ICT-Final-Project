import axios from "axios";
import { useEffect, useState } from "react";
import MdRegisterModal from "./MdRegisterModal";
import "../../css/md/MdList.css";
import Button from '../../js/common/Buttons.js';
import apiClient from "../../js/public/axiosConfig.js";
import { handleUserLogout } from "../../js/api/UserLogout";

function MdList() {
  const [mdList, setMdList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    getMdList();
  }, [page, sortField, sortDirection]);

  const getMdList = () => {
    apiClient
      .get("/md-shop/lists", {
        params: {
          page,
          size,
          sort: `${sortField},${sortDirection}`,
          [searchType]: searchValue.trim() === "" ? null : searchValue,
        },
      })
      .then((res) => {
        console.log("response.data", res.data);
        setMdList(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error(err)
        if (err.response.status === 423) {
          handleUserLogout();
        }
      });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  const handleEdit = (item) => {
    setEditTarget(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await apiClient.delete(`/md-shop/items/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("삭제 완료!");
      getMdList();
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제 중 오류 발생");
      if (err.response.status === 423) {
        handleUserLogout();
      }
    }
  };

  return (
    <div className="md-yes-container">
      <h2>굿즈 리스트</h2>
        <div id="md-button-wrapper">
          <button id="md-register-btn" className="btn btn-outline-primary" onClick={() => { setModalOpen(true); setEditTarget(null); }}>
            등록하기
          </button>
        </div>

      <div className="md_search-sort-controls">

        <div className="md_sort-container">
          <label>정렬 기준:</label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="md_dropdown" style={{ padding: '12px' }}>
            <option value="updatedAt">등록일</option>
            <option value="name">이름</option>
            <option value="price">가격</option>
          </select>
          <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)} className="md_dropdown" style={{ padding: '12px' }}>
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>

        <div className="md_search-container">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="md_dropdown" style={{ padding: '12px' }}>
            <option value="name">굿즈명</option>
            <option value="movie">영화명</option>
          </select>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="md_search-input"
            placeholder="검색어를 입력하세요"
            style={{ padding: '10px' }}
          />
          <Button variant='primary' onClick={() => { setPage(0); getMdList(); }}>
            검색
          </Button>
        </div>

      </div>

      <div className="md_table-container">
        <table className="md_table">
          <thead>
            <tr>
              <th>굿즈번호</th>
              <th>굿즈명</th>
              <th>영화</th>
              <th>종류</th>
              <th>가격</th>
              <th>등록일</th>
              <th>관리</th>
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
                  <button className="md_btn-edit" onClick={() => handleEdit(item)}>수정</button>
                  <button className="md_btn-delete" onClick={() => handleDelete(item.id)}>삭제</button>
                </td>
              </tr>
            ))}
            {mdList.length === 0 && (
              <tr>
                <td colSpan={7} className="md_no-data">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="paging-container">
        {page > 0 && (
          <button className="page-buttons" onClick={() => handlePageChange(page - 1)}>
            이전
          </button>
        )}

        <div className="page-buttons">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={page === i ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {page < totalPages - 1 && (
          <button className="page-buttons" onClick={() => handlePageChange(page + 1)}>
            다음
          </button>
        )}
      </div>

      {modalOpen && (
        <MdRegisterModal
          closeModal={() => { setModalOpen(false); setEditTarget(null); }}
          refreshList={getMdList}
          editTarget={editTarget}
        />
      )}
    </div>
  );
}

export default MdList;
