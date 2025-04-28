import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import screen from '../../img/screen.jpg';

function TheaterList(){
    //영화관 목록 담을 변수
    const [theaterList, setTheaterList] = useState([]);
    const { page, setPage, totalPages, setTotalPages } = useOutletContext(); // 부모에서 전달된 상태들 가져오기

    // 창 너비에 따라 페이지당 영화 수를 결정합니다.
    function getPageSize(width) {
        if (width < 576) return 4;     // 모바일
        if (width < 768) return 6;     // 태블릿
        if (width < 992) return 9;     // 작은 데스크탑
        return 12;                     // 기본 데스크탑, 큰 화면
    }

    // 페이지 번호가 변경될 때 맨 위로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    useEffect(()=>{
        const currentPageSize = getPageSize(window.innerWidth);

        axios.get(`/cinemate/theaters?page=${page}`,{
            params: {
                page: page,
                size: currentPageSize,
                // sort: 'createdAt,desc', // 정렬 유지 (원하는 경우), 필요시 조정
            },
        })
        .then((response)=>{
            console.log("영화관 목록",response.data.content);
            setTheaterList(response.data.content);
            setTotalPages(response.data.totalPages);
        }).catch((error)=>{
            console.log("영화관 목록 에러",error);
        });
    },[page]);

    return(
        <div className="container py-3">
            {/* 영화관 리스트 */}
            <div className="row g-4">
                {theaterList.length > 0 ? (
                    theaterList.map((theater)=>{
                        return(
                            <div key={theater.theaterNo} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                                <a href={`/cinemate/theaters/${theater.theaterNo}`} className="text-decoration-none text-dark">
                                    <div className="card shadow-sm" style={{height:"180px", background: `url(${screen}) center/cover no-repeat`, borderRadius: "10px"}}>
                                        <div className="card-body">
                                            <h5 className="card-title" style={{textAlign:"center", marginTop:"30px", color: "#fff"}}>{theater.theaterName}</h5>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        )
                    })
                ):(
                    //보여줄 목록이 없을 경우 메시지 표시
                    <div className="col-12 text-center mt-5">
                        <p className="text-muted">현재 시네메이트 관련 영화관이 없습니다.</p>
                    </div>
                )} 
            </div>
        </div>
    )
}

export default TheaterList;