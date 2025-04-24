import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const accessToken = sessionStorage.getItem("accessToken");

export default function MovieRoom() {

    const { no, movieNo } = useParams();
    const location = useLocation();
    const { movie } = location.state || {};
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        fetchMovieRoomJoinStatus();
    }, []);

    const fetchMovieRoomJoinStatus  = async () => {
        const res = await axios.get(`http://localhost:9988/cinemate/movies/${movieNo}/room/${no}`,{
            headers : {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        setIsJoined(res.data.result); // API에서 참여 여부도 함께 내려준다고 가정
    };

    const handleJoin = async () => {
        await axios.post(`http://localhost:9988/cinemate/movies/${movieNo}/room/${no}`, {}, {
            headers : {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });
        setIsJoined(true);
    };

    const handleCancel = async () => {
        await axios.delete(`http://localhost:9988/cinemate/movies/${movieNo}/room/${no}`, {
            headers : {
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

            <div className="mb-2">
                <span className="badge bg-warning text-dark p-2">
                    총 인원: {movie.currentMemberCount} / {movie.maxMemberCount}
                </span>
            </div>

            <div className="mb-4" style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <strong>{movie.content}</strong>
            </div>

            <div className="mb-4">
                {isJoined ? (
                    <input type="button" value="참여 취소" onClick={handleCancel} />
                ) : (
                    <input type="button" value="참여하기" onClick={handleJoin} />
                )}
            </div>

            {isJoined && (
                <div className="chat-box p-3 border rounded" style={{ minHeight: "200px", backgroundColor: "#fff" }}>
                    <h5>소통 채팅창</h5>
                    {/* 채팅 메시지 목록 + 입력창 구현 */}
                    <div className="chat-log mt-3">[채팅 메시지 목록]</div>
                </div>
            )}
        </div>
    );
}