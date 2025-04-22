import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../css/admin/InquiryReply.css';
import apiClient from "../../js/public/axiosConfig";

function InquiryReply() {
    const [inquiryList, setInquiryList] = useState([]);
    const navigate = useNavigate();
    const [updateStatus, setUpdateStatus] = useState({});

    useEffect(() => {
        getInquiryList();
    }, []);

    const getInquiryList = useCallback( async () => {
        try {
            const listData = await apiClient.get("/inquiry/getAllInquiry")
            setInquiryList(listData.data || []);
            console.log(listData.data);
        } catch(error) {
            console.log("error발생 : ", error);
            setInquiryList([]);
        }
    }, []);

    useEffect(() => {
        getInquiryList();
    }, [getInquiryList]);

    const handleStatusChangeInList = async (event, inquiryNo) => {
        const newStatus = event.target.value;
        const statusMap = { BEFORE: '처리 전', PROCEEDING: '처리 중', CLOSED: '처리 완료' };
        const confirmMessage = `문의 #${inquiryNo}의 상태를 '${statusMap[newStatus] || newStatus}'(으)로 변경하시겠습니까?`;

        if (!window.confirm(confirmMessage)) {
            event.target.value = currentStatus; 
            return;
        }
        setUpdateStatus(prevMap => ({ ...prevMap, [inquiryNo]: true }));

        if (response.data?.result === true) {
            setInquiryList(prevList =>
                prevList.map(item =>
                    item.no === inquiryNo
                        ? { ...item, proceed: newStatus, proceedDescription: response.data.proceedDescription }
                        : item
                )
            );
        } else {
                alert(response.data?.message || "상태 변경에 실패했습니다.");
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
                <li>진행상황</li>
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
                            <li>
                                <select
                                    className="form-select form-select-sm"
                                    value={item.proceed || ''}
                                    onChange={(e) => handleStatusChangeInList(e, item.no)}
                                    style={{ minWidth: '100px' }}
                                >
                                    <option value="BEFORE">처리 전</option>
                                    <option value="PROCEEDING">처리 중</option>
                                    <option value="CLOSED">처리 완료</option>
                                </select>
                            </li>
                            <li>{item.status}</li>
                        </ul>
                    )
                })
            }
        </div>
    );
}

export default InquiryReply;