import styled from 'styled-components';
import '../../css/inquiry/inquiry.css';
import { Link } from 'react-router-dom';
import InquiryWrite from './InquiryWrite';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import InquiryView from './InquiryView';

function InquiryPage() {
    let [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    let [writeModalOpen, setWriteModalOpen] = useState(false);
    let [inquiryList, setInquiryList] = useState([]);

    const StyledLink = styled(Link)`
        text-decoration: none;

        &:link, &:visited, &:active {
            color: blue;
        }
        &:hover {
            color: yellowgreen;
        }
    `;
    
    //문의리스트 호출
    const mounted = useRef(false);
    useEffect (() => {
        if(!mounted.current==false) {
            mounted.current=true;
            getInquiryList();
        }
    }, []);

    function getInquiryList() {
        axios.get("http://192.168.1.252:9988/inquiry/getInquiry")
        .then(function(response) {
            console.log(response.data);
            setInquiryList((prev) => {
                return [...prev, {
                    no: response.no,
                    subject: response.subject,
                    nickname: response.userNo.nickname,
                    createdAt: response.createdAt
                }]
            })
        })
        .catch(function(error) {
            console.log("error발생 : ", error);
        })
    }

    // 모달 닫는 함수
    const closeWriteModal = useCallback(() => {
        setWriteModalOpen(false);
    }, []);

    const closeInquiryModal = useCallback(() => {
        setInquiryModalOpen(false);
    }, []);

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

    return(
        <div className="inquiry-container">
            <p>1:1문의하기</p>
            <div className="container mt-3">
                <table className="table table-hover" style={{width: '100%'}}>
                    <thead style={{borderBottom: '1px solid #ddd'}}>
                        <tr>
                            <th style={{width:'10%', textAlign:'center'}}>번호</th>
                            <th style={{width:'50%'}}>제목</th>
                            <th style={{width:'20%', textAlign:'center'}}>작성자</th>
                            <th style={{width:'20%', textAlign:'center'}}>작성날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.isArray(inquiryList) && inquiryList.length > 0 ? (
                                inquiryList.map((item) => {
                                    return (
                                        <tr>
                                            <td style={{width:'10%', textAlign:'center'}}>{item.no}</td>
                                            <td style={{width:'50%'}} onClick={() => setInquiryModalOpen(true)}>{item.subject}</td>
                                            <td style={{width:'20%', textAlign:'center'}}>{item.nickname}</td>
                                            <td style={{width:'20%', textAlign:'center'}}>{item.createdAt}</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td style={{border: 'none'}}>
                                        <div id='noInquiryMsg'>문의 내역이 없습니다.</div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            {   
                writeModalOpen &&
                <>
                    <DimmedOverlay/> {/* 딤 처리 오버레이 */}
                    <div id="inquiryModal">
                        <InquiryWrite onClose={closeWriteModal}/>
                    </div>
                </>
            }
            {   
                inquiryModalOpen &&
                <>
                    <DimmedOverlay/> {/* 딤 처리 오버레이 */}
                    <div id="inquiryModal">
                        <InquiryView onClose={closeInquiryModal}/>
                    </div>
                </>
            }
            <div>
                <div id="paging">
                    
                </div>
                <div style={{textAlign: 'right'}}><button id="write" 
                        title='문의하기' 
                        onClick={() => setWriteModalOpen(true)}
                        disabled={writeModalOpen || inquiryModalOpen}
                        style={{pointerEvents: (writeModalOpen||inquiryModalOpen) ? 'none' : 'auto'}}>
                    문의하기
                </button></div>
            </div>
        </div>
    )
}

export default InquiryPage;