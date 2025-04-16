import './../../css/order/OrderDetail.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
const accessToken = sessionStorage.getItem("accessToken");

function OrderDetail() {

    const [goodsData, setGoodsData] = useState([]);
    const [orderData, setOrderData] = useState();
    const [pickupData, setPickupData] = useState();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('id');

    useEffect(() => {
        axios.get("http://localhost:9988/order/detail", {
            params: {
                orderId: orderId
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                if (response.data === true) {
                    console.log("TRUE");
                } else {
                    console.log("오류 페이지로 이동하기 - 유효하지않은 주문번호 or 본인이 주문한 상품이 아님");
                }
            })
            .catch((error) => {
                console.log(error);
            })

        const testGoodsData = [
            { id: 1, img: "https://img.danawa.com/prod_img/500000/185/173/img/49173185_1.jpg?shrink=130:130&_v=20250407171230", name: "스티치 인형", quantity: 1, price: 19440 },
            { id: 2, img: "https://img.danawa.com/prod_img/500000/443/941/img/6941443_1.jpg?shrink=130:130&_v=20181227122347", name: "묠니르 망치 스피커", quantity: 2, price: 328000 },
            { id: 3, img: "https://cimg.cowave.kr/image/vendor_inventory/e317/70193a0bcc148a37695d2780f84fee6caac3acc9321c9288dde86f3e9c48.jpeg", name: "주먹왕 랄프 피규어 세트", quantity: 3, price: 65890 }
        ]

        const testOrderData = {
            method: "신용카드",
            state: "결제 완료",
            orderDate: "2025-04-14 17:55",
            paymentDate: "2025-04-14 17:55",
            amount: 873110
        }

        const testPickupData = {
            receiver: "김민수",
            tel: "010-1234-5678",
            address: "서울 성동구 왕십리로",
            memo: "꼼꼼한 포장 부탁드립니다."
        }

        setGoodsData(prev => [...prev, ...testGoodsData]);
        setOrderData(testOrderData);
        setPickupData(testPickupData);
    }, []);


    return (
        <div className="order_container">
            <button id="back_button" onClick={() => window.location.href = "/order/list"}></button>
            <p><b>주문 상세 정보</b> (주문 번호: {orderId})</p>
            <div className="info_container">
                <b>상품 정보</b>
                <div className="order_info_table">
                    <div className="order_info_content_goods">
                        {goodsData.map((element, index) => (
                            <div key={index} onClick={() => window.location.href = `/id=${goodsData[index].id}`}> {/* 상품 상세정보 페이지 링크 나중에 추가할 것 */}
                                <div className="order_info_content_goods_img">
                                    <img src={element.img} />
                                </div>
                                <div className="order_info_content_goods_detail">
                                    <span className="goods_name"><b>{element.name}</b></span>
                                    <span>수량: {element.quantity}개</span>
                                    <span>가격: {(element.price * element.quantity).toLocaleString()}원</span>
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
                        <div>결제 수단</div>
                        <div>{orderData?.method}</div>
                    </div>
                    <div className="order_info_content">
                        <div>주문 상태</div>
                        <div>{orderData?.state}</div>
                    </div>
                    <div className="order_info_content">
                        <div>주문 시간</div>
                        <div>{orderData?.orderDate}</div>
                    </div>
                    <div className="order_info_content">
                        <div>결제 시간</div>
                        <div>{orderData?.paymentDate}</div>
                    </div>
                    <div className="order_info_content">
                        <div>결제 금액</div>
                        <div>{orderData?.amount.toLocaleString()}원</div>
                    </div>
                </div>
            </div>
            <div className="info_container">
                <b>픽업 정보</b>
                <div className="order_info_table">
                    <div className="order_info_content">
                        <div>받는 분</div>
                        <div>{pickupData?.receiver}</div>
                    </div>
                    <div className="order_info_content">
                        <div>전화번호</div>
                        <div>{pickupData?.tel}</div>
                    </div>
                    <div className="order_info_content">
                        <div>주소</div>
                        <div>{pickupData?.address}</div>
                    </div>
                    <div className="order_info_content">
                        <div>메모</div>
                        <div>{pickupData?.memo}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail;