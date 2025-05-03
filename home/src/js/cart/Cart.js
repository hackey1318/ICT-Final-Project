import { useEffect, useRef, useState } from 'react';
import '../../css/cart/Cart.css';
import checkMark from '../../img/checkMark.png';
import axios from 'axios';
import TossPayment from "./../payment/TossPayment";
import { deleteGoodsList, getGoodsList, getTheaterList } from "./CartApi";
import KakaoMap from '../api/KakaoMap';

function Cart() {
    const [goods, setGoods] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderName, setOrderName] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [theaterSuggestion, setTheaterSuggestion] = useState(false);
    const [theaterData, setTheaterData] = useState([]);
    const [filteredTheaters, setFilteredTheaters] = useState([]);
    const [theaterName, setTheaterName] = useState('');
    const theaterRef = useRef();
    const goodsRef = useRef(goods);
    const [isAllSelected, setIsAllSelected] = useState(true);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (window.location.pathname === "/cart") {
                cartQuantityUpdate();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            cartQuantityUpdate();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const cartQuantityUpdate = () => {
        const accessToken = sessionStorage.getItem("accessToken");
        axios.post("http://localhost:9988/cart/updateQuantity", {
            goodsNos: goodsRef.current.map(element => element.goodsNo),
            goodsQuantities: goodsRef.current.map(element => element.quantity),
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            sessionStorage.setItem("redirectAfterLoginPath", window.location.href);
            window.location.href = "/login";
            return;
        }

        Promise.all([getTheaterList(), getGoodsList()])
            .then(([theaterResponse, goodsResponse]) => {
                setTheaterData(theaterResponse.data);
                setFilteredTheaters(theaterResponse.data);

                const updateGoods = goodsResponse.data.map(item => ({
                    ...item,
                    quantity: item.goodsQuantity === 0 ? 0 : item.quantity,
                    selected: item.quantity !== 0
                }));
                setGoods(updateGoods);
            })
            .catch(error => console.error("초기 데이터 호출 오류:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        updateTotalPrice();
        updateCheckBox();
        updateButton();
        goodsRef.current = goods;
        console.log(goodsRef);
    }, [goods]);

    const selectGoods = (e) => {
        const index = e.target.getAttribute("goodsindex");
        setGoods(prev =>
            prev.map((item, idx) =>
                idx === parseInt(index) ? { ...item, selected: item.quantity !== 0 ? !item.selected : item.selected } : item
            )
        );
    }

    const updateTotalPrice = () => {
        let total = 0;
        goods.forEach((item) => {
            if (item.selected) {
                total += item.goodsPrice * item.quantity;
            }
        });
        setTotalPrice(total);
    }

    const updateCheckBox = () => {
        const elements = document.getElementsByClassName("select_goods");
        goods.forEach((item, index) => {
            if (elements[index]) {
                elements[index].style.backgroundImage = item.selected && item.quantity !== 0 ? `url(${checkMark})` : "";
            }
        });
    }

    const updateButton = () => {
        let selectedAllChecked = true;
        goods.forEach((item) => {
            if (item.quantity === 0) {
                return;
            }

            if (!item.selected) {
                selectedAllChecked = false;
                setIsAllSelected(selectedAllChecked);
                return;
            }
        })
        setIsAllSelected(selectedAllChecked);
    }

    const subQuantity = (e) => {
        const index = e.target.getAttribute("goodsindex");
        setGoods(prev =>
            prev.map((item, idx) =>
                idx === parseInt(index) && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    }

    const addQuantity = (e) => {
        const index = e.target.getAttribute("goodsindex");
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
        if (!isAllSelected) {
            setGoods(prev =>
                prev.map(item => ({ ...item, selected: item.quantity !== 0 }))
            );
        } else {
            setGoods(prev =>
                prev.map(item => ({ ...item, selected: false }))
            );
        }

    }

    const deleteSelected = () => {
        const selectedGoods = goods.filter(item => item.selected);
        if (selectedGoods.length === 0) {
            alert("선택된 상품이 없습니다.");
            return;
        }

        deleteGoodsList(selectedGoods)
            .then(() => {
                const updatedGoods = goods.filter(item => !item.selected);
                setGoods(updatedGoods);
            });
    }

    const deleteGoods = (e) => {
        const targetIndex = parseInt(e.target.getAttribute("index"), 10);
        if (window.confirm("상품을 삭제하시겠습니까?")) {
            const deleteItem = goods.filter((_, index) => index === targetIndex);
            deleteGoodsList(deleteItem)
                .then(() => {
                    const updatedGoods = goods.filter((_, index) => index !== targetIndex);
                    setGoods(updatedGoods);
                });
        }
    }

    const order = () => {
        const accessToken = sessionStorage.getItem("accessToken");
        const selectedGoods = goods.filter(item => item.selected);

        if (selectedGoods.length === 0) {
            alert("선택된 상품이 없습니다.");
            return;
        }

        if (!theaterData.includes(theaterName)) {
            alert("올바른 영화관을 선택해주세요.");
            return;
        }

        cartQuantityUpdate();

        const generatedOrderName = selectedGoods.length === 1
            ? selectedGoods[0].goodsName
            : `${selectedGoods[0].goodsName} 외 ${selectedGoods.length - 1}건`;

        const generatedOrderNumber = [...Array(25)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("");

        setOrderName(generatedOrderName);
        setOrderNumber(generatedOrderNumber);

        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

        axios.post("http://localhost:9988/order/save", {
            orderNumber: generatedOrderNumber,
            totalPrice: totalPrice,
            userNo: userInfo.userNo,
            theaterName: theaterName,
            goods: selectedGoods
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                if (response.data !== "success" && response.data !== "fail") { // 기존 주문번호 존재할 경우
                    setOrderNumber(response.data);
                }

                if (response.data === "fail") {
                    alert("상품 정보 오류");
                    return;
                }

                setPaymentModalOpen(true);
            })
            .catch(() => {
                alert("상품 정보 오류");
            });
    }

    const searchTheater = () => {
        const keyword = theaterName.toLowerCase();  // 소문자로 변환하여 필터링
        const filtered = theaterData.filter(theater =>
            theater.name.toLowerCase().includes(keyword.toLowerCase())  // 입력된 키워드를 포함하는 영화관만 필터링
        );
        setFilteredTheaters(filtered);
    };

    const handleBlur = () => {
        // onBlur가 실행될 때 딜레이를 주어서 목록에서 항목을 클릭한 경우에 목록이 바로 닫히지 않도록 설정
        setTimeout(() => setTheaterSuggestion(false), 100);
    };

    const handleFocus = () => {
        // Focus 시 리스트를 다시 열도록
        setTheaterSuggestion(true);
        searchTheater();
    };

    const handleChange = (e) => {
        setTheaterName(e.target.value);  // 입력 값 업데이트
    };

    useEffect(() => {
        if (theaterName.trim() !== "") {
            searchTheater();
        } else {
            setFilteredTheaters([]); // 검색어가 비었을 때 결과를 비워둡니다.
        }
    }, [theaterName]);  // theaterName 값이 변경될 때마다 필터링

    const selectTheater = (name) => {
        setTheaterName(name);  // 선택한 영화관 이름을 상태로 저장
        setTheaterSuggestion(false); // 제안 목록을 선택한 후 바로 닫기
    };

    if (loading) {
        return null;
    }

    return (
        <div className="cart_container">
            <div className="cart_list">
                <button id="back_button" onClick={() => window.history.back()}></button>
                <p>
                    <b id="cart_text">장바구니</b>
                </p>
                <div className="table_container">
                    <div className="table_head">
                        <div className="check_image_container"><div id="check_image"></div></div>
                        <div className="goods_info">상품 정보</div>
                        <div className="goods_quantity">수량</div>
                        <div className="goods_price">가격</div>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    </div>
                    <div className="goods_container">
                        {goods.length > 0 ? goods.map((element, index) => (
                            <div className="goods" key={element.goodsNo}>
                                <div className="check_image_container">
                                    <div
                                        className="select_goods"
                                        onClick={selectGoods}
                                        goodsindex={index}
                                        style={{ backgroundImage: element.selected && element.quantity !== 0 ? `url(${checkMark})` : "" }}
                                    ></div>
                                </div>
                                <div className="goods_info" onClick={() => window.location.href = `/mdshop/${element.goodsNo}`}>
                                    <img src={`http://192.168.1.252:9988/file-system/download/${element.imageIdList[0]}`} alt="상품" />
                                    <span>{element.goodsName}</span>
                                    {element.goodsQuantity === 0 && <span style={{ color: 'red' }}>&nbsp;품절된 상품입니다.</span>}
                                </div>
                                <div className="goods_quantity">
                                    <button onClick={subQuantity} goodsindex={index}>◀</button>
                                    {element.goodsQuantity === 0 ? 0 : element.quantity}
                                    <button onClick={addQuantity} goodsindex={index}>▶</button>
                                </div>
                                <div className="goods_price">
                                    {element.goodsPrice.toLocaleString()}원
                                </div>
                                <div className="goods_delete_button">
                                    <div onClick={deleteGoods} index={index}>×</div>
                                </div>
                            </div>
                        )) : (
                            <div id="empty_cart_container">
                                <div id="empty_cart_img"></div>
                                <div id="empty_cart_desc">장바구니가 비어있습니다.</div>
                            </div>
                        )}
                        <div className="button_container">
                            <div>
                                <button onClick={selectAll}>{isAllSelected ? "전체 해제" : "전체 선택"}</button>
                                <button onClick={deleteSelected}>선택 삭제</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`order_info_container ${theaterName.trim() ? 'expanded' : ''}`}>
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
                        <div className="order_info_goods_quantity">
                            <input
                                type="text"
                                id="theaterList"
                                // ref={theaterRef}
                                placeholder="영화관 찾기"
                                onChange={handleChange}  // onChange를 `handleChange`로 설정
                                value={theaterName}
                                onFocus={handleFocus}  // Focus 시 리스트 갱신
                                onBlur={handleBlur}  // Blur 시 리스트 닫기
                            />
                        </div>
                        {theaterSuggestion && (
                            <div id="theaterSuggestion">
                                {filteredTheaters.length !== 0 ? filteredTheaters.map((theater, idx) => (
                                    <div key={idx} onMouseDown={() => selectTheater(theater.name)} style={{ cursor: 'pointer' }}>{theater.name}</div>
                                )) : <div>결과가 없습니다.</div>}
                            </div>
                        )}

                    </div>
                    <button id="orderButton" onClick={order}>주문하기</button>
                </div>
                {theaterName.trim() !== "" && (
                    <span>
                        <label style={{marginTop:'20px', fontSize:'0.9em'}}>영화관 위치({theaterName})</label>
                        <KakaoMap theaterName={theaterName} />
                    </span>
                )}
            </div>

            {paymentModalOpen && (
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
            )}
        </div>
    );
}

export default Cart;