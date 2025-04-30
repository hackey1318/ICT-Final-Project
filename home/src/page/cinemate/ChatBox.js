import { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "../../js/public/axiosConfig";

export default function ChatBox({ movieNo, roomNo }) {
    const accessToken = sessionStorage.getItem("accessToken");
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const myUserNo = userInfo.userNo;
    const [chats, setChats] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchChats();
    }, [roomNo]);

    const fetchChats = async () => {
        try {
            const response = await apiClient.get(`/cinemate/chat-room/${roomNo}`, );
            setChats(response.data);
        } catch (error) {
            console.error('채팅 목록 불러오기 실패:', error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            try {
                await apiClient.post(`/cinemate/chat-room/${roomNo}`, { message: newMessage },);
                fetchChats(); // 메시지 전송 후 채팅 목록 다시 불러오기
                setNewMessage('');
            } catch (error) {
                console.error('메시지 전송 실패:', error);
            }
        }
    };

    return (
        <div className="chat-box p-3 border rounded" style={{ minHeight: "200px" }}>
            <h5>소통 채팅창</h5>

            {/* 메시지 목록 */}
            <div className="chat-log mt-3">
                {chats.length === 0 ? (
                    <div className="text-muted">채팅이 없습니다.</div>
                ) : (
                    chats.map((msg, index) => {
                        
                        const isMine = msg.senderNo === myUserNo;
                        return (
                            <div key={index} className={`chat-message d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`message-box ${isMine ? 'my-message' : 'other-message'}`}>
                                    <span className="sender">{msg.nickName}</span>
                                    <div className="message-text">{msg.message}</div>
                                    <div className="timestamp">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* 입력창 */}
            <textarea
                className="form-control chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="메시지를 입력하세요..."
            />
            <button className="btn btn-primary mt-2" onClick={handleSendMessage}>전송</button>
        </div>
    );
}
