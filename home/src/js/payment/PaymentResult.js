import './../../css/payment/PaymentResult.css';
import { useSearchParams } from "react-router-dom";
const accessToken = sessionStorage.getItem("accessToken");


function PaymentResult() {

    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount")
    // const paymentKey = searchParams.get("paymentKey");

    const showOrderDetail = () => {
        window.location.href = `/order/detail?id=${orderId}`;
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
                <p>{`주문번호: ${orderId}`}</p>
                <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
            </div>
        </div>
    )
}

export default PaymentResult;