import axios from "axios";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function TheaterListDetail(){
    //URL에서 theaterNo 파라미터 가져옴
    const { theaterNo } = useParams();  
    console.log(theaterNo);

    //영화관 상세 정보 담을 변수
    const [theaters, setTheaters] = useState([]);

    // 로딩 상태 추가
    const [loading, setLoading] = useState(true); 

    const [liked, setLiked] = useState(false); // 현재 좋아요 여부
    const [likeId, setLikeId] = useState(null); // 좋아요 ID (DB에서 받은 값)

    useEffect(()=>{
        axios.get(`http://localhost:9988/cinemate/theaterDetail/${theaterNo}`)
        .then((response)=>{
            console.log("시네메이트 영화관 정보", response.data);
            setTheaters(response.data);
            setLoading(false);  // 로딩 완료
        }).catch((error)=>{
            console.log("영화관 상세정보 에러",error);
            setLoading(false);  // 로딩 완료
        });

    },[theaterNo]);

    // 로딩 중이면 로딩 메시지 출력
    if (loading) {
        return <div>Loading...</div>;
    }

    // movie가 null인 경우 처리
    if (!theaters) {
        return <div>영화관 정보를 불러올 수 없습니다.</div>;
    }

    const toggleLike = async () => {
		try {
			const res = await axios.patch(`http://192.168.1.252:9988/likes/${likeId}`);
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

    return(
        <div className="movie_detail_container container">
            {/* 헤더 섹션 */}
			<header className="movie_detail_header">
				<div className="movie_detail_top_nav row">
					<div className="movie_detail_logo col-4">시네메이트 영화관 상세</div>
					<div className="movie_detail_menu col-8">
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
							<Heart
								className="movie_detail_icon"
								color={liked ? 'red' : 'black'}
								fill={liked ? 'red' : 'none'}
							/>
							<Share2 className="movie_detail_icon ms-2" onClick={handleCopyUrl} />
						</div>
					</div>
				</div>
			</header>

            {/* 해당 영화관에 관련된 시네메이트 신청 정보 */}
            <div className="row">
                {
                    theaters.map((theater, index)=>{
                        return(
                            <div key={index} className="col-md-4 col-lg-3 mb-4">
                                <div className="card shadow-sm border-light">
                                    {/* 영화 포스터 이미지 */}
                                    <img
                                        src={theater.postImage || "/placeholder.jpg"} // placeholder 이미지는 public 폴더 등에 위치해야 함
                                        alt={`${theater.movieName} 포스터`}
                                        className="card-img-top rounded-3"
                                        style={{ height: "250px", objectFit: "cover" }} // 이미지 크기 및 스타일 지정
                                    />
                                    <div className="card-body bg-light"> {/* 배경색 변경 */}
                                        {/* 영화 제목 */}
                                        <h5 className="card-title text-dark text-truncate">{theater.movieName}</h5> {/* 텍스트 색상 변경 */}
                                        
                                        {/* 장르 및 감독 */}
                                        <p className="card-text text-muted">{theater.genre} | 감독: {theater.director}</p>
                                        
                                        {/* 미팅 날짜 및 시간 */}
                                        <p className="card-text text-dark">
                                            <strong>날짜:</strong> {theater.meetingDate?.split('T')[0]} <br />
                                            <strong>시간:</strong> {theater.meetingDate?.split('T')[1]?.slice(0,5)}
                                        </p>

                                        {/* 닉네임 */}
                                        <p className="card-text text-dark"><strong>작성자:</strong> {theater.userName}</p>

                                        {/* 시네메이트 내용 */}
                                        <p className="card-text text-dark">{theater.content ? `"${theater.content}"` : "상세 내용 없음"}</p>

                                        {/* 총 인원 */}
                                        <p className="card-text text-dark">
                                            <strong>총인원:</strong> 현재인원/{theater.maxMemberCount}
                                        </p>

                                        {/* 카드 하단에 버튼 (선택적) */}
                                        <div className="d-flex justify-content-between">
                                            {/* <button className="btn btn-primary btn-sm">자세히 보기</button> */}
                                            <button className="btn btn-outline-primary btn-sm">신청하기</button>
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