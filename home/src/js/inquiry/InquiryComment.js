import { useEffect, useState } from "react";
import apiNoAccessClient from "../public/axiosConfigNoAccess";
import { useParams } from "react-router-dom";

function InquiryComment() {
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');
    const param = useParams();
    

    function writeComment() {
        console.log(param)
        apiNoAccessClient.post('/inquiry/writeComment', {
            no: param.no,
            content: comment
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div className="comment-container">
            <h5>댓글 목록 :</h5><br/>
            {
                commentList && commentList.length>0 ? (
                <div className="comments">
                    
                </div>
                ) : (
                    <h5 style={{textAlign: 'center'}}>작성된 댓글이 없습니다.</h5>
                )
            }
            <br/>

            <label for="comment">내용 :</label>
            <textarea className="form-control" 
                    rows="5" 
                    id="comment" 
                    name="text"
                    onChange={(e) => {setComment(e.target.value);}}
            />
            <div style={{textAlign: 'right'}}>
                <button type="submit" 
                        class="btn btn-outline-primary"
                        onClick={writeComment}
                >
                    작성하기
                </button>
            </div>
        </div>
    );
}

export default InquiryComment;