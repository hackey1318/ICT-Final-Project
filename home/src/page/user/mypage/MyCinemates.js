import { useEffect, useState } from "react";
import apiClient from "../../../js/public/axiosConfig";
import Pagination from "../../../js/public/Pagination";
import '../../../css/cinemate/myCinemates.css';
import { useNavigate } from "react-router-dom";
import { handleUserLogout } from "../../../js/api/UserLogout";

const accessToken = sessionStorage.getItem("accessToken");

function MyCinemates(){
    const navigation = useNavigate();

    const userNo = JSON.parse(sessionStorage.getItem('userInfo'))?.userNo;
    
    const [cinemates, setCinemates] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(()=>{
        apiClient.get(`/cinemate/${userNo}/myCineMate?page=${currentPage}&size=${pageSize}`)
        .then((response)=>{
            console.log("시네메이트 목록", response.data);

            setCinemates(response.data.content);
            setTotalPages(response.data.totalPages);
        }).catch((error)=>{
            console.log(error);
            if (error.response.status === 423) {
                handleUserLogout();
            }
            setTotalPages(0);
        });
    },[currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleCinemateClick = (cinemate) => {
		if (accessToken !== null) {

            const movie = {
                movieNo: cinemate.movieNo,
                movieName: cinemate.movieName,
                userName: cinemate.userName,
                createdAt: cinemate.createdAt,
                meetingDate: cinemate.meetingDate,
                currentMemberCount: cinemate.currentMemberCount, //이거 추가함
                maxMemberCount: cinemate.maxMemberCount,
                content: cinemate.content,
                userNo: cinemate.userNo,
                postImage: cinemate.postImage,
            };

			navigation(`/cinemate/movies/${cinemate.movieNo}/room/${cinemate.no}`, { state: { movie } });
		} else {
			alert("로그인이 필요합니다.");
            navigation("/login");
		}
	}

    return(
        <div className="container">
            <h3>시네메이트 내역 조회</h3>
            <div className="cinemate-list-container">
                <table className="cinemate-list-table">
                    <thead>
                        <tr className="td-container">
                            <th>번호</th>
                            <th>만나는 날</th>
                            <th>영화관 이름</th>
                            <th>영화 이름</th>
                            <th>장르</th>
                            <th>감독</th>
                            <th>개봉일</th>
                            <th>모집자</th>
                            <th>인원</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cinemates.length > 0 ? (
                                cinemates.map((cinemate, index)=>{
                                return(
                                    <tr className="td-container">
                                        <td>{index+1}</td>
                                        <td>
                                            {cinemate.meetingDate?.split("T")[0]}{" "}
                                            {cinemate.meetingDate?.split("T")[1]?.slice(0, 5)}
                                        </td>
                                        <td><div onClick={()=>handleCinemateClick(cinemate)} style={{ cursor: "pointer" }}>{cinemate.theaterName}</div></td>
                                        <td><div onClick={()=>handleCinemateClick(cinemate)} style={{ cursor: "pointer" }}>{cinemate.movieName}</div></td>
                                        <td>{cinemate.genre}</td>
                                        <td>{cinemate.director}</td>
                                        <td>{cinemate.openDate}</td>
                                        <td>{cinemate.userName}</td>
                                        <td>{cinemate.currentMemberCount} / {cinemate.maxMemberCount}명</td>
                                    </tr>
                                )
                            })):(
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>시네메이트 내역이 없습니다.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* 페이징 */}
            <div className="paging-container">
                {currentPage > 0 && (
                    <button className="page-buttons" onClick={() => handlePageChange(currentPage - 1)}>
                        이전
                    </button>
                )}
                <div className="page-buttons">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={currentPage === i ? 'active' : ''}
                        >{i + 1}</button>
                    ))}
                </div>
                {currentPage < totalPages - 1 && (
                    <button className="page-buttons" onClick={() => handlePageChange(currentPage + 1)}>
                        다음
                    </button>
                )}
            </div>
        </div>
    )
}

export default MyCinemates;