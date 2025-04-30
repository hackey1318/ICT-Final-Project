import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import InquiryImageModal from "../../js/inquiry/InquiryImageModal";
import InquiryComment from "../../js/inquiry/InquiryComment";
import apiClient from "../../js/public/axiosConfig";
import apiNoAccessClient from './../../js/public/axiosConfigNoAccess';

function InquiryReplyView() {
    const {no} = useParams();
    const IMAGE_BASE_URL = `${apiNoAccessClient.defaults.baseURL}/file-system/showImage/`;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [isUpdateStatus, setIsUpdateStatus] = useState(false);
    const [writerUserNo, setWriterUserNo] = useState(null);

    let [inquiryVO, setInquiryVO] = useState({
        no: null,
        nickname: '',
        subject: '',
        content: '',
        imageList: [],
        createdAt: '',
        userNo: null,
        writedate: '',
        role: '',
        proceed: '',
        status: ''
    });
    const isDeleted = inquiryVO.status === 'DELETE';

    //딤처리
    const DimmedOverlay = styled.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 5;
        `;
    
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            getInquiryView();  // 여기에 위치
        }
    }, []);

    const getInquiryView = useCallback(() => {
        apiClient.get(`inquiry/getInquiryBy/${no}`)
        .then(function(response) {
            setInquiryVO({
                no: response.data.inquiry.no,
                nickname: response.data.inquiry.nickname  || 'User Unknowned',
                subject: response.data.inquiry.subject,
                content: response.data.inquiry.content,
                createdAt: response.data.inquiry.createdAt,
                imageList: response.data.image_list,
                userNo: response.data.inquiry.userNo,
                proceed: response.data.inquiry.proceed,
                status: response.data.inquiry.status,
                role: response.data.inquiry.role
            });
            console.log(inquiryVO)
        })
        .catch(function(error) {
            console.log(error);
        })
    }, [no]);

    useEffect(() => {
        if (inquiryVO.userNo) {
            setWriterUserNo(inquiryVO.userNo);
            console.log("Writer User No has been set:", inquiryVO.userNo);
        }
    }, [inquiryVO]);

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        const currentProceed = inquiryVO.proceed;
        const statusMap = {BEFORE:'처리 전', PROCEEDING: '처리 중', CLOSED: '처리 완료'};
        const confirmMessage = `문의상태를 ${statusMap[newStatus] || newStatus}(으)로 변경하시겠습니까?`;

        if(!window.confirm(confirmMessage)) {
            event.target.value = currentProceed;
            return;
        }
        setIsUpdateStatus(true);

        apiClient.patch(`/inquiry/${inquiryVO.no}/proceedStatus`, {
            proceed: newStatus
        })
        .then(response => {
            if(response.data?.result === true) {
                alert("문의 상태가 성공적으로 변경되었습니다.");
                setInquiryVO(prev => ({
                    ...prev, proceed: newStatus
                }));
            } else {
                alert("상태 변경에 실패하였습니다.");
                event.target.value = inquiryVO.proceed;
            }
        })
        .catch(error => {
            console.error("상태 변경 API 오류:", error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || "상태 변경 중 오류가 발생했습니다.");
            event.target.value = inquiryVO.proceed;
        })
        .finally(() => {
            setIsUpdateStatus(false);
        });
    };
    
    const handleImageClick = useCallback((index) => {
        if(inquiryVO.imageList && index>=0 && index<inquiryVO.imageList.length) {
            setSelectedImageIdx(index);
            setIsModalOpen(true);
        }
    }, [inquiryVO.imageList]);

    const closeModal = useCallback(() => {
            setIsModalOpen(false);
        }, []);

    return (
        <div className='inquiry-container'>
            <div style={{display:'flex', justifyContent: 'space-between'}}>
                <h2>{inquiryVO.subject}</h2>
                {
                        <div>
                            <label htmlFor="inquiryStatus" style={{ margin: '0 5px 5px 0' }}>상태:</label>
                            <select
                                id="inquiryStatus"
                                className="form-select form-select-sm" 
                                value={isDeleted ? 'CLOSED' : (inquiryVO.proceed || '')} 
                                onChange={handleStatusChange} 
                                disabled={isDeleted || isUpdateStatus} 
                                style={{ width: '150px',
                                         backgroundColor: isDeleted ? '#e9ecef' : '',
                                         cursor: isDeleted ? 'not-allowed' : 'pointer' }} 
                            >
                                <option value="BEFORE">처리 전</option>
                                <option value="PROCEEDING">처리 중</option>
                                <option value="CLOSED">처리 완료</option>
                            </select>
                        </div>
                }
            </div>

            <div className="row" style={{borderBottom: '1px solid #ddd'}}>
                <div className="col-sm-2 p-2">글번호</div>
                <div className="col-sm-10 p-2">{inquiryVO.no}</div>
            </div>

            <div className="row" style={{borderBottom: '1px solid #ddd'}}>
                <div className="col-sm-2 p-2">글쓴이</div>
                <div className="col-sm-10 p-2">{inquiryVO.nickname}</div>
            </div>

            <div className="row" style={{borderBottom: '1px solid #ddd'}}>
                <div className="col-sm-2 p-2">등록일</div>
                <div className="col-sm-10 p-2">{new Date(inquiryVO.createdAt).toLocaleString('ko-KO')}</div>
            </div>

            <div className="row" style={{borderBottom: 'none',marginTop: '10px'}}>
                <div className="col-sm-2 p-2">이미지</div>
                <div className="col-sm-10 p-2">
                {
                    Array.isArray(inquiryVO.imageList) && (inquiryVO.imageList.length > 0) ? (
                    
                        inquiryVO.imageList.map((item, index) => {
                            const imageUrl = item ? `${IMAGE_BASE_URL}${item}` : "";
                            return imageUrl ? (
                                <img key={`${item}-${index}`} 
                                        className='viewpage-img img-thumbnail me-2 mb-2'
                                        onClick={() => handleImageClick(index)}
                                        src={imageUrl}
                                />
                            ) : null;
                        })
                    ) : (
                        <span>No Image</span>
                    )
                }
                </div>
            </div>

            <div className="row" style={{borderBottom: '1px solid #ddd'}}>
                <div className="col-sm-2 p-2">내용</div>
                <div className="col-sm-10 p-2" dangerouslySetInnerHTML={{__html : inquiryVO.content}}></div>
            </div>
            
            {
                isModalOpen && 
                <>
                    <DimmedOverlay/> {/* 딤 처리 오버레이 */}
                    <div id='img-modal'>
                        <InquiryImageModal
                            images={inquiryVO.imageList}
                            initialIndex={selectedImageIdx} 
                            onClose={closeModal}    
                        />
                    </div>
                </>
            }
            <InquiryComment writerUserNo={writerUserNo}/>
        </div>
    );
}

export default InquiryReplyView;