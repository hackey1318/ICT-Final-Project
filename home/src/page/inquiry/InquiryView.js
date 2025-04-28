import { useParams } from 'react-router-dom';
import '../../css/inquiry/inquiry.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import apiClient from '../../js/public/axiosConfig';
import InquiryImageModal from '../../js/inquiry/InquiryImageModal';
import styled from 'styled-components';
import InquiryComment from '../../js/inquiry/InquiryComment';

function InquiryView() {
    const {no} = useParams();
    const IMAGE_BASE_URL = '/file-system/showImage/';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

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
        proceed: ''
    });

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
        if(!mounted) { 
            mounted.current = true;
        } else { 
            getInquiryView();
        }
    }, [no])

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

    function inquiryDel() {
        if(window.confirm("글을 삭제하시겠습니까?")) {
            apiClient.get(`/inquiry/inquiryDel/${inquiryVO.no}`, )
            .then(function(response){
                console.log(response.data);
                
                if(response.status === 200 || response.status === 204){ 
                    alert("게시글이 삭제되었습니다.");
                    window.location.href = '/inquiry';
                } else {
                    alert("삭제에 실패하였습니다." + JSON.stringify(response.data));
                    return false;
                }
            })
            .catch(function(error){
                console.log(error);
            });
        }
    }

    const loginUserInfo = sessionStorage.getItem("userInfo");
    let loginUserId = null;
    if(loginUserInfo) {
        try {
            const userInfoObject = JSON.parse(loginUserInfo);
            loginUserId = userInfoObject.userNo;
        } catch(error) {
            console.log("sessionStorage의 userInfo 파싱오류 : ", error);
        }
    }
    const isWriter = loginUserId !== null &&
                     inquiryVO.userNo !== null &&
                     String(loginUserId) === String(inquiryVO.userNo);

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
            <h2>{inquiryVO.subject}</h2>
            {
                isWriter && String(inquiryVO.proceed)==='BEFORE' &&
                <div id="del-inquiry">
                    <a onClick={inquiryDel} style={{cursor: 'pointer'}}>삭제</a>
                </div>
            }

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
            <InquiryComment/>
        </div>
    )
}

export default InquiryView;