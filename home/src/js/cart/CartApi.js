import axios from 'axios';
import Cart from './Cart';
const accessToken = sessionStorage.getItem("accessToken");

export const addGoodsToCart = (id, quantity, act) => {
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

export const getTheaterList = () => {
    return axios.post("http://localhost:9988/order/theaterList", {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    });
};

export const getGoodsList = () => {
    return axios.get("http://localhost:9988/cart/goods", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const deleteGoodsList = (e) => {
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