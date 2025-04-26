import axios from "axios";
import { useEffect, useState } from "react";
import Button from '../../js/common/Buttons.js';

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
            sort: "no,desc"
        };
        if (searchValue.trim()) {
            params[searchType] = searchValue.trim();
        }
        axios.get(`http://localhost:9988/manager/home/manager-list`, {
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
            axios.post(`http://localhost:9988/manager/home/manager-delete/${userNo}`, {}, {
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
                <table className="memberlist-table">
                    <thead>
                        <tr>
                            <th>관리자번호</th>
                            <th>관리자아이디</th>
                            <th>관리자닉네임</th>
                            <th>이메일</th>
                            <th>연락처</th>
                            <th>관리자권한</th>
                        </tr>
                    </thead>
                    <tbody>
                        {managerList.map(item => (
                            <tr key={item.no} className="memberlist-item">
                                <td>{item.no}</td>
                                <td>{item.id}</td>
                                <td>{item.nickname}</td>
                                <td>{item.email}</td>
                                <td>010-0000-0000</td>
                                <td>
                                    {item.role === "ADMIN" ? (
                                        item.role
                                    ) : (
                                        <select
                                            value={selectStates[item.no] || item.role}
                                            onChange={e => handleRoleChange(e, item.no)}
                                            className="list-select-box"
                                        >
                                            <option value={item.role}>{item.role}</option>
                                            <option value="delete">DELETE</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
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