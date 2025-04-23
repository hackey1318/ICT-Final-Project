import './../../css/order/OrderError.css';

function OrderError() {

    return (
        <div>
            <div className="order_error_container">
                <div className="error_img"></div>
                <div className="error_msg">주문 내역이 존재하지 않습니다.</div>
            </div>
        </div>
    )
}

export default OrderError;