import { useParams } from 'react-router-dom';
import '../../css/inquiry/inquiry.css';
import { useEffect, useRef, useState } from 'react';
import apiClient from '../../js/public/axiosConfig';

function InquiryView() {
    const {no} = useParams();
    const IMAGE_BASE_URL = '/file-system/showImage/';
    let [inquiryVO, setInquiryVO] = useState({
        no: null,
        nickname: '',
        subject: '',
        content: '',
        imageList: [],
        createdAt: '',
        userNo: null,
        writedate: ''
    });
    const mounted = useRef(false);
    useEffect(() => {
        if(!mounted) { 
            mounted.current = true;
        } else { 
            getInquiryView();
        }
    }, [no])

    function getInquiryView() {
        apiClient.get(`inquiry/getInquiryBy/${no}`)
        .then(function(response) {
            console.log(response.data);
            setInquiryVO({
                no: response.data.inquiry.no,
                nickname: response.data.inquiry.nickname  || 'User Unknowned',
                subject: response.data.inquiry.subject,
                content: response.data.inquiry.content,
                createdAt: response.data.inquiry.createdAt,
                imageList: response.data.image_list,
                userNo: response.data.userNo,
                proceed: response.data.inquiry.proceed,
                status: response.data.inquiry.status
            });
        })
        .catch(function(error) {
            console.log(error);
        })
    }

    function inquiryDel() {
        if(window.confirm("글을 삭제하시겠습니까?")) {
            apiClient.get(`/inquiry/inquiryDel/${inquiryVO.no}`, )
            .then(function(response){
                console.log(response.data);
                
                if(response.data == 0){  //글이삭제되면 목록으로 이동
                    window.location.href = '/boardList';
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
    const isWriter = loginUserId && String(loginUserId) === String(inquiryVO.userNo);

    return (
        <div className='inquiry-container'>
            <h2>{inquiryVO.subject}</h2>
            {
                isWriter && 
                (<div style={{textAlign: 'right'}}>
                    <a onClick={inquiryDel} style={{cursor: 'pointer'}}>삭제</a>
                </div>)
            }

            <div className="row" style={{borderBottom: '1px solid gray'}}>
                <div className="col-sm-2 p-2">글번호</div>
                <div className="col-sm-10 p-2">{inquiryVO.no}</div>
            </div>

            <div className="row" style={{borderBottom: '1px solid gray'}}>
                <div className="col-sm-2 p-2">글쓴이</div>
                <div className="col-sm-10 p-2">{inquiryVO.nickname}</div>
            </div>

            <div className="row" style={{borderBottom: '1px solid gray'}}>
                <div className="col-sm-2 p-2">등록일</div>
                <div className="col-sm-10 p-2">{new Date(inquiryVO.createdAt).toLocaleString('ko-KO')}</div>
            </div>

            <div className="row" style={{borderBottom: 'none',marginTop: '10px'}}>
                <div className="col-sm-2 p-2">이미지</div>
                <div className="col-sm-10 p-2">
                {
                    Array.isArray(inquiryVO.imageList) && (inquiryVO.imageList.length > 0) ? (
                    
                        inquiryVO.imageList.map((item) => {
                            return (
                                <img key={item}
                                        src={`http://192.168.1.252:9988/file-system/showImage/${item}`}
                                        style={{width: '100px', marginLeft: '15px'}}
                                />
                            )
                        })
                    ) : (
                        <span>No Image</span>
                    )
                }
                </div>
            </div>

            <div className="row" style={{borderBottom: '1px solid gray'}}>
                <div className="col-sm-2 p-2">내용</div>
                <div className="col-sm-10 p-2" dangerouslySetInnerHTML={{__html : inquiryVO.content}}></div>
            </div>
        </div>
    )
}

export default InquiryView;