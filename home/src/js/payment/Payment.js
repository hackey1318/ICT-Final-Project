import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
    const [goods, setGoods] = useState([

    ]);

    const [totalPrice, setTotalPrice] = useState("");

    // 상품추가전용 임시함수
    const addGoods = (id) => {

        let newGoods = {};
        if (id === 1) {
            newGoods = {
                id: 1,
                name: '캡틴아메리카 방패',
                price: 100000,
                quantity: 1,
                image: "https://thumbnail10.coupangcdn.com/thumbnails/remote/320x320ex/image/vendor_inventory/f1b6/3e149246ef5e13feefbf2cb8202b7bca939915efa193e6b2d84e0eb15525.jpg"
            }
        } else if (id === 2) {
            newGoods = {
                id: 2,
                name: '타노스 건틀릿',
                price: 50000,
                quantity: 1,
                image: "https://thumbnail8.coupangcdn.com/thumbnails/remote/320x320ex/image/vendor_inventory/f5e5/b8490aa75e1f69d2f3a7c9c9f8d10dc9f9de77111b159110b693f6aa4d6f.jpg"
            }
        }

        const isItemExist = goods.some(item => item.id === id);
        if (isItemExist) {
            alert("해당 상품은 이미 추가되었습니다.");
        } else {
            setGoods([...goods, newGoods]);
        }
    }

    const addQuantity = (id) => {
        const index = goods.findIndex(item => item.id === id);
        if (index !== -1) {
            const updateGoods = [...goods];
            updateGoods[index].quantity += 1;
            setGoods(updateGoods);
            updateTotalPrice();
        }
    }

    const subQuantity = (id) => {
        const index = goods.findIndex(item => item.id === id);
        if (index !== -1) {
            const updateGoods = [...goods];
            if (updateGoods[index].quantity > 1) {
                updateGoods[index].quantity -= 1;
                setGoods(updateGoods);
                updateTotalPrice();
            }
        }
    }

    const updateTotalPrice = () => {
        let totalPrice = 0;
        goods.map((item) => {
            totalPrice += item.price * item.quantity;
        });

        setTotalPrice(totalPrice);
    }

    useEffect(() => {
        updateTotalPrice();
    }, [goods]);

    function popupPayment() {

        let orderName = "";

        if (goods.length === 1) {
            orderName = `${goods[0].name}`;
        } else {
            orderName = `${goods[0].name} 외 ${goods.length - 1}건`;
        }

        const popupWidth = 600;
        const popupHeight = 500;
        const customerAddress = "서울시 성동구 왕십리로";

        // 서버에 결제 정보 저장하기
        axios.post("http://localhost:9988/payment/save", {
            orderId: "orderid1234567890r",
            orderName: orderName,
            totalPrice : totalPrice,
            customerEmail: "customer123@gmail.com",
            customerName: "김씨네마투게더",
            customerMobilePhone: "01012341234",
            customerAddress: "서울 성동구 왕십리로",
            goods: goods
        })
        .then((response) => {
            if (response.data === "success") {
                // 결제 ui 열기
                window.open(
                    `http://localhost:3000/payment/tossPayment?&totalPrice=${totalPrice}&orderName=${orderName}`,
                    "PaymentWindow",
                    `width=${popupWidth},
                    height=${popupHeight},
                    top=${window.screen.height / 2 - popupHeight / 2},
                    left=${window.screen.width / 2 - popupWidth / 2}`
                );
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {goods.map((item) => {
                    return (
                        <div style={{ border: '1px solid black' }}>
                            <img src={item.image} />
                            <div>상품명: {item.name}</div>
                            <div>개당 가격: {item.price}</div>
                            <div>수량: {item.quantity}
                                <button onClick={() => addQuantity(item.id)}>▲</button>
                                <button onClick={() => subQuantity(item.id)}>▼</button>
                            </div>
                        </div>)
                })}
            </div>
            <div>총 주문금액 : {totalPrice.toLocaleString()}</div>
            <button onClick={popupPayment}>결제창열기</button>
            <button onClick={() => addGoods(1)}>캡틴아메리카 방패 상품추가하기</button>
            <button onClick={() => addGoods(2)}>타노스 건틀릿 상품추가하기</button>
        </div>
    )
}

export default Payment;