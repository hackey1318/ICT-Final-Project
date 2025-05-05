import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import JoinedUsersBadgeModal from "./JoinedUsersModal";
import ChatBox from "./ChatBox"; // 채팅 컴포넌트를 분리해서 가져옵니다.
import '../../css/cinemate/MovieRoom.css';
import apiClient from "../../js/public/axiosConfig";
import KakaoMap from "../../js/api/KakaoMap";

const accessToken = sessionStorage.getItem("accessToken");
const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const myUserNo = userInfo?.userNo;

export default function MovieRoom() {
    const { no, movieNo } = useParams();
    const location = useLocation();
    const { movie } = location.state || {};
    const { theater } = location.state || {};
    const [isJoined, setIsJoined] = useState(false);
    const [participantCount, setParticipantCount] = useState(0);
    const [joinedUsers, setJoinedUsers] = useState([]);
    const [showJoinedModal, setShowJoinedModal] = useState(false);
    const badgeRef = useRef(null);

    useEffect(() => {
        fetctParticipantCount();
        fetchMovieRoomJoinStatus();
    }, [no, isJoined]);

    const fetctParticipantCount = async () => {
        const res = await apiClient.get(`/cinemate/movies/${movieNo}/room/${no}/members/count`,);
        setParticipantCount(res.data)

    }

    const fetchMovieRoomJoinStatus = async () => {
        const res = await apiClient.get(`/cinemate/movies/${movieNo}/room/${no}`, );
        setIsJoined(res.data.result);
    };

    const fetchJoinedUsers = async () => {
        try {
            const res = await apiClient.get(`/cinemate/movies/${movieNo}/room/${no}/members`, );

            setJoinedUsers(res.data);
            setShowJoinedModal(true);
        } catch (error) {
            console.error("참여자 목록 불러오기 실패:", error);
        }
    };

    const handleCloseJoinedModal = () => setShowJoinedModal(false);

    const handleJoin = async () => {
        //최대 인원수 체크
        if(participantCount  >= (movie ? movie.maxMemberCount : theater.maxMemberCount)){
            alert("최대 인원수 초과입니다.");
            return;
        }

        try{
            await apiClient.post(`/cinemate/movies/${movieNo}/room/${no}`, {}, );
            setIsJoined(true);
            fetctParticipantCount();
        }catch(error){
            alert("참여 중 오류 발생");
        }
    };

    const handleCancel = async () => {
        await apiClient.delete(`/cinemate/movies/${movieNo}/room/${no}`, );
        setIsJoined(false);
    };

    if (!movie && !theater) return <div>로딩 중...</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">{movie ? movie.movieName : theater.movieName}</h2>

            <div style={{display:'flex'}}>
                <div style={{width:'50%'}}>
                    <div className="mb-3">
                        <strong>작성자:</strong> {movie? movie.userName : theater.userName} | <strong>작성일:</strong> {movie? movie.createdAt?.split("T")[0] : theater.createdAt?.split("T")[0]}
                    </div>

                    <div className="mb-2">
                        <span className="badge bg-secondary p-2">모집 시간: {movie? movie.meetingDate?.replace("T", " ").slice(0, 16) : theater.meetingDate?.replace("T", " ").slice(0, 16)}</span>
                    </div>

                    <div className="mb-2" style={{ position: "relative", display: "inline-block" }}>
                        <span
                            ref={badgeRef}
                            className="badge bg-warning text-dark p-2"
                            onClick={fetchJoinedUsers}
                        >
                            총 인원: {participantCount} / {movie? movie.maxMemberCount : theater.maxMemberCount}
                        </span>

                        {showJoinedModal && (
                            <JoinedUsersBadgeModal
                                show={true}
                                onClose={handleCloseJoinedModal}
                                users={joinedUsers}
                            />
                        )}
                    </div>

                    <div className="mb-3">
                        <img src={movie? movie.postImage : theater.postImage} alt="Movie Poster" className="img-fluid" style={{ maxWidth: "300px", borderRadius: "8px" }} />
                    </div>
                </div>

                <div style={{width:'50%', textAlign:'center'}}>
                    <label>모집장소 : <span style={{fontSize:'1.3em', fontWeight:'bold'}}>{movie ? movie.theaterName : theater.theaterName}</span></label>
                    <KakaoMap
                        theaterName={movie ? movie.theaterName : theater.theaterName}
                        latitude={movie ? movie.latitude : theater.latitude}
                        longitude={movie ? movie.longitude : theater.longitude}
                        height="320px"
                    />
                </div>
            </div>

            <div className="mb-4" style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <strong>{movie? movie.content : theater.content}</strong>
            </div>

            <div className="mb-4">
                {myUserNo !== (movie? movie.userNo : theater.userNo) && (
                    isJoined ? (
                        <input type="button" value="참여 취소" onClick={handleCancel} />
                    ) : (
                        <input type="button" value="참여하기" onClick={handleJoin} />
                    )
                )}
            </div>

            {isJoined && <ChatBox movieNo={movieNo} roomNo={no} />}
        </div>
    );
}
