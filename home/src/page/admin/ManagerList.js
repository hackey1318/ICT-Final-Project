import axios from "axios";
import { useEffect, useState } from "react";
const accessToken = sessionStorage.getItem("accessToken");

function ManagerList(){
    //데이터 담을 변수
    const [managerList, setManagerList] = useState([]);

    //페이징 관련 변수
    const [page, setPage] = useState(0); //현재페이지
    const [totalPages, setTotalPages] = useState(0); //전체 페이지수

    //관리자권한 선택 상태
    const [selectStates, setSelectStates] = useState({}); 

    useEffect(()=>{
        axios.get(`http://localhost:9988/manager/home/manager-list?page=${page}&size=10`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response)=>{
            const data = response.data.content;

            setManagerList(response.data.content);
            setTotalPages(response.data.totalPages);

            //선택 상태 초기화
            const initialStates = {};
            data.forEach(item => {
                initialStates[item.no] = item.role;
            });
            setSelectStates(initialStates);
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

    //관리자 권한 변경시 실행됨
    const handleRoleChange = (e, userNo)=>{
        const selectedValue = e.target.value;

        if(selectedValue === "delete"){
            const isConfirmed = window.confirm(`MANAGER ${userNo}번을 삭제하시겠습니까?\n'확인'을 누르시면 관리자권한이 없어지고, 목록에서 삭제됩니다.`);

            if(isConfirmed){ //관리자 삭제 -> 비활성화
                axios.post(`http://localhost:9988/manager/home/manager-delete/${userNo}`)
                .then((response)=>{
                    //관리자 삭제후 다시 목록 요청해서 갱신
                    axios.get(`http://localhost:9988/manager/home/manager-list?page=${page}&size=10`)
                    .then((response)=>{
                        //매니저리스트, 전체페이지수 셋팅
                        setManagerList(response.data.content);
                        setTotalPages(response.data.totalPages);
                        alert(`${userNo}번 관리자가 삭제되었습니다.`);
                    }).catch((error)=>{
                        console.log(error);
                    });
                }).catch((error)=>{
                    console.log(error);
                });
            }
        }
        
    }

    return(
        <div className='userdau-wrap'>
            <h3>Admin Page - Manager List</h3>

            <div className='userdau-list'>
                <ul>
                    <li><div className="userdau-list-title">관리자번호</div></li>
                    <li><div className="userdau-list-title">관리자아이디</div></li>
                    <li><div className="userdau-list-title">관리자닉네임</div></li>
                    <li><div className="userdau-list-title">이메일</div></li>
                    <li><div className="userdau-list-title">연락처</div></li>
                    <li><div className="userdau-list-title">관리자권한</div></li>
                </ul>

                {
                    managerList.map((item)=>{
                        return(
                            <ul className="list-content-ul">
                                <li>{item.no}</li>
                                <li>{item.id}</li>
                                <li>{item.nickname}</li>
                                <li>{item.email}</li>
                                <li>010-0000-0000</li>
                                <li>
                                    {
                                        item.role === "ADMIN" ? (
                                            <>{item.role}</>
                                        ):(
                                            <select className="list-select-box" value={selectStates[item.no] || item.role} onChange={(e) => handleRoleChange(e, item.no)}>
                                                <option value={item.role}>{item.role}</option>
                                                <option value="delete">DELETE</option>
                                            </select>
                                        )
                                    }
                                </li>
                            </ul>
                        )
                    })
                }

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
        </div>
    )
}

export default ManagerList;