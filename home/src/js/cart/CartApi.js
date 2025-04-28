import axios from 'axios';
import Cart from './Cart';

export const addGoodsToCart = (id, quantity, act) => {
    const accessToken = sessionStorage.getItem("accessToken");
    return axios.get("/cart/addGoods", {
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
    const accessToken = sessionStorage.getItem("accessToken");
    return axios.post("/order/theaterList", {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    });
};

export const getGoodsList = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return axios.get("/cart/goods", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

export const deleteGoodsList = (e) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const goodsNoArray = e.map(item => item.goodsNo);
    return axios.post("/cart/deleteGoods",
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
    return axios.post("/cart/updateQuantity", data, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
};