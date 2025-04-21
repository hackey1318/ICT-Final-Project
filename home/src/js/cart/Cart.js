import { useEffect, useRef, useState } from 'react';
import '../../css/cart/Cart.css';
import checkMark from '../../img/checkMark.png';
import axios from 'axios';
import TossPayment from "./../payment/TossPayment";
// import { debounce } from 'lodash';
import CartApi, { deleteGoodsList, getGoodsList, getTheaterList } from "./CartApi";

const accessToken = sessionStorage.getItem("accessToken");

function Cart() {
    const [goods, setGoods] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderName, setOrderName] = useState();
    const [orderNumber, setOrderNumber] = useState();
    const [loading, setLoading] = useState(true);
    const [paymentModalOpen, setPaymentModalOpen] = useState();
    const [theaterSuggestion, setTheaterSuggestion] = useState(false);
    const [theaterData, setTheaterData] = useState([]);
    const [filteredTheaters, setFilteredTheaters] = useState([]);
    const theaterRef = useRef();
    const goodsRef = useRef(goods);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (window.location.pathname === "/cart") {
                cartQuantityUpdate(); // 동기 API 또는 navigator.sendBeacon
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            cartQuantityUpdate();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const cartQuantityUpdate = () => {
        axios.post("http://localhost:9988/cart/updateQuantity",
            {
                goodsNos: goodsRef.current.map(element => element.goodsNo),
                goodsQuantities: goodsRef.current.map(element => element.quantity),
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
    }

    useEffect(() => {
        // 로그인 확인
        if (!accessToken) {
            window.location.href = "/login";
            return null;
        }
        setLoading(false);

        // 영화관 데이터 가져오기
        getTheaterList()
            .then((response) => {
                setTheaterData(prev => [...prev, ...response.data]);
                setFilteredTheaters(prev => [...prev, ...response.data]);
            })
            .catch((error) => {
                console.error("API 호출 중 오류 발생:", error);
            });

        // 장바구니 데이터 가져오기
        getGoodsList()
            .then((response) => {
                console.log(response.data);
                const updateGoods = response.data.map(item => ({
                    ...item,
                    quantity: item.quantity,
                    selected: true
                }));
                setGoods(updateGoods);
            })
            .catch();
    }, []);

    useEffect(() => {
        updateTotalPrice();
        updateCheckBox();
        goodsRef.current = goods;
    }, [goods]);

    const selectGoods = (e) => {
        const index = e.target.getAttribute("goodsIndex");
        setGoods(prev =>
            prev.map((item, idx) =>
                idx === parseInt(index) ? { ...item, selected: !item.selected } : item
            )
        );
    }

    const updateTotalPrice = () => {
        let totalPrice = 0;

        goods.forEach((item) => {
            if (item.selected) {
                totalPrice += item.goodsPrice * item.quantity;
            }
        });

        setTotalPrice(totalPrice);
    }

    const updateCheckBox = () => {
        goods.forEach((item, index) => {
            const selectElement = document.getElementsByClassName("select_goods")[index];
            if (item.selected) {
                selectElement.style.backgroundImage = `url(${checkMark})`;
            } else {
                selectElement.style.backgroundImage = "";
            }
        });
    }

    const subQuantity = (e) => {
        const index = e.target.getAttribute("goodsIndex");
        setGoods(prev =>
            prev.map((item, idx) =>
                idx === parseInt(index) && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    }

    const addQuantity = (e) => {
        const index = e.target.getAttribute("goodsIndex");
        if (goods[index].goodsQuantity > goods[index].quantity) {
            setGoods(prev =>
                prev.map((item, idx) =>
                    idx === parseInt(index) ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            alert("재고가 부족합니다.");
        }

    }

    const selectAll = () => {
        setGoods(prev =>
            prev.map((item) => ({ ...item, selected: true }))
        );
        document.querySelectorAll(".select_goods").forEach((item) => {
            item.style.backgroundImage = `url(${checkMark})`;
        });
    }

    const deleteSelected = () => {
        deleteGoodsList(goods.filter(item => item.selected))
            .then(response => {
                const updatedGoods = goods.filter(item => !item.selected);
                setGoods(updatedGoods);
            });

    }

    const order = () => {
        const selectedGoods = goods.filter(item => item.selected);
        if (selectedGoods.length === 0) {
            alert("선택된 상품이 없습니다.");
            return;
        }

        if (!theaterData.includes(theaterRef.current.value)) {
            alert("올바른 영화관을 선택해주세요.");
            return;
        }

        cartQuantityUpdate();

        setOrderName(selectedGoods.length === 1
            ? selectedGoods[0].name
            : `${selectedGoods[0].name} 외 ${selectedGoods.length - 1}건`);

        const length = 25;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randomChars = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * length);
            randomChars += chars[randomIndex];
        }
        setOrderNumber(randomChars);

        const userInfoStr = sessionStorage.getItem("userInfo");
        const userInfo = JSON.parse(userInfoStr);
        console.log(accessToken);
        // axios로 주문 정보 서버에 저장
        axios.post("http://localhost:9988/order/save", {
            orderNumber: randomChars,
            totalPrice: totalPrice,
            userNo: userInfo.userNo,
            theaterName: theaterRef.current.value,
            goods: selectedGoods
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                if (response.data === "success") {
                    setPaymentModalOpen(true);
                } else {
                    setOrderNumber(response.data);
                    setPaymentModalOpen(true);
                }
            })
            .catch((error) => {
                alert("상품 정보 오류");
                console.log(error);
            });
    }

    const searchTheater = (e) => {
        const filtered = theaterData.filter((theater) =>
            theater.includes(e.target.value));
        setFilteredTheaters(filtered);
    }

    const selectTheater = (e) => {
        theaterRef.current.value = e.target.innerText;
    }

    if (loading) {
        return null;
    }

    return (
        <div className="cart_container">
            <div className="cart_list">
                <button id="back_button" onClick={() => window.history.back()}></button>
                <b id="cart_text">장바구니</b>
                <div className="table_container">
                    <div className="table_head">
                        <div className="check_image_container"><div id="check_image"></div></div>
                        <div className="goods_info">상품 정보</div>
                        <div className="goods_quantity">수량</div>
                        <div className="goods_price">가격</div>
                    </div>
                    <div className="goods_container">
                        {goods.length > 0 ? goods.map((element, index) => (
                            <div className="goods" key={element.goodsId}>
                                <div className="check_image_container">
                                    <div className="select_goods" onClick={selectGoods} goodsIndex={index} style={{ backgroundImage: `url(${checkMark})` }}></div>
                                </div>
                                <div className="goods_info" onClick={() => window.location.href = `/mdshop/${element.goodsNo}`}>
                                <img src={`http://192.168.1.252:9988/file-system/download/${element.imageIdList[0]}`}/>
                                    <span>{element.goodsName}</span>
                                </div>
                                <div className="goods_quantity">
                                    <button onClick={subQuantity} goodsIndex={index}>◀</button>
                                    {element.quantity}
                                    <button onClick={addQuantity} goodsIndex={index}>▶</button>
                                </div>
                                <div className="goods_price">
                                    {element.goodsPrice}원
                                </div>
                            </div>
                        )) : <div>장바구니가 비어있습니다.</div>}
                        <div className="button_container">
                            <div>
                                <button onClick={selectAll}>전체 선택</button>
                                <button onClick={deleteSelected}>선택 삭제</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="order_info_container">
                <p>결제 정보</p>
                <hr />
                <div className="order_info">
                    <div>
                        <div className="order_info_goods_label">상품 수</div>
                        <div className="order_info_goods_quantity">{goods.filter(item => item.selected).length}개</div>
                    </div>
                    <div>
                        <div className="order_info_goods_label">상품 금액</div>
                        <div className="order_info_goods_quantity">{totalPrice.toLocaleString()}원</div>
                    </div>
                    <hr />
                    <div>
                        <div className="order_info_goods_label">결제 금액</div>
                        <div className="order_info_goods_quantity">{totalPrice.toLocaleString()}원</div>
                    </div>
                    <hr />
                    <div style={{ position: 'relative' }}>
                        <div className="order_info_goods_label">수령 장소</div>
                        <div className="order_info_goods_quantity"><input type="text" id="theaterList" ref={theaterRef} placeholder="영화관 찾기" onChange={searchTheater} onFocus={() => setTheaterSuggestion(true)} onBlur={() => setTimeout(() => setTheaterSuggestion(false), 100)} /></div>
                        {theaterSuggestion &&
                            <div id="theaterSuggestion">
                                {filteredTheaters.length != 0 ? filteredTheaters.map((element, idx) => (
                                    <div key={idx} onClick={selectTheater}>{element}</div>
                                )) : <div>결과가 없습니다.</div>}

                            </div>
                        }
                    </div>
                    <button id="orderButton" onClick={order}>주문하기</button>
                </div>
            </div>

            <div>
                {
                    (paymentModalOpen) &&
                    <div>
                        <div className="modal_overlay"></div>
                        <div className="paymentModal_container">
                            <button onClick={() => setPaymentModalOpen(false)}>X</button>
                            <TossPayment
                                totalPrice={totalPrice}
                                orderName={orderName}
                                orderNumber={orderNumber}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Cart;