import axios from "axios";
import { useEffect, useState } from "react";
import "./../../css/order/OrderManage.css";
import apiClient from './../public/axiosConfig';

function OrderManage() {

    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [state, setState] = useState('');

    useEffect(() => {
        getOrderList();
    }, [state, currentPage]);

    const handleStateChange = (newState) => {
        setCurrentPage(0);
        setState(newState);
    };

    const getOrderList = () => {
        apiClient.post("/order/orderManage", {}, {
            params: {
                page: currentPage,
                size: pageSize,
                state: state
            },
        })
            .then(response => {
                setTotalPages(response.data.totalPages);

                const responseOrders = [];

                response.data.content.map((element, index) => {
                    responseOrders.push({
                        index: index,
                        userNickName: element.userNickname,
                        orderItemNameList: element.orderItemNameList,
                        date: new Date(element.updatedAt),
                        ordersStatus: element.ordersStatus,
                        orderNumber: element.orderNumber
                    })
                })

                setOrders(responseOrders);
            });
    }

    return (
        <div className="orderManage_wrapper">
            <div className="orderManage_container">
                <h3>주문 정보 조회</h3>
                <div className="orderManage_stateButtons">
                    <button onClick={() => handleStateChange("")} id="allButton">전체</button>
                    <button onClick={() => handleStateChange("PAID")} id="paidButton">결제 완료</button>
                    <button onClick={() => handleStateChange("CANCELLED")} id="cancelledButton">결제 취소</button>
                </div>
                <hr />
                <div className="orderManage_info">

                    {orders.map(order => {
                        const statusLabel = {
                            PAID: "결제 완료",
                            CANCELLED: "결제 취소"
                        }[order.ordersStatus] || "기타 상태";

                        return (
                            <div className={`orderManage_element ${order.ordersStatus === 'PAID' ? 'paid' : order.ordersStatus === 'CANCELLED' ? 'cancelled' : ''}`}>
                                <div style={{ marginTop: '5px', marginLeft: '8px' }}>
                                    <b>닉네임</b>: {order.userNickName}
                                    <br />
                                    <b>결과</b>: {statusLabel}
                                    <br />
                                    <b>처리 시간</b>: {new Date(order.date).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}
                                    <br />
                                    <b>상품 목록</b>: {order.orderItemNameList.map((item, index) => (
                                        <span key={index}>
                                            {item}{index < order.orderItemNameList.length - 1 ? " / " : ""}
                                        </span>
                                    ))}
                                    <br />
                                    <b>주문 번호</b>: {order.orderNumber}
                                </div>
                            </div>
                        )
                    })}

                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="orderManage_pageButtons">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                <a className="page-link" style={{cursor: 'pointer'}} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}>
                                    Previous
                                </a>
                            </li>

                            {
                                Array.from({ length: totalPages }, (_, i) => (
                                    <li
                                        key={i}
                                        className={`page-item ${currentPage === i ? 'active' : ''}`}
                                        style={{cursor: 'pointer'}}
                                        onClick={() => setCurrentPage(i)}
                                    >
                                        <a className="page-link">{i + 1}</a>
                                    </li>
                                ))
                            }

                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                <a className="page-link" style={{cursor: 'pointer'}} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}>
                                    Next
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderManage;