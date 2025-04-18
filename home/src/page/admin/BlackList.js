import axios from "axios";
import { useEffect, useState } from "react";

const accessToken = sessionStorage.getItem("accessToken");

function BlackList(){
    //데이터 담을 변수
    const [blackList, setBlackList] = useState([]);

    //페이징 관련 변수
    const [page, setPage] = useState(0); //현재페이지
    const [totalPages, setTotalPages] = useState(0); //전체 페이지수

    //사용자status 선택 상태
    const [selectStatus, setSelectStatus] = useState({}); 

    useEffect(()=>{
        axios.get(`http://localhost:9988/manager/home/blacklist?page=${page}&size=10`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response)=>{
            console.log("response.data", response.data);
            console.log("content", response.data.content);

            const data = response.data.content;
    
            setBlackList(response.data.content);
            setTotalPages(response.data.totalPages);

            //선택 상태 초기화
            const initialStatus = {};
            data.forEach(item => {
                initialStatus[item.no] = item.role;
            });
            setSelectStatus(initialStatus);
        }).catch((error)=>{
            console.log(error);
        });
    },[page]);

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

    //활성상태 변경시 실행됨
    const handleStatusChange = (e, userNo)=>{
        const selectedValue = e.target.value;

        if(selectedValue === "active"){
            const isConfirmed = window.confirm(`사용자 ${userNo}번을 활성화 하시겠습니까?\n'확인'을 누르시면 활성상태가 되고, 목록에서 삭제됩니다.`);

            if(isConfirmed){ //status DEACTIVE -> ACTIVE로 변경
                axios.post(`http://localhost:9988/manager/home/blacklist-active/${userNo}`,{},{
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                .then((response)=>{

                    //status ACTIVE로 변경 후 목록 요청해서 갱신
                    axios.get(`http://localhost:9988/manager/home/blacklist?page=${page}&size=10`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                    .then((response)=>{

                        //블랙리스트, 전체페이지수 셋팅
                        setBlackList(response.data.content);
                        setTotalPages(response.data.totalPages);
                        alert(`${userNo}번 사용자 상태가 활성화 되었습니다.`);
                    }).catch((error)=>{
                        console.log("목록 갱신 중 오류 발생:", error);
                        alert("블랙리스트 목록을 갱신하는데 오류가 발생했습니다.");
                    });
                }).catch((error)=>{

                    //백에서 예외처리 한 거 반영
                    const errorMessage = error.response ? error.response.data : "알 수 없는 오류가 발생했습니다.";
                    alert(`상태 변경 중 오류가 발생했습니다: ${errorMessage}`);
                });
            }
        }
    }

    return(
        <div className="userdau-wrap">
            <h3 className="contents-title">Admin Page - BlackList</h3>

            <div className="userdau-list">
                <ul>
                    <li style={{}}><div className="userdau-list-title">회원번호</div></li>
                    <li style={{}}><div className="userdau-list-title">회원아이디</div></li>
                    <li style={{}}><div className="userdau-list-title">회원닉네임</div></li>
                    <li style={{}}><div className="userdau-list-title">이메일</div></li>
                    <li style={{}}><div className="userdau-list-title">연락처</div></li>
                    <li style={{}}><div className="userdau-list-title">상태</div></li>
                </ul>
                {
                    blackList.map((item)=>{
                        return(
                            <ul>
                                <li style={{}}>{item.no}</li>
                                <li style={{}}>{item.id}</li>
                                <li style={{}}>{item.nickname}</li>
                                <li style={{}}>{item.email}</li>
                                <li style={{}}>010-0000-0000</li>
                                <li style={{}}>
                                    <select className="list-select-box" value={selectStatus[item.no] || item.status} onChange={(e) => handleStatusChange(e, item.no)}>
                                        <option value={item.status}>{item.status}</option>
                                        <option value="active">ACTIVE</option>
                                    </select>
                                </li>
                            </ul>
                        )
                    })
                }
            </div>

            {/* 페이징 */}
            <div className="paging-container">
                <button 
                    className="page-buttons" 
                    onClick={() => handlePageChange(page - 1)} 
                    style={{ visibility: page > 0 ? 'visible' : 'hidden' }} // 페이지가 0보다 클 때만 보이도록
                >
                    이전
                </button>

                {/* 페이지 번호 버튼 */}
                <div className="page-buttons">
                    {pageButtons()}
                </div>

                <button 
                    className="page-buttons" 
                    onClick={() => handlePageChange(page + 1)} 
                    style={{ visibility: page < totalPages - 1 ? 'visible' : 'hidden' }} // 페이지가 마지막 페이지가 아닐 때만 보이도록
                >
                    다음
                </button>
            </div>
        </div>
    )
}

export default BlackList;