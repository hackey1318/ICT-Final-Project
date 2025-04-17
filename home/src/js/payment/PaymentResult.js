import { useEffect } from 'react';
import './../../css/payment/PaymentResult.css';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
const accessToken = sessionStorage.getItem("accessToken");


function PaymentResult() {

    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get("orderNumber");
    const totalPrice = searchParams.get("totalPrice")
    const paymentKey = searchParams.get("paymentKey");

    const showOrderDetail = () => {
        window.location.href = `/order/detail?id=${orderNumber}`;
    }

    const continueShopping = () => {

    }

    return (
        <div className="result_container">
            <div id="result_img"></div>
            <b>주문이 완료되었습니다.</b>
            <div className="result_buttons">
                <button onClick={showOrderDetail}>주문 상세 보기</button>
                <button onClick={continueShopping}>쇼핑 계속하기</button>
            </div>
            <div className="result_info">
                <p>{`주문번호: ${orderNumber}`}</p>
                <p>{`결제번호: ${paymentKey}`}</p>
                <p>{`결제 금액: ${Number(totalPrice).toLocaleString()}원`}</p>
            </div>
        </div>
    )
}

export default PaymentResult;