import axios from 'axios';
import '../../css/dashboard/user.css';
import Button from '../../js/common/Buttons.js';

import { useEffect, useState } from "react";
const accessToken = sessionStorage.getItem("accessToken");

function MemberList(){
    //데이터 담을 변수
    const [userList, setUserList] = useState([]);

    //페이징 관련 변수
    const [page, setPage] = useState(0); //현재페이지
    const [totalPages, setTotalPages] = useState(0); //전체 페이지수

    //검색관련 변수
    const [searchType, setSearchType] = useState("memberId"); //검색타입
    const [searchValue, setSearchValue] = useState(""); //검색값

    const handleSearch = e => {
        e.preventDefault();      // 페이지 리로드 막고
        setPage(0);
        getUserList();           // 검색 실행
      };

    useEffect(()=>{
        getUserList();
    },[page]);

    const getUserList = () => {
        axios.get(`http://localhost:9988/manager/home/member-list?page=${page}&size=10`, {
            params:{
                page,
                sort: "createdAt,desc",
                [searchType]: searchValue.trim() === "" ? null : searchValue
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response)=>{
            console.log("response.data", response.data);
            console.log("content", response.data.content);
    
            setUserList(response.data.content);
            setTotalPages(response.data.totalPages);

        }).catch((error)=>{
            console.log(error);
        });
    };

    //페이징 버튼
    const handlePageChange = (newPage)=>{
        setPage(newPage);
    }

    //페이지 번호 버튼
    const pageButtons = () => {
        const buttons = [];
        for (let i = 0; i < totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={page === i ? 'active' : ''} // 현재 페이지 버튼에 스타일 추가
                >
                    {i + 1}
                </button>
            );
        }
        return buttons;
    };
    
    return(
        <div className='memberlist-wrap'>
            <h3>Admin Page - User list</h3>
             {/* 🔍 검색창 */}
            <form className="d-flex justify-content-end mb-3" onSubmit={handleSearch}>
                <div className="member_search-container">
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="user_dropdown">
                        <option value="memberId">아이디</option>
                        <option value="memberNickname">닉네임</option>
                        <option value="memberEmail">이메일</option>
                    </select>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{ padding: '11px' }}
                        placeholder="검색어를 입력하세요"
                    />
                    <Button variant='primary' type='submit'>
                        검색
                    </Button>
                </div>
            </form>

            <div className='memberlist-container'>
                <table className="memberlist-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>회원아이디</th>
                            <th>회원닉네임</th>
                            <th>이메일</th>
                            <th>연락처</th>
                            <th>회원상태</th>
                        </tr>
                    </thead>
                        <tbody>
                    {
                        userList.map((item)=>{
                            return(
                                <tr key={item.no} className="memberlist-item">
                                    <td>{item.no}</td>
                                    <td>{item.id}</td>
                                    <td>{item.nickname}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.status}</td>
                                </tr>
                            )
                        })
                    }
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

                    {/* 페이지 번호 버튼 */}
                    <div className="page-buttons">
                        {pageButtons()}
                    </div>

                    {page < totalPages - 1 && (
                        <button className="page-buttons" onClick={() => handlePageChange(page + 1)}>
                            다음
                        </button>
                    )}
                </div>
        </div>
    )
}

export default MemberList;