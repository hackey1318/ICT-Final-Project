import './../../css/order/OrderDetail.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import apiClient from './../public/axiosConfig';

function OrderDetail() {

    const [goodsData, setGoodsData] = useState([]);
    const [orderData, setOrderData] = useState();
    const [paymentData, setPaymentData] = useState();
    const [nickName, setNickName] = useState();
    const [email, setEmail] = useState();
    const [theater, setTheater] = useState();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderNumber");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        apiClient.post("/order/detail", JSON.stringify({
            orderNumber: orderId
        }))
            .then((response) => {
                setOrderData(response.data.orders);
                setGoodsData(response.data.goods);
                setPaymentData(response.data.payments);
                setNickName(response.data.nickName);
                setEmail(response.data.email);
                setTheater(response.data.theater);
                setLoading(false);
            })
            .catch((error) => {
                window.location.href = "/order/error";
            })
    }, []);

    useEffect(() => {
        if (goodsData.length === 0) return;
        const goodsIdList = goodsData.map(item => item.goodsNo);
    }, [goodsData])

    if (loading) {
        return null;
    }

    return (
        <div className="order_container">
            <button id="back_button" onClick={() => window.location.href = "/mypage/order/list"}></button>
            <p><b>주문 상세 정보</b> (주문 번호: {orderId})</p>
            <div className="info_container">
                <b>상품 정보</b>
                <div className="order_info_table">
                    <div className="order_info_content_goods">
                        {goodsData.map((element, index) => (
                            <div key={index} onClick={() => window.location.href = `/mdshop/${goodsData[index].goodsNo}`}>
                                <div className="order_info_content_goods_img">
                                    <img src={`/file-system/download/${element.imageIdList[0]}`}/>
                                </div>
                                <div className="order_info_content_goods_detail">
                                    <span className="goods_name"><b>{element.name}</b></span>
                                    <span>수량: {element.quantity}개</span>
                                    <span>상품 금액: {element.price.toLocaleString()}원</span>
                                    <span>총 금액: {(element.price * element.quantity).toLocaleString()}원</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="info_container">
                <b>결제 정보</b>
                <div className="order_info_table">
                    <div className="order_info_content">
                        <div>결제 번호</div>
                        <div>{paymentData?.paymentKey}</div>
                    </div>
                    <div className="order_info_content">
                        <div>결제 수단</div>
                        <div>{paymentData?.method}</div>
                    </div>
                    <div className="order_info_content">
                        <div>주문 상태</div>
                        <div>{orderData?.statusText}</div>
                    </div>
                    <div className="order_info_content">
                        <div>완료 시간</div>
                        <div>{
                            new Date(orderData?.updatedAt)
                                .toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })
                                .replace(/\./g, '')
                                .replace('  ', ' ')
                                .replace(/(\d{4}) (\d{2}) (\d{2})/, '$1-$2-$3')
                        }</div>
                    </div>
                    <div className="order_info_content">
                        <div>결제 금액</div>
                        <div>{orderData?.totalPrice.toLocaleString()}원</div>
                    </div>
                </div>
            </div>
            <div className="info_container">
                <b>픽업 정보</b>
                <div className="order_info_table">
                    <div className="order_info_content">
                        <div>받는 분</div>
                        <div>{nickName}</div>
                    </div>
                    <div className="order_info_content">
                        <div>이메일</div>
                        <div>{email}</div>
                    </div>
                    <div className="order_info_content">
                        <div>영화관</div>
                        <div>{theater}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail;