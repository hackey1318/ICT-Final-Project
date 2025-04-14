import { useParams } from 'react-router-dom';
import '../../css/inquiry/inquiry.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import apiClient from '../../js/public/axiosConfig';

function InquiryView() {
    const {no} = useParams();
    let [inquiryVO, setInquiryVO] = useState({});
    let [imageList, setImageList] = useState([]);

    const mounted = useRef(false);
    useEffect(() => {
        if(!mounted) { 
            mounted.current = true;
        } else { 
            getInquiryView();
        }
    }, [])

    function getInquiryView() {
        axios.get(`http://192.168.1.252:9988/getInquiryBy/${no}`)
        .then(function(response) {
            console.log(response.data);

            setInquiryVO({
                no: response.data.inquiry.no,
                subject: response.data.inquiry.subject,
                content: response.data.inquiry.content,
                createdAt: response.data.inquiry.createdAt
            });

            setImageList([]);
            response.data.imageList.map((image) => {
                setImageList((prev) => {
                    return [...prev, {
                        id: image.id,
                        filename: image.originName
                    }]
                })
            });
        })
        .catch(function(error) {
            console.log(error);
        })
    }

    function inquiryDel() {
        if(window.confirm("글을 삭제하시겠습니까?")) {
            apiClient.get(`http://192.168.1.252:9988/inquiry/inquiryDel/${inquiryVO.no}`, )
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

    return (
        <div className='inquiry-container'>
            <h2>{inquiryVO.subject}</h2>
            {
                sessionStorage.getItem("logUserid")==inquiryVO.userNo && 
                (<div>
                    <a href={`/boardEdit/${inquiryVO.no}`} style={{cursor: 'pointer'}}>수정</a>
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
                <div className="col-sm-10 p-2">{inquiryVO.writedate}</div>
            </div>

            <div className="row" style={{borderBottom: '1px solid gray'}}>
                <div className="col-sm-2 p-2">제목</div>
                <div className="col-sm-10 p-2">{inquiryVO.subject}</div>
            </div>

            <div className="row" style={{borderBottom: '1px solid gray'}}>
                <div className="col-sm-2 p-2">이미지</div>
                <div className="col-sm-10 p-2">
                {
                    Array.isArray(imageList) && (imageList.length > 0) ? (
                    
                        imageList.map((item) => {
                            return (
                                <>

                                </>
                            )
                        })
                    ) : (
                        <span>No image</span>
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