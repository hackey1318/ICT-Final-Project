import apiClient from './../public/axiosConfig';

export const addGoodsToCart = (id, quantity, act) => {
    return apiClient.get("/cart/addGoods", {
        params: {
            goodsId: id,
            goodsQuantity: quantity,
            act: act
        }
    });
};

export const getTheaterList = () => {
    return apiClient.post("/order/theaterList", {});
};

export const getGoodsList = () => {
    return apiClient.get("/cart/goods")
}

export const deleteGoodsList = (e) => {
    const goodsNoArray = e.map(item => item.goodsNo);
    return apiClient.post("/cart/deleteGoods",
        goodsNoArray
    )
}

export const updateCartQuantity = (data) => {
    return apiClient.post("/cart/updateQuantity", data, );
};