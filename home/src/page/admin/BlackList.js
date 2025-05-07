import axios from "axios";
import { useEffect, useState } from "react";
import Button from '../../js/common/Buttons.js';
import apiClient from "../../js/public/axiosConfig.js";

const accessToken = sessionStorage.getItem("accessToken");

function BlackList() {
  // 데이터 및 검색 상태
  const [blackList, setBlackList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchType, setSearchType] = useState("memberId");
  const [searchValue, setSearchValue] = useState("");
  const [selectStatus, setSelectStatus] = useState({});

  // 블랙리스트 조회 함수
  const getBlackList = (pageIndex = 0) => {
    const params = {
      page: pageIndex,
      size: 10,
      sort: "no,desc",
      ...(searchValue.trim() && { [searchType]: searchValue.trim() })
    };
    apiClient.get(`/manager/home/blacklist`, {
      params,
    })
    .then(response => {
      const { content, totalPages } = response.data;
      setBlackList(content);
      setTotalPages(totalPages);
      // 상태 초기화
      const initial = {};
      content.forEach(item => { initial[item.no] = item.status; });
      setSelectStatus(initial);
    })
    .catch(err => console.error("블랙리스트 조회 실패:", err));
  };

  // 초기 로드 및 페이지 변경
  useEffect(() => {
    getBlackList(page);
  }, [page]);

  // 검색 제출
  const handleSearch = e => {
    e.preventDefault();
    setPage(0);
    getBlackList(0);
  };

  // 페이지 변경
  const handlePageChange = newPage => setPage(newPage);

  // 상태 변경 핸들러
  const handleStatusChange = (e, userNo) => {
    const value = e.target.value;
    if (value === "active") {
      if (!window.confirm(`사용자 ${userNo}번을 활성화하시겠습니까?`)) return;
      apiClient.post(
        `/manager/home/blacklist-active/${userNo}`,
        {},
      )
      .then(() => getBlackList(page))
      .catch(err => console.error("상태 변경 실패:", err));
    }
  };

  return (
    <div className="memberlist-wrap">
      <h3 className="contents-title">Admin Page - BlackList</h3>

      {/* 검색 폼 */}
      <form className="d-flex justify-content-end mb-3" onSubmit={handleSearch}>
        <div className="member_search-container">
          <select
            value={searchType}
            onChange={e => setSearchType(e.target.value)}
            className="user_dropdown"
          >
            <option value="memberId">아이디</option>
            <option value="memberNickname">닉네임</option>
            <option value="memberEmail">이메일</option>
          </select>

          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="검색어를 입력하세요"
          />

          <Button variant='primary' type="submit">
            검색
          </Button>
        </div>
      </form>

      {/* 테이블 */}
      <div className="memberlist-container">
        <table className="memberlist-table">
          <thead>
            <tr>
              <th>회원번호</th>
              <th>회원아이디</th>
              <th>회원닉네임</th>
              <th>이메일</th>
              <th>연락처</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {blackList.map(item => (
              <tr key={item.no} className="memberlist-item">
                <td>{item.no}</td>
                <td>{item.id}</td>
                <td>{item.nickname}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>
                  <select
                    className="list-select-box"
                    value={selectStatus[item.no] || item.status}
                    onChange={e => handleStatusChange(e, item.no)}
                  >
                    <option value={item.status}>비활성화</option>
                    <option value="active">활성화</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이징 */}
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
              className={page === i ? 'active' : ''}
            >{i + 1}</button>
          ))}
        </div>

        {page < totalPages - 1 && (
          <button className="page-buttons" onClick={() => handlePageChange(page + 1)}>
            다음
          </button>
        )}
      </div>
    </div>
  );
}

export default BlackList;