import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function PaymentResult() {

    const [searchParams] = useSearchParams();
    const [responseCustomerData, setResponseCustomerData] = useState({});
    const [responseGoodsData, setResponseGoodsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:9988/payment/result", searchParams.get("orderId"), {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                console.log(response.data);
                setResponseCustomerData({
                    customerEmail: "customer123@gmail.com",
                    customerName: "김씨네마투게더",
                    customerMobilePhone: "01012341234",
                    customerAddress: "서울 성동구 왕십리로"
                });

                const newGoodsData = [];
                for (let i = 1; i < response.data.length; i++) {
                    console.log(response.data[i]);
                    newGoodsData.push(response.data[i]);
                }

                setResponseGoodsData(prev => [...prev, ...newGoodsData]);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="result wrapper">
            <div className="box_section">
                <h2>
                    결제 성공
                </h2>
                <div>
                    {/* 주문상품목록 */}
                    {responseGoodsData.length > 0 && (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            {responseGoodsData.map((item, index) => (
                                <div>
                                    <img src={item.image}/><br/>
                                    상품명: {item.name}<br/>
                                    가격: {item.price}<br/>
                                    수량: {item.quantity}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
                <p>{`결제 금액: ${Number(searchParams.get("amount")).toLocaleString()}원`}</p>
                <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>

                <p>{`이메일: ${responseCustomerData.customerEmail}`}</p>
                <p>{`이름: ${responseCustomerData.customerName}`}</p>
                <p>{`전화번호: ${responseCustomerData.customerMobilePhone}`}</p>
                <p>{`주소: ${responseCustomerData.customerAddress}`}</p>


            </div>
        </div>
    )
}

export default PaymentResult;