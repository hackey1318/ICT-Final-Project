import { useState } from "react"
import "../../css/movie/RecruitMovie.css" 

export default function RecruitMovieModal({ movie, closeModal }) {
    const [theater, setTheater] = useState("")
    const [date, setDate] = useState("")
    const [content, setContent] = useState("")

    const handleSubmit = () => {
        if (!theater || !date || !content) {
            alert("모든 항목을 입력해주세요.")
            return
        }

        // 모집글 등록 처리
        console.log({ movieNo: movie.no, theater, date, content })
        alert("모집이 등록되었습니다!")
        closeModal()
    }

    return (
        <div className="md_modal-overlay">
            <div className="md_modal-wrapper" style={{ maxWidth: "800px" }}>
                <div className="md_modal-content">
                    <div className="md_modal-header">
                        <h2 className="md_modal-title">같이 볼 사람 구하기</h2>
                        <button className="md_close-btn" onClick={closeModal}>
                            &times;
                        </button>
                    </div>

                    <div className="md_modal-body md_flex-row">
                        {/* 왼쪽: 입력 폼 */}
                        <div className="md_modal-left" style={{ flex: 2, paddingRight: "1.5rem" }}>
                            <p><strong>영화명:</strong> {movie.name}</p>

                            <div className="md_form-group">
                                <label>영화관</label>
                                <input
                                    type="text"
                                    className="md_form-input"
                                    value={theater}
                                    onChange={(e) => setTheater(e.target.value)}
                                />
                            </div>

                            <div className="md_form-group">
                                <label>날짜</label>
                                <input
                                    type="date"
                                    className="md_form-input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="md_form-group">
                                <label>모집 내용</label>
                                <textarea
                                    className="md_form-input"
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 오른쪽: 영화 포스터 */}
                        <div className="md_modal-right" style={{ flex: 1 }}>
                            <img
                                src={movie.postImage}
                                alt={movie.name}
                                style={{ width: "100%", borderRadius: "8px" }}
                            />
                        </div>
                    </div>

                    <div className="md_modal-footer">
                        <button className="md_register-btn" onClick={handleSubmit}>등록</button>
                        <button className="md_cancel-btn" onClick={closeModal}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
