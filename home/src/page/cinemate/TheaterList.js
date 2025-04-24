import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function TheaterList(){
    //영화관 목록, 현재 페이지, 총 페이지 수를 담을 변수
    const [theaterList, setTheaterList] = useState([]);
    const { page, setPage, totalPages, setTotalPages } = useOutletContext(); // 부모에서 전달된 상태들 가져오기


    useEffect(()=>{
        // const currentPageSize = getPageSize(window.innerWidth);

        //영화정보 가져오기
        axios.get(`http://localhost:9988/cinemate/theaters`)
        .then((response)=>{
            console.log("받아온 데이터", response.data);

            setTheaterList(response.data.content);
            // setTotalPages(response.data.totalPages);

        }).catch((error)=>{
            console.log("무비리스트 에러", error);
        });
    },[page]);





    return(
        <div className="container py-3">
            ddddd
        </div>
    )
}

export default TheaterList;