import { useEffect, useState } from "react";
import apiNoAccessClient from "../../js/public/axiosConfigNoAccess";
import { useNavigate } from "react-router-dom";
import '../../css/admin/InquiryReply.css';

function InquiryReply() {
    const [inquiryList, setInquiryList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getInquiryList();
    }, []);

    const getInquiryList = async () => {
        try {
            const listData = await apiNoAccessClient.get("/inquiry/getAllInquiry")
            setInquiryList(listData.data);
            console.log(listData.data);
        } catch(error) {
            console.log("error발생 : ", error);
        }
    }

    const inquiryReplyView = (no) => {
        navigate(`/manager/home/inquiry/${no}`);
    };

    return (
        <div id="inquiryreply-container">
            <h3>회원 문의 목록</h3>
            <ul style={{fontWeight: 'bold'}}>
                <li>번호</li>
                <li style={{cursor: 'auto'}}>제목</li>
                <li>작성자</li>
                <li>작성날짜</li>
                <li>진행사항</li>
                <li>상태</li>
            </ul>

            {
                inquiryList.map((item) => {
                    return (
                        <ul id="inquiryReplyList">
                            <li>{item.no}</li>
                            <li onClick={() => inquiryReplyView(item.no)}>{item.subject}</li>
                            <li>{item.nickname}</li>
                            <li>{new Date(item.createdAt).toLocaleDateString()}</li>
                            <li>{item.proceed}</li>
                            <li>{item.status}</li>
                        </ul>
                    )
                })
            }
        </div>
    );
}

export default InquiryReply;