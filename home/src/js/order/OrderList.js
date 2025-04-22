import { useEffect, useState } from 'react';
import './../../css/order/OrderList.css';

const accessToken = sessionStorage.getItem("accessToken");

function OrderList() {
    const [orderList, setOrderList] = useState([]);
    const [orderItemList, setOrderItemList] = useState([]);

    useEffect(() => {
        const fetchOrderList = async () => {
            const response = await fetch("http://localhost:9988/order/list", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
            );

            if (!response.ok) {
                console.log("요청 실패:", response.status);

            } else {
                const data = await response.json();
                setOrderList(data.ordersDtoList);
                setOrderItemList(data.orderItemDtoList)
            }
        }

        fetchOrderList();
    }, []);

    return (
        <div className="orderList_wrapper">
            <div className="orderList_container">
                <button id="back_button" onClick={() => window.history.back()}></button>
                <br />
                <b id="cart_text">주문내역</b>
                {orderList.length > 0 &&
                    orderList.map((order, orderIndex) => {
                        return (<div>
                            <hr />
                            <div className="orderList_head">
                                <div>
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
                                    } - {order?.statusText}
                                </div>
                                <div>
                                    {order?.statusText !== "결제 대기" && <span className="orderDetail" onClick={() => window.location.href = `/order/detail?orderNumber=${order.orderNumber}`}><b>{"상세보기 >"}</b></span>}
                                </div>
                            </div>
                            <div className="orderItem_container">
                                {orderItemList[orderIndex].map((item, itemIndex) => {
                                    return (
                                        <div className="orderList_content" style={{ display: 'flex', flexDirection: 'row' }} onClick={() => window.location.href = `/mdshop/${item.goodsNo}`}>
                                            <div className="orderList_content_goods_img">
                                                <img src={`http://192.168.1.252:9988/file-system/download/${item.imageIdList[0]}`} />
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