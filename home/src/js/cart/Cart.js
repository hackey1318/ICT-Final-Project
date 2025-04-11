import { useEffect, useState } from 'react';
import '../../css/cart/Cart.css';
import checkMark from '../../img/checkMark.png';

function Cart() {

    const [goods, setGoods] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(0);

    // 테스트 데이터
    const test_goods_1 = {
        image: "https://img.danawa.com/prod_img/500000/185/173/img/49173185_1.jpg?shrink=130:130&_v=20250407171230",
        name: "스티치 인형",
        quantity: 1,
        price: 19440,
        selected: true
    }

    const test_goods_2 = {
        image: "https://img.danawa.com/prod_img/500000/443/941/img/6941443_1.jpg?shrink=130:130&_v=20181227122347",
        name: "묠니르 망치 스피커",
        quantity: 2,
        price: 328000,
        selected: true
    }

    const test_goods_3 = {
        image: "https://cimg.cowave.kr/image/vendor_inventory/e317/70193a0bcc148a37695d2780f84fee6caac3acc9321c9288dde86f3e9c48.jpeg",
        name: "주먹왕 랄프 피규어 세트",
        quantity: 3,
        price: 65890,
        selected: true
    }

    useEffect(() => {
        setGoods(prev => [...prev, test_goods_1]);
        setGoods(prev => [...prev, test_goods_2]);
        setGoods(prev => [...prev, test_goods_3]);
    }, []);

    const selectGoods = (e) => {
        const index = e.target.getAttribute("goodsIndex");

        setGoods(prev =>
            prev.map((item, idx) =>
                idx == index ? { ...item, selected: !(item.selected) } : item
            )
        );
    }

    useEffect(() => {
        updateTotalPrice();
        updateCheckBox();
        updateDeliveryCharge();
    }, [goods]);

    const updateTotalPrice = () => {
        let totalPrice = 0;

        goods.forEach((item) => {
            if (item.selected) {
                totalPrice += item.price * item.quantity;
            }
        });

        setTotalPrice(totalPrice);
    }

    const updateCheckBox = () => {
        goods.forEach((item, index) => {
            if (item.selected) {
                document.getElementsByClassName("select_goods")[index].style.backgroundImage = `url(${checkMark})`;
            } else {
                document.getElementsByClassName("select_goods")[index].style.backgroundImage = "";
            }
        })
    }

    const updateDeliveryCharge = () => {
        goods.filter((item) => item.selected).length === 0 ? setDeliveryCharge(0) : setDeliveryCharge(2500);
    }

    const subQuantity = (e) => {
        const index = e.target.getAttribute("goodsIndex");

        setGoods(prev =>
            prev.map((item, idx) =>
                (idx == index) && (item.quantity > 1) ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    }

    const addQuantity = (e) => {
        const index = e.target.getAttribute("goodsIndex");

        setGoods(prev =>
            prev.map((item, idx) =>
                (idx == index) ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    }

    const selectAll = (e) => {
        document.querySelectorAll(".select_goods").forEach((item) => {
            item.style.backgroundImage = `url(${checkMark})`;
        });

        setGoods(prev =>
            prev.map((item) =>
                !item.selected ? { ...item, selected: true } : item
            )
        );
    }

    const deleteSelected = () => {
        const updateGoods = goods.filter(item => !item.selected);
        setGoods(updateGoods);
    }

    const order = () => {
        const selectedGoods = goods.filter(item => item.selected);
        if (selectedGoods.length === 0 ) {
            alert("선택된 상품이 없습니다.");
            return;
        }

        // axios 주문 구현 부분
        console.log(selectedGoods);
        console.log(totalPrice + deliveryCharge);
    }

    return (
        <div className="cart_container">
            <div className="cart_list">
                <div>
                    <button id="back_button" onClick={() => window.history.back()}></button>
                </div>
                <b id="cart_text">장바구니</b>
                <div className="table_container">
                    <div className="table_head">
                        <div className="check_image_container"><div id="check_image"></div></div>
                        <div className="goods_info">&nbsp;&nbsp;상품 정보</div>
                        <div className="goods_quantity">수량</div>
                        <div className="goods_price">가격</div>
                    </div>
                    <div className="goods_container">
                        {goods.length > 0 ? (<div>
                            {goods.map((element, index) => {
                                return (
                                    <div className="goods">
                                        <div className="check_image_container">
                                            <div className="select_goods" onClick={selectGoods} goodsIndex={index} style={{ backgroundImage: `url(${checkMark})` }}></div>
                                        </div>
                                        <div className="goods_info">
                                            <div>
                                                <img src={element.image} />
                                                <span>{element.name}</span>
                                            </div>
                                        </div>
                                        <div className="goods_quantity">
                                            <button onClick={subQuantity} goodsIndex={index}>◀</button>
                                            {element.quantity}
                                            <button onClick={addQuantity} goodsIndex={index}>▶</button>

                                        </div>
                                        <div className="goods_price">
                                            {element.price.toLocaleString() + "원"}
                                        </div>
                                    </div>)
                            })}
                        </div>) : (<div>장바구니가 비어있습니다.</div>)}
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
                <hr/>
                <div className="order_info">
                    <div>
                        <div className="order_info_goods_label">상품 수</div>
                        <div className="order_info_goods_quantity">{goods.filter(item => item.selected).length + "개"}</div>
                    </div>
                    <div>
                        <div className="order_info_goods_label">상품 금액</div>
                        <div className="order_info_goods_quantity">{totalPrice.toLocaleString() + "원"}</div>
                    </div>
                    <div>
                        <div className="order_info_goods_label">배송비</div>
                        <div className="order_info_goods_quantity">{deliveryCharge.toLocaleString() + "원"}</div>
                    </div>
                    <hr/>
                    <div>
                        <div className="order_info_goods_label">결제 금액</div>
                        <div className="order_info_goods_quantity"></div>
                        <div className="order_info_goods_quantity">{(totalPrice + deliveryCharge).toLocaleString() + "원"}</div>
                    </div>
                    <button id="orderButton" onClick={order}>주문하기</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;