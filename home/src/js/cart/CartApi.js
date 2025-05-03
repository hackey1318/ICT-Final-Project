import axios from 'axios';
import Cart from './Cart';

export const addGoodsToCart = (id, quantity, act) => {
    const accessToken = sessionStorage.getItem("accessToken");
    return axios.get("http://localhost:9988/cart/addGoods", {
        params: {
            goodsId: id,
            goodsQuantity: quantity,
            act: act
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
};

export const getTheaterList = () => {  //영화관 전부의 정보 가져오게 수정하기
    const accessToken = sessionStorage.getItem("accessToken");
    return axios.post("http://localhost:9988/order/theaterList", {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    });
};

export const getGoodsList = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return axios.get("http://localhost:9988/cart/goods", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const deleteGoodsList = (e) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const goodsNoArray = e.map(item => item.goodsNo);
    return axios.post("http://localhost:9988/cart/deleteGoods",
        goodsNoArray,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )
}

export const updateCartQuantity = (data) => {
    const accessToken = sessionStorage.getItem("accessToken");
    return axios.post("http://localhost:9988/cart/updateQuantity", data, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};