import styled from 'styled-components';
import '../../css/inquiry/inquiry.css';
import { Link, useNavigate } from 'react-router-dom';
import InquiryWrite from './InquiryWrite';
import InquiryView from './InquiryView';
import { useCallback, useEffect, useRef, useState } from 'react';
import apiNoAccessClient from '../../js/public/axiosConfigNoAccess';

function InquiryPage() {
    let [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    let [writeModalOpen, setWriteModalOpen] = useState(false);
    let [inquiryList, setInquiryList] = useState([]);
    let [no, setNo] = useState(1);  //페이징
    let navigate = useNavigate();

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
    useEffect (() => {
        getInquiryList();
    }, []);

    const getInquiryList = async () => {
        try {
            const listData = await apiNoAccessClient.get("/inquiry/getInquiry")
            setInquiryList(listData.data);
            console.log(listData.data);
        } catch(error) {
            console.log("error발생 : ", error);
        }
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

    //인터셉터
    const handleWriteClick = () => {
        const accessToken = sessionStorage.getItem("accessToken");
        if(accessToken) {
            setWriteModalOpen(true);
        } else {
            alert("로그인이 필요한 기능입니다.");
            navigate('/login');
        }
    };

    return(
        <div className="inquiry-container">
            <h3 style={{margin: '30px auto'}}>1:1문의하기</h3>
            <div className="container mt-3">
                <table className="table table-hover" style={{width: '100%'}}>
                    <thead style={{borderBottom: '1px solid #ddd'}}>
                        <tr>
                            <th style={{width:'7%', textAlign:'center'}}>번호</th>
                            <th style={{width:'48%', textAlign:'center'}}>제목</th>
                            <th style={{width:'15%', textAlign:'center'}}>작성자</th>
                            <th style={{width:'20%', textAlign:'center'}}>작성날짜</th>
                            <th style={{width:'10%', textAlign:'center'}}>진행상황</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.isArray(inquiryList) && inquiryList.length > 0 ? (
                                inquiryList
                                    .filter(item => item.status === "ACTIVE")
                                    .map((item) => {
                                        console.log(inquiryList);
                                    return (
                                        <tr className="td-container">
                                            <td style={{width:'7%', textAlign:'center'}}>{item.no}</td>
                                            <td style={{width:'48%'}}><Link id="toDetail" to={`/inquiryView/${item.no}`} title={`${item.subject}`}>{item.subject}</Link></td>
                                            <td style={{width:'15%', textAlign:'center'}}>{item.nickname}</td>
                                            <td style={{width:'20%', textAlign:'center'}}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td style={{width:'10%', textAlign:'center'}}>{item.proceed}</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td className='noInquiryMsg' >
                                        문의 내역이 없습니다.
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
                        <InquiryWrite onClose={closeWriteModal}
                                      onSuccess={getInquiryList}/>
                    </div>
                </>
            }
            <div>
                <div id="paging">
                    {/* <ul className="pagination">
                        {
                            (function() {
                                if(nowPage>1){
                                    return <li className="page-item"><a className="page-link" onClick={()=>getBoardList(nowPage-1)}>Previous</a></li>       
                                }
                            })()
                        }
                        
                        {pageNum.map(function(pg){
                            var activeStyle = 'page-item'; //현재 페이지만 active스타일이 먹도록 설정
                            if(nowPage == pg) activeStyle = 'page-item active';

                            return <li className={activeStyle}><a className="page-link" onClick={()=>getBoardList(pg)}>{pg}</a></li>
                        })}
                        
                        {
                            (function(){
                                if(nowPage<totalPage){
                                    return <li className="page-item"><a className="page-link" onClick={()=>getBoardList(nowPage+1)}>Next</a></li>
                                }
                            })()
                        }
                    </ul> */}
                </div>
                <div style={{textAlign: 'right', minWidth: '850px'}}>
                    <button id="write" 
                        title='문의하기' 
                        onClick={handleWriteClick}
                        disabled={writeModalOpen || inquiryModalOpen}
                        style={{pointerEvents: (writeModalOpen||inquiryModalOpen) ? 'none' : 'auto'}}>
                        문의하기
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InquiryPage;