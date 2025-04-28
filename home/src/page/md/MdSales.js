import axios from "axios";
import { useEffect, useState } from "react";

function MdSales() {

    const [salesList, setSalesList] = useState([]);
    const [groupedByGoodsName, setGroupByGoodsName] = useState();
    const [resultByGoodsName, setResultByGoodsName] = useState();
    const [groupedByGoodsType, setGroupByGoodsType] = useState();
    const [resultByGoodsType, setResultByGoodsType] = useState();

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        axios.post("http://localhost:9988/md-shop/totalList",
            {

            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(response => {
                setSalesList(response.data);
            });
    }, []);

    useEffect(() => {
        if (Array.isArray(salesList)) {
            const groupByGoodsName = salesList.reduce((acc, item) => {
                const key = item.goodsName;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            }, {});
            setGroupByGoodsName(groupByGoodsName);
            console.log("1");

            const groupByType = salesList.reduce((acc, item, idx) => {
                const key = item.type;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            }, {});
            setGroupByGoodsType(groupByType);
            console.log("2");
        }
        console.log(salesList);
    }, [salesList]);

    useEffect(() => {
        if (groupedByGoodsName !== undefined) {
            const resultByGoodsNameArr = Object.keys(groupedByGoodsName).map(item => {
                let paidQuantity = 0;
                let cancelledQuantity = 0;
                let maleCount = 0;
                let femaleCount = 0;

                groupedByGoodsName[item].forEach(element => {
                    if (element.ordersStatus === "PAID") {
                        paidQuantity += element.quantity;
                        if (element.userGender === "MALE") {
                            maleCount += element.quantity;
                        } else {
                            femaleCount += element.quantity;
                        }
                    } else if (element.ordersStatus === "CANCELLED") {
                        cancelledQuantity += element.quantity;
                    }
                });
                return { goodsName: item, totalPaidQuantity: paidQuantity, totalCancelledQuantity: cancelledQuantity, totalMaleCount: maleCount, totalFemaleCount: femaleCount }
            });

            setResultByGoodsName(resultByGoodsNameArr);
        }
    }, [groupedByGoodsName]);

    useEffect(() => {
        if (groupedByGoodsType !== undefined) {
            const resultByGoodsTypeArr = Object.keys(groupedByGoodsType).map(item => {
                let paidQuantity = 0;
                let cancelledQuantity = 0;
                let maleCount = 0;
                let femaleCount = 0;

                groupedByGoodsType[item].forEach(element => {
                    if (element.ordersStatus === "PAID") {
                        paidQuantity += element.quantity;
                        if (element.userGender === "MALE") {
                            maleCount += element.quantity;
                        } else {
                            femaleCount += element.quantity;
                        }
                    } else if (element.ordersStatus === "CANCELLED") {
                        cancelledQuantity += element.quantity;
                    }
                });
                return { goodsType: item, totalPaidQuantity: paidQuantity, totalCancelledQuantity: cancelledQuantity, totalMaleCount: maleCount, totalFemaleCount: femaleCount}
            });
            setResultByGoodsType(resultByGoodsTypeArr);
        }
    }, [groupedByGoodsType]);


    useEffect(() => {
        // console.log(resultByGoodsName);
    }, [resultByGoodsName])

    useEffect(() => {
        console.log(resultByGoodsType);
    }, [resultByGoodsType])

    if (!resultByGoodsName || resultByGoodsName.length === 0) {
        return null;
    }

    return (
        <div>
            <div>
                {resultByGoodsName[0].goodsName}
            </div>
        </div>
    )
}

export default MdSales;