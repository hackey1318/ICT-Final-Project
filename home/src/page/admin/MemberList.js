import axios from 'axios';
import '../../css/dashboard/user.css';

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
        <div className='userdau-wrap'>
            <h3>Admin Page - User list</h3>
            <div className="member_search-container">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="md_dropdown">
                    <option value="memberId">아이디</option>
                    <option value="memberNickname">닉네임</option>
                    <option value="memberEmail">이메일</option>
                </select>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="form-control-search w-25 me-2"
                    style={{ padding: '0.5rem' }}
                    placeholder="검색어를 입력하세요"
                />
                <button className="btn btn-primary" onClick={() => { setPage(0); getUserList(); }}>
                    검색
                </button>
            </div>
            
            <div className='userdau-list'>
                <ul>
                    <li><div className="userdau-list-title">회원번호</div></li>
                    <li><div className="userdau-list-title">회원아이디</div></li>
                    <li><div className="userdau-list-title">회원닉네임</div></li>
                    <li><div className="userdau-list-title">이메일</div></li>
                    <li><div className="userdau-list-title">연락처</div></li>
                    <li><div className="userdau-list-title">회원상태</div></li>
                </ul>
                {
                    userList.map((item)=>{
                        return(
                            <ul key={item.no} className="userdau-list-item">
                                <li>{item.no}</li>
                                <li>{item.id}</li>
                                <li>{item.nickname}</li>
                                <li>{item.email}</li>
                                <li>010-6385-467{Math.floor(Math.random()*10)}</li>
                                <li>{item.status}</li>
                            </ul>
                        )
                    })
                }

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