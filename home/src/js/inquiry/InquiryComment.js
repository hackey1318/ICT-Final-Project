import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../public/axiosConfig";

function InquiryComment() {
    const [isLoading, setIsLoading] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const param = useParams();
    const commentsEndRef = useRef(null);  //스크롤
    const textareaRef = useRef(null);  //댓글 작성 후 다시 댓글창에 포커스
    const [loginUserNo, setLoginUserNo] = useState(null);
    const userInfoString = sessionStorage.getItem("userInfo");

    const scrollToBottom = () => {
        const scrollContainer = commentsEndRef.current;
        if(scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    const fetchComment = useCallback(async() => {
        if(!param.no || isNaN(parseInt(param.no))) {
            console.log("유효하지않은 문의번호");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        
        try {
            const response = await apiClient.get(`/inquiry/${param.no}/getComments`);
            setCommentList(response.data || []);
        } catch(err) {
            console.error("댓글로딩실패 : ", err);
            setCommentList([]);
        } finally {
            setIsLoading(false);
        }
    }, [param.no]);

    useEffect(() => {
        fetchComment();
    }, [fetchComment]);

    useEffect(() => {
        scrollToBottom();
    }, [commentList]);

    useEffect(() => {
        const userInfoString = sessionStorage.getItem("userInfo"); // 1. sessionStorage에서 "userInfo" 키로 값을 가져옴
        if (userInfoString) { // 2. 값이 존재하면
            try {
                const userInfo = JSON.parse(userInfoString); // 3. JSON 문자열을 객체로 파싱
                // --- sessionStorage 값 확인 ---
                console.log("sessionStorage에서 읽은 userInfo:", userInfo);
                if (userInfo && userInfo.userNo !== undefined) { // 4. 파싱된 객체와 그 안의 userNo 필드 확인
                   setLoginUserNo(userInfo.userNo); // 5. 상태 업데이트
                   console.log("loginUserNo 상태 설정됨:", userInfo.userNo);
                } else {
                   console.warn("sessionStorage userInfo 객체에 userNo 필드가 없습니다.");
                   setLoginUserNo(null);
                }
            } catch (error) { // 3-1. JSON 파싱 실패 시
                console.error("sessionStorage 사용자 정보 파싱 오류:", error);
                 setLoginUserNo(null);
            }
        } else { // 2-1. sessionStorage에 값이 없으면
             console.warn("sessionStorage에 userInfo가 없습니다.");
             setLoginUserNo(null);
        }
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    function writeComment(e) {
        e.preventDefault();

        if(!comment.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        apiClient.post(`/inquiry/${param.no}/writeComment`, {
            inquiryNo: parseInt(param.no),
            content: comment
        })

        .then(response => {
            console.log(response.data);
            if(response.data?.result == true) {
            setComment('');
            fetchComment();
            textareaRef.current?.focus();
            } else {
                alert("댓글작성실패");
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div className="comment-container">
            <h5>댓글 목록 :</h5><br/>                
            <div className="comments" ref={commentsEndRef}>
            {   
                !isLoading && commentList && commentList.length>0 ? (
                    commentList.map((cmt) => {
                        const isMyComment = loginUserNo != null && cmt.userNo != null &&
                                            parseInt(cmt.userNo) === parseInt(loginUserNo);
                        const commentAlignClass = isMyComment ? 'my-comment' : 'other-comment';

                        return (
                            <div key={cmt.no} className={`comment-item ${commentAlignClass}`}>
                                <div style={{minWidth: '20%'}}>
                                { !isMyComment && (
                                    <div className="comment-author"><strong>{cmt.nickname}</strong></div>)}
                                    <div className="comment-timestamp" style={{fontSize: '0.8em', color: '#777'}}>{cmt.createdAt}</div>
                                    <div className="comment-bubble">{cmt.content}</div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !isLoading &&
                    <h5 style={{textAlign: 'center', marginTop: '35px'}}>작성된 댓글이 없습니다.</h5>
                )
            }
        </div>
        <br/>
            <div style={{width: '90%', margin: '0 auto'}}>
                <label htmlFor="comment">내용 :</label>
                <textarea className="form-control" 
                        rows="5" 
                        id="comment" 
                        name="text"
                        value={comment}
                        ref={textareaRef}
                        onChange={(e) => {setComment(e.target.value);}}
                />
                <div style={{textAlign: 'right'}}>
                    <button type="submit" 
                            className="btn btn-outline-primary"
                            onClick={writeComment}
                    >
                        작성하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InquiryComment;