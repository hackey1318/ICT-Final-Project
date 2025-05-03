import axios from "axios";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";
import apiClient from "../../js/public/axiosConfig";
import KakaoMap from "../../js/api/KakaoMap";

const accessToken = sessionStorage.getItem("accessToken");

function TheaterListDetail() {
    const navigation = useNavigate();

    //URL에서 theaterNo 파라미터 가져옴
    const { theaterNo } = useParams();
    console.log(theaterNo);

    //영화관 상세 정보 담을 변수
    const [theaters, setTheaters] = useState([]);

    // 로딩 상태 추가
    const [loading, setLoading] = useState(true);

    const [liked, setLiked] = useState(false); // 현재 좋아요 여부
    const [likeId, setLikeId] = useState(null); // 좋아요 ID (DB에서 받은 값)

    // 연령 등급 배지의 색상을 결정합니다.
    function getAgeBadgeColor(grade) {
        switch (String(grade)) { // 등급이 문자열로 처리되도록 보장
            case "15": return "#f39c12";  // 주황
            case "12": return "#3498db";  // 파랑
            case "All": return "#2ecc71"; // 초록
            case "18": return "#e74c3c"; // 빨강
            default: return "#7f8c8d";     // 회색
        }
    }

    useEffect(()=>{
        apiNoAccessClient.get(`/cinemate/theaterDetail/${theaterNo}`)
        .then((response)=>{
            console.log("시네메이트 영화관 정보", response.data);
            setTheaters(response.data);
            setLoading(false);  // 로딩 완료
        }).catch((error)=>{
            console.log("영화관 상세정보 에러",error);
            setLoading(false);  // 로딩 완료
        });

    }, [theaterNo]);

    // 로딩 중이면 로딩 메시지 출력
    if (loading) {
        return <div>Loading...</div>;
    }

    // movie가 null인 경우 처리
    if (!theaters) {
        return <div>영화관 정보를 불러올 수 없습니다.</div>;
    }

    const handleCardClick = (theater) => {

        if (accessToken !== null) {
            navigation(`/cinemate/movies/${theater.movieNo}/room/${theater.no}`, { state: { theater } });
        } else {
            alert("로그인이 필요합니다.");
            navigation("/login");
        }
    }

    const toggleLike = async () => {
		try {
			const res = await apiClient.patch(`/likes/${likeId}`);
			const likeData = res.data;
			// 예: 좋아요 상태가 ACTIVE인지 여부에 따라 아이콘을 채우거나 비우기
			if (likeData.status === "ACTIVE") {
				setLiked(true);
			} else {
				setLiked(false);
			}
		} catch (err) {
			console.error("좋아요 처리 중 오류:", err);
		}
	};

    const handleCopyUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('링크가 클립보드에 복사되었습니다!');
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
            });
    };

    const theater = theaters[0];

    return (
        <div className="movie_detail_container container">
            {/* 헤더 섹션 */}
            <header className="movie_detail_header">
                <div className="movie_detail_top_nav row">
                    <div className="movie_detail_logo col-8">시네메이트 영화관 상세 : {theaters[0].theaterName}</div>
                    <div className="movie_detail_menu col-4">
                        {/* 필요한 메뉴 항목 추가 */}
                    </div>
                </div>
                <div className="movie_detail_sub_header row align-items-center">
                    <div className="col-1">
                        {/* 뒤로가기 버튼 (시네메이트 목록 페이지로 이동한다고 가정) */}
                        <Link to="/cinemate/theaters" className="movie_detail_back_btn">
                            <ArrowLeft className="movie_detail_icon" />
                        </Link>
                    </div>
                    <div className="col-9">
                        {/* 백엔드에서 받은 영화 제목 표시 */}
                        {/* <h1 className="movie_detail_title">{movies[0].name}</h1> */}
                    </div>
                    <div className="movie_detail_actions col-2 d-flex justify-content-end">
                        {/* 북마크 및 공유 아이콘 (기능 구현 필요) */}
                        <div onClick={toggleLike} style={{ cursor: 'pointer' }}>
                            {/* <Heart
								className="movie_detail_icon"
								color={liked ? 'red' : 'black'}
								fill={liked ? 'red' : 'none'}
							/> */}
                            <Share2 className="movie_detail_icon ms-2" onClick={handleCopyUrl} />
                        </div>
                    </div>
                </div>
            </header>

            {/* 해당 영화관에 관련된 시네메이트 신청 정보 */}
            <div className="row">
                <div style={{textAlign:'center', width:'60%', margin:'0 auto 20px'}}>
                    <label style={{fontSize:'1.5em', fontWeight:'bold'}}>{theater.theaterName}</label>
                    <KakaoMap
                        theaterName={theater.theaterName}
                        latitude={theater.latitude}
                        longitude={theater.longitude}
                    />
                </div>
                {
                    theaters.map((theater, index) => {
                        return (
                            <div key={index} className="col-12 col-md-6 mb-3">
                                <div onClick={() => handleCardClick(theater)} className="position-relative"
                                    style={{
                                        display: "flex", flexDirection: "row", height: "260px", backgroundColor: "#f9f9f9",
                                        padding: "12px", cursor: "pointer", borderRadius: "6px"
                                    }}
                                >
                                    {/* 연령 등급 배지 */}
                                    <span
                                        className="age-badge position-absolute start-10 m-2 px-2 py-1 text-white rounded shadow-sm"
                                        style={{ backgroundColor: getAgeBadgeColor(theater.ageGrade), zIndex: 2, top: "15px" }}
                                    >
                                        {/* 18세 등급은 '청불' 또는 '19'로 표시, 나머지는 등급 그대로 표시 */}
                                        {String(theater.ageGrade) === "18" ? "청불" : theater.ageGrade}
                                    </span>

                                    {/* 왼쪽 이미지 */}
                                    <div style={{ height: "100%", marginRight: "20px", display: "flex", alignItems: "center" }}>
                                        <img src={theater.postImage || "/placeholder.jpg"} alt={`${theater.movieName} 포스터`}
                                            style={{ height: "100%", width: "auto", maxWidth: "160px", objectFit: "contain", borderRadius: "10px" }} />
                                    </div>

                                    {/* 오른쪽 정보 */}
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="fw-bold">작성자 : {theater.userName}</span>
                                                <span className="text-muted">작성일 : {theater.createdAt?.split('T')[0]}</span>
                                            </div>
                                            <div className="mb-2">
                                                <div style={{
                                                    backgroundColor: "#e9f5ff", borderRadius: "8px", padding: "12px",
                                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column", gap: "8px"
                                                }}
                                                >
                                                    {/* 상영 영화 제목 */}
                                                    <span className="fw-bold" style={{ fontSize: "16px", color: "#007bff", fontWeight: "500", lineHeight: "1.4" }}>
                                                        🎥 {theater.movieName}
                                                    </span>

                                                    {/* 장르 및 감독 정보 */}
                                                    <div style={{ fontSize: "14px", color: "#555", fontWeight: "normal" }}>
                                                        <span style={{ fontWeight: "500" }}>{theater.genre}</span> | <span>{theater.director}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-2 d-flex justify-content-between">
                                                <span className="badge bg-light text-dark p-2 border border-secondary rounded">
                                                    모집 시간 : {theater.meetingDate?.split("T")[0]}{" "}
                                                    {theater.meetingDate?.split("T")[1]?.slice(0, 5)}
                                                </span>
                                                <span className="badge bg-warning text-dark p-2 rounded">
                                                    총 인원 : {theater.currentMemberCount} / {theater.maxMemberCount}
                                                </span>
                                            </div>
                                            <div style={{ height: "80px", fontSize: "14px", backgroundColor: "#fff", padding: "6px", borderRadius: "4px" }}>
                                                {theater.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TheaterListDetail;