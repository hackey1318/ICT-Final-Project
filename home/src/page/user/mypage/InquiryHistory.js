import styled from 'styled-components';
import '../../../css/user/mypage/InquiryHistory.css';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import apiNoAccessClient from '../../../js/public/axiosConfigNoAccess';

function InquiryHistory() {
    let [inquiryList, setInquiryList] = useState([]);
    let navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    const [userInfo, setUserInfo] = useState(null);

    const StyledLink = styled(Link)`
        text-decoration: none;
        &:link, &:visited, &:active {color: blue;}
        &:hover {color: yellowgreen;}`;

        useEffect(() => {
            const storedUserInfo = sessionStorage.getItem('userInfo');
            if (storedUserInfo) {
              setUserInfo(JSON.parse(storedUserInfo));
            }
          }, []);

        const getInquiryList = useCallback(async (page = 0) => {
            try {
                const response = await apiNoAccessClient.get(`/inquiry/getInquiry?page=${page}&size=${pageSize}`);
                if (response.data && response.data.content) {
                    setInquiryList(response.data.content || []);
                    setTotalPages(response.data.totalPages);
                } else {
                    console.error("잘못된 API구조", response.data);
                    setInquiryList([]);
                    setTotalPages(0);
                }
            } catch (error) {
                console.log("error발생 : ", error);
                setInquiryList([]);
                setCurrentPage(0);
            }
        }, [pageSize]);

    //문의리스트 호출
    useEffect (() => {
        getInquiryList(currentPage);
    }, [currentPage, getInquiryList]);

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

    //본인글 자세히보기
    const handleInquiryClick = useCallback(async (item) => {
        navigate(`/inquiryView/${item.no}`);
    }, [navigate]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="mypage-inquiry-container">
            <h3 style={{margin: '30px auto'}}>나의 문의 내역</h3>
            <div className="container mt-3">
                <table className="table table-hover" style={{width: '100%'}}>
                    <thead style={{borderBottom: '1px solid #ddd'}}>
                        <tr>
                            <th style={{width:'7%', textAlign:'center', background: '#f1f3f5'}}>번호</th>
                            <th style={{width:'48%', textAlign:'center', background: '#f1f3f5'}}>제목</th>
                            <th style={{width:'20%', textAlign:'center', background: '#f1f3f5'}}>작성날짜</th>
                            <th style={{width:'10%', textAlign:'center', background: '#f1f3f5'}}>진행상황</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.isArray(inquiryList) && 
                                inquiryList.filter(item => item.status === "ACTIVE" && item.userNo === userInfo.userNo).length > 0 ? (                                inquiryList
                                    .filter(item => item.status === "ACTIVE" && item.userNo === userInfo.userNo)
                                    .map((item) => {
                                        console.log(inquiryList)
                                        return (
                                            <tr className="td-container" key={item.no}>
                                                <td style={{ width: '10%', textAlign: 'center' }}>{item.no}</td>
                                                <td style={{ width: '40%', textAlign: 'left' }}>
                                                    <a href='#' id='toDetail' onClick={(e) => { e.preventDefault(); handleInquiryClick(item) }}>
                                                        <span style={{ paddingLeft: '30px' }}>{item.subject}</span>
                                                    </a>
                                                </td>
                                                <td style={{ width: '30%', textAlign: 'center' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                <td style={{ width: '20%', textAlign: 'center' }}>{item.proceedDescription}</td>
                                            </tr>
                                        );
                                    })
                            ) : (
                                <tr>
                                    <td className='myNoInquiryMsg' colSpan="4">
                                        문의 내역이 없습니다.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            <div>
                <div id="paging">
                    {totalPages > 0 && ( 
                        <Pagination
                            page={currentPage}       
                            totalPages={totalPages}   
                            onPageChange={handlePageChange} 
                        />
                    )}
                </div>
                <div style={{textAlign: 'right', minWidth: '850px'}}>
                    <Link
                        to="/inquiry"
                    >
                        <button id="toInquiryPage" 
                            title='문의하러가기'>
                            문의하러가기
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default InquiryHistory;