import { useEffect, useState } from 'react';
import './../../css/order/OrderList.css';
import apiClient from '../public/axiosConfig';
import apiNoAccessClient from '../public/axiosConfigNoAccess';

function OrderList() {
    const [orderList, setOrderList] = useState([]);
    const [orderItemList, setOrderItemList] = useState([]);
    const [paymentKeyList, setPaymentKeyList] = useState([]);

    const fetchOrderList = async () => {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
            sessionStorage.setItem("redirectAfterLoginPath", window.location.href);
            window.location.href = "/login";
            return null;
        }

        try {

        
        const { data } = await apiClient.get("/order/list");



        setOrderList(data.ordersDtoList);
        setOrderItemList(data.orderItemDtoList)
        setPaymentKeyList(data.paymentKeyList);
        console.log(data);
        } catch (error) {
            console.log("요청 실패:", error);
            return;
        }
    }

    useEffect(() => {
        fetchOrderList();
    }, []);

    const cancelOrder = (paymentKey, orderNo) => {
        if (!window.confirm("주문을 취소하시겠습니까?")) {
            return;
        }
        const fetchCancelOrder = async () => {
            const paymentResponse = await apiClient.post("/payment/cancel", { paymentKey });

            if (paymentResponse.status !== 200) {
                console.log("요청 실패:", paymentResponse.status);
                return;
            }

            const paymentData = paymentResponse.data;
            const transactionKey = paymentData.lastTransactionKey;
            console.log("결제 취소 결과:", paymentData);

            const orderResponse = await apiClient.post("/order/cancel", {
                paymentKey,
                orderNo,
                transactionKey
            });

            if (orderResponse.status !== 200) {
                console.log("요청 실패:", orderResponse.status);
                return;
            }

            fetchOrderList();
        };

        fetchCancelOrder();
    }

    const getStatusText = (text) => {
        switch (text) {
            case '결제 완료':
                return 'PAID';
            case '결제 대기':
                return 'PENDING';
            case '결제 취소':
                return 'CANCELLED';
            case '결제 실패':
                return 'FAILED';
            default:
                return 'UNKNOWN';
        }
    }

    return (
        <div className="orderList_wrapper">
            <div className="orderList_container">
                {/* <button id="back_button" onClick={() => window.history.back()}></button> */}
                <br />
                <b id="cart_text">주문 내역</b>
                {orderList.length > 0 &&
                    orderList.map((order, orderIndex) => {
                        return (<div>
                            <hr />
                            <div className="orderList_head">
                                <div className="orderList_date_state">
                                    <button className={`orderList_state_${getStatusText(order?.statusText)}`} disabled>{order.statusText}</button>
                                    {
                                        new Date(order?.updatedAt)
                                            .toLocaleString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false
                                            })
                                            .replace(/\./g, '')
                                            .replace(/(\d{4}) (\d{2}) (\d{2})/, '$1-$2-$3')
                                    }
                                </div>
                                <div className="orderList_actions">
                                    {order?.statusText === "결제 대기" ? (
                                        <span className="orderList_link" onClick={() => window.location.href = `/mypage/cart`}>
                                            <b>{"장바구니로 이동 >"}</b>
                                        </span>
                                    ) : (
                                        <div>
                                            <span className="orderList_link" onClick={() => window.location.href = `/mypage/order/detail?orderNumber=${order.orderNumber}`}>
                                                <b>{"상세 보기 >"}</b>
                                            </span>
                                            <br />
                                            {order?.statusText === "결제 완료" && order?.pickUpStatus === 'BEFORE' (
                                                <span className="orderList_link" onClick={() => cancelOrder(paymentKeyList[orderIndex], order.id)}>
                                                    <b>{"주문 취소 >"}</b>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </div>
                            <div className="orderItem_container">
                                {orderItemList[orderIndex].map((item, itemIndex) => {
                                    return (
                                        <div className="orderList_content" style={{ display: 'flex', flexDirection: 'row' }} onClick={() => window.location.href = `/mdshop/${item.goodsNo}`}>
                                            <div className="orderList_content_goods_img">
                                                <img src={`${apiNoAccessClient.defaults.baseURL}/file-system/download/${item.imageIdList[0]}`} />
                                            </div>
                                            <div className="orderList_content_goods_detail">
                                                <span className="goods_name"><b>{item.name}</b></span>
                                                <span>수량: {item.quantity}개</span>
                                                <span>상품 금액: {item.price.toLocaleString()}원</span>
                                                <span>총 금액: {(item.price * item.quantity).toLocaleString()}원</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>)
                    })
                }

            </div>
        </div>
    )
}

export default OrderList;