import axios from "axios";
import { useEffect, useState } from "react";
import Button from '../../js/common/Buttons.js';
import '../../css/dashboard/AdminList.css';

const accessToken = sessionStorage.getItem("accessToken");

function ManagerList() {
    // 데이터와 상태
    const [managerList, setManagerList] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchType, setSearchType] = useState("memberId");
    const [searchValue, setSearchValue] = useState("");
    const [selectStates, setSelectStates] = useState({});

    // 관리자 리스트 조회
    const getManagerList = (pageIndex = 0) => {
        const params = {
            page: pageIndex,
            size: 10,
            sort: "no,asc"
        };
        if (searchValue.trim()) {
            params[searchType] = searchValue.trim();
        }
        axios.get(`/manager/home/member-list/admin`, {
            params,
            headers: {
                "Content-Type": "application/json",
                ...(accessToken && { Authorization: `Bearer ${accessToken}` })
            }
        })
            .then(response => {
                const data = response.data;
                setManagerList(data.content);
                setTotalPages(data.totalPages);
                // 선택 상태 초기화
                const initial = {};
                data.content.forEach(item => { initial[item.no] = item.role; });
                setSelectStates(initial);
            })
            .catch(err => console.error("관리자 리스트 조회 실패:", err));
    };

    // 초기 로드 및 페이지 변경
    useEffect(() => {
        getManagerList(page);
    }, [page]);

    // 검색 제출
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        getManagerList(0);
    };

    // 페이지 변경
    const handlePageChange = (newPage) => setPage(newPage);

    // 관리자 권한 변경
    const handleRoleChange = (e, userNo) => {
        const value = e.target.value;
        if (value === "delete") {
            if (!window.confirm(`MANAGER ${userNo}번을 삭제하시겠습니까?`)) return;
            axios.post(`/manager/home/manager-delete/${userNo}`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
                .then(() => getManagerList(page))
                .catch(err => console.error(err));
        }
    };

    return (
        <div className='memberlist-wrap'>
            <h3>Admin Page - Manager List</h3>

            <form className="d-flex justify-content-end mb-3" onSubmit={handleSearch}>
                <div className="member_search-container">
                    <select
                        value={searchType}
                        onChange={e => setSearchType(e.target.value)}
                        className="user_dropdown"
                        style={{ width: '200px' }}
                    >
                        <option value="memberId">관리자아이디</option>
                        <option value="memberNickname">관리자닉네임</option>
                        <option value="memberEmail">이메일</option>
                    </select>

                    <input
                        type="text"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        style={{ padding: '11px' }}
                        placeholder="검색어를 입력하세요"
                    />

                    <Button variant='primary' type="submit">검색</Button>
                </div>
            </form>

            <div className='memberlist-container'>
                <table className="manager-list-table">
                    <thead>
                        <tr>
                            <th>관리자번호</th>
                            <th>관리자아이디</th>
                            <th>관리자닉네임</th>
                            <th>이메일</th>
                            <th>연락처</th>
                            <th>관리자권한</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {managerList.map((item, index) => {
                            const number = page * 10 + index + 1;  // ✅ 번호 계산 공식
                            return (
                                <tr key={item.no} className="memberlist-item">
                                    <td>{number}</td> {/* 수정: item.no 대신 number! */}
                                    <td>{item.id}</td>
                                    <td>{item.nickname}</td>
                                    <td>{item.email}</td>
                                    <td>010-0000-0000</td>
                                    {item.role === "ADMIN" ? (
                                        <>
                                            <td>관리자</td>
                                            <td>-</td>
                                        </>
                                    ) : (
                                        <>
                                            <td>매니저</td>
                                            <td>
                                                <button className="btn btn-danger" value="delete" onClick={(e) => handleRoleChange(e, item.no)}>삭제</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="paging-container">
                {page > 0 && (
                    <button className="page-buttons" onClick={() => handlePageChange(page - 1)}>이전</button>
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
                    <button className="page-buttons" onClick={() => handlePageChange(page + 1)}>다음</button>
                )}
            </div>
        </div>
    );
}

export default ManagerList;