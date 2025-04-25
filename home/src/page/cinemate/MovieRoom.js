import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import JoinedUsersBadgeModal from "./JoinedUsersModal";
import ChatBox from "./ChatBox"; // 채팅 컴포넌트를 분리해서 가져옵니다.
import '../../css/cinemate/MovieRoom.css';

const accessToken = sessionStorage.getItem("accessToken");
const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const myUserNo = userInfo?.userNo;

export default function MovieRoom() {
    const { no, movieNo } = useParams();
    const location = useLocation();
    const { movie } = location.state || {};
    const [isJoined, setIsJoined] = useState(false);
    const [joinedUsers, setJoinedUsers] = useState([]);
    const [showJoinedModal, setShowJoinedModal] = useState(false);
    const badgeRef = useRef(null);

    useEffect(() => {
        fetchMovieRoomJoinStatus();
    }, [no]);

    const fetchMovieRoomJoinStatus = async () => {
        const res = await axios.get(`http://localhost:9988/cinemate/movies/${movieNo}/room/${no}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        setIsJoined(res.data.result);
    };

    const fetchJoinedUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:9988/cinemate/movies/${movieNo}/room/${no}/members`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setJoinedUsers(res.data);
            setShowJoinedModal(true);
        } catch (error) {
            console.error("참여자 목록 불러오기 실패:", error);
        }
    };

    const handleCloseJoinedModal = () => setShowJoinedModal(false);

    const handleJoin = async () => {
        await axios.post(`http://localhost:9988/cinemate/movies/${movieNo}/room/${no}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        setIsJoined(true);
    };

    const handleCancel = async () => {
        await axios.delete(`http://localhost:9988/cinemate/movies/${movieNo}/room/${no}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        setIsJoined(false);
    };

    if (!movie) return <div>로딩 중...</div>;

    return (
        <div className="container my-4">
            <h2 className="mb-4">{movie.movieName}</h2>

            <div className="mb-3">
                <strong>작성자:</strong> {movie.userName} | <strong>작성일:</strong> {movie.createdAt?.split("T")[0]}
            </div>

            <div className="mb-2">
                <span className="badge bg-secondary p-2">모집 시간: {movie.meetingDate?.replace("T", " ").slice(0, 16)}</span>
            </div>

            <div className="mb-2" style={{ position: "relative", display: "inline-block" }}>
                <span
                    ref={badgeRef}
                    className="badge bg-warning text-dark p-2"
                    onClick={fetchJoinedUsers}
                >
                    총 인원: {movie.currentMemberCount} / {movie.maxMemberCount}
                </span>

                {showJoinedModal && (
                    <JoinedUsersBadgeModal
                        show={true}
                        onClose={handleCloseJoinedModal}
                        users={joinedUsers}
                    />
                )}
            </div>

            <div className="mb-4" style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <strong>{movie.content}</strong>
            </div>

            <div className="mb-4">
                {myUserNo !== movie.userNo && (
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
