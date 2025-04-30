import axios from "axios";
import { useEffect, useState } from "react";
import './../../css/md/MdSales.css';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

function MdSales() {
    const [salesList, setSalesList] = useState([]);
    const [groupedByGoodsName, setGroupByGoodsName] = useState();
    const [resultByGoodsName, setResultByGoodsName] = useState();
    const [resultByGoodsNameState, setResultByGoodsNameState] = useState("table");
    const [groupedByGoodsType, setGroupByGoodsType] = useState();
    const [resultByGoodsType, setResultByGoodsType] = useState();
    const [resultByGoodsTypeState, setResultByGoodsTypeState] = useState("table");
    const [resultByGenderState, setResultByGenderState] = useState("table");

    const [groupedByDate, setGroupedByDate] = useState();
    const [resultByDate, setResultByDate] = useState();
    const [resultByDateState, setResultByDateState] = useState("table");

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

            const groupByType = salesList.reduce((acc, item, idx) => {
                const key = item.type;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            }, {});
            setGroupByGoodsType(groupByType);

            const groupByDate = salesList.reduce((acc, item) => {
                const key = item.updatedAt.substring(0, 10);
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            }, {});
            setGroupedByDate(groupByDate);
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
                let price = 0;

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
                    if (price === 0) {
                        price = element.price;
                    }
                });
                return { goodsName: item, totalPaidQuantity: paidQuantity, totalCancelledQuantity: cancelledQuantity, totalMaleCount: maleCount, totalFemaleCount: femaleCount, price: price }
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
                let totalSale = 0;

                groupedByGoodsType[item].forEach(element => {
                    if (element.ordersStatus === "PAID") {
                        paidQuantity += element.quantity;
                        totalSale += element.quantity * element.price;
                        if (element.userGender === "MALE") {
                            maleCount += element.quantity;
                        } else {
                            femaleCount += element.quantity;
                        }
                    } else if (element.ordersStatus === "CANCELLED") {
                        cancelledQuantity += element.quantity;
                    }
                });
                return { goodsType: item, totalPaidQuantity: paidQuantity, totalCancelledQuantity: cancelledQuantity, totalMaleCount: maleCount, totalFemaleCount: femaleCount, totalSale: totalSale }
            });
            setResultByGoodsType(resultByGoodsTypeArr);
        }
    }, [groupedByGoodsType]);

    useEffect(() => {
        if (groupedByDate !== undefined) {
            const resultByDateArr_1 = Object.keys(groupedByDate).map(item => {
                let totalSale = 0;
                let totalCancel = 0;

                groupedByDate[item].forEach(element => {
                    if (element.ordersStatus === "PAID") {
                        totalSale += element.quantity * element.price;
                    } else if (element.ordersStatus === "CANCELLED") {
                        totalCancel += element.quantity * element.price;
                    }
                });
                return { date: item, totalSale: totalSale, totalCancel: totalCancel }
            });

            let accSales = 0;
            const resultByDateArr_2 = resultByDateArr_1.map((item) => {
                accSales += item.totalSale;
                return { ...item, accSales: accSales }
            })
            setResultByDate(resultByDateArr_2);
        }
    }, [groupedByDate])


    useEffect(() => {
        // console.log(resultByGoodsName);
    }, [resultByGoodsName])

    useEffect(() => {
        // console.log(resultByGoodsType);
    }, [resultByGoodsType])

    useEffect(() => {
        console.log(resultByDate)
    }, [resultByDate])

    if (!resultByGoodsName || resultByGoodsName.length === 0) {
        return null;
    }

    const handleTitleButton = (tag, buttonName) => {
        if (tag === "byGoodsName") {
            setResultByGoodsNameState(buttonName);
        } else if (tag === "byGoodsType") {
            setResultByGoodsTypeState(buttonName);
        } else if (tag === "byGender") {
            setResultByGenderState(buttonName);
        } else if (tag === "byDate") {
            setResultByDateState(buttonName);
        }
    }

    // name차트
    const nameChartHeight = resultByGoodsName.length * 75;

    const nameOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                enabled: true,
                anchor: 'end',
                align: 'end',
                font: {
                    size: 12,
                },
                color: 'gray'
            }
        },

        scales: {
            x: {
                stacked: false,
                min: 0,
            },
            y: {
                stacked: false,
                ticks: {
                    beginAtZero: true,
                },
                grid: {
                    display: false,
                },
            },
        },
        elements: {
            bar: {
                barThickness: 10,
            },
        },

        layout: {
            padding: {
                left: 10,
                right: 50,
            },
        },
        datasets: {
            bar: {
                categoryPercentage: 0.5,
                barPercentage: 0.8
            },
        },
    };

    const nameData = {
        labels: resultByGoodsName.map(item => item.goodsName),
        datasets: [
            {
                label: '판매량',
                data: resultByGoodsName.map(item => item.totalPaidQuantity),
                backgroundColor: 'rgb(139, 170, 255)',
            },
            {
                label: '취소량',
                data: resultByGoodsName.map(item => item.totalCancelledQuantity),
                backgroundColor: 'rgb(255, 191, 191)',
            }
        ],
    };

    // type차트
    const typeChartHeight = resultByGoodsType.length * 75;

    const typeOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                enabled: true,
                anchor: 'end',
                align: 'end',
                font: {
                    size: 12,
                },
                color: 'gray'
            }
        },

        scales: {
            x: {
                stacked: false,
                min: 0,
            },
            y: {
                stacked: false,
                ticks: {
                    beginAtZero: true,
                },
                grid: {
                    display: false,
                },
            },
        },
        elements: {
            bar: {
                barThickness: 10,
            },
        },

        layout: {
            padding: {
                left: 10,
                right: 50,
            },
        },
        datasets: {
            bar: {
                categoryPercentage: 0.5,
                barPercentage: 0.8
            },
        },
    };

    const typeData = {
        labels: resultByGoodsType.map(item => item.goodsType),
        datasets: [
            {
                label: '판매량',
                data: resultByGoodsType.map(item => item.totalPaidQuantity),
                backgroundColor: 'rgb(139, 170, 255)',
            },
            {
                label: '취소량',
                data: resultByGoodsType.map(item => item.totalCancelledQuantity),
                backgroundColor: 'rgb(255, 191, 191)',
            }
        ],
    };

    // gender차트
    const genderChartHeight = resultByGoodsName.length * 75;

    const genderOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                enabled: true,
                anchor: 'end',
                align: 'end',
                font: {
                    size: 12,
                },
                color: 'gray'
            }
        },

        scales: {
            x: {
                stacked: false,
                min: 0,
            },
            y: {
                stacked: false,
                ticks: {
                    beginAtZero: true,
                },
                grid: {
                    display: false,
                },
            },
        },
        elements: {
            bar: {
                barThickness: 10,
            },
        },

        layout: {
            padding: {
                left: 10,
                right: 50,
            },
        },
        datasets: {
            bar: {
                categoryPercentage: 0.5,
                barPercentage: 0.8
            },
        },
    };

    const genderData = {
        labels: resultByGoodsName.map(item => item.goodsName),
        datasets: [
            {
                label: '남성',
                data: resultByGoodsName.map(item => item.totalMaleCount),
                backgroundColor: 'rgb(139, 170, 255)',
            },
            {
                label: '여성',
                data: resultByGoodsName.map(item => item.totalFemaleCount),
                backgroundColor: 'rgb(255, 191, 191)',
            }
        ],
    };

    // resultByGoodsType.forEach(typeItem => {
    //     genderData.labels.push("[종류] " + typeItem.goodsType);
    //     genderData.datasets[0].data.push(typeItem.totalMaleCount);
    //     genderData.datasets[1].data.push(typeItem.totalFemaleCount);
    // })


    // date차트
    const dateChartHeight = resultByGoodsName.length * 75;

    const dateOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                enabled: true,
                anchor: 'end',
                align: 'end',
                font: {
                    size: 12,
                },
                color: 'gray',
                formatter: function(value) {
                    const formatter = new Intl.NumberFormat('ko-KR');
                    return formatter.format(value);
                }
            }
        },

        scales: {
            x: {
                stacked: false,
                min: 0,
            },
            y: {
                stacked: false,
                ticks: {
                    beginAtZero: true,
                },
                grid: {
                    display: false,
                },
            },
        },
        elements: {
            bar: {
                barThickness: 10,
            },
        },

        layout: {
            padding: {
                left: 10,
                right: 50,
            },
        },
        datasets: {
            bar: {
                categoryPercentage: 0.5,
                barPercentage: 0.8
            },
        },
    };

    const dateData = {
        labels: resultByDate.slice().reverse().map(item => item.date),
        datasets: [
            {
                label: '매출',
                data: resultByDate.slice().reverse().map(item => item.totalSale),
                backgroundColor: 'rgb(201, 201, 201)',
            }
        ],
    };

    return (
        <div className="mdSales_wrapper">
            <div><h2>매출 관리</h2></div>
            <div className="mdSales_container">
                <div className="mdSales_byGoodsName">
                    <div className="mdSales_title">
                        <h4 className="mdSales_category">상품</h4>
                        <div className="mdSales_buttons">
                            <button className="mdSales_button_table" onClick={() => handleTitleButton("byGoodsName", "table")}></button>
                            <button className="mdSales_button_chart" onClick={() => handleTitleButton("byGoodsName", "chart")}></button>
                        </div>
                    </div>
                    <div className="mdSales_content">
                        {resultByGoodsNameState === "table" &&
                            <div className="mdSales_content_byName">
                                <div><b>상품명</b></div>
                                <div><b>판매량</b></div>
                                <div><b>가격</b></div>
                                <div><b>매출</b></div>
                                <div><b>취소량</b></div>
                                <div><b>취소율</b></div>
                            </div>}
                        {resultByGoodsNameState === "table" &&
                            resultByGoodsName.map((element) => {
                                return (
                                    <div className="mdSales_content_byName">
                                        <div>{element.goodsName}</div>
                                        <div>{element.totalPaidQuantity}</div>
                                        <div>{element.price.toLocaleString()}원</div>
                                        <div>{(element.price * element.totalPaidQuantity).toLocaleString()}원</div>
                                        <div>{element.totalCancelledQuantity}</div>
                                        <div>{((element.totalCancelledQuantity / (element.totalCancelledQuantity + element.totalPaidQuantity)) * 100).toFixed(2)}%</div>
                                    </div>
                                )
                            })}
                        {resultByGoodsNameState === "chart" &&
                            <div className="mdSales_chart">
                                <Bar options={nameOptions} data={nameData} style={{ height: `${nameChartHeight}px` }} />
                            </div>}
                    </div>
                </div>
                <div className="mdSales_byGoodsType">
                    <div className="mdSales_title">
                        <h4 className="mdSales_category">종류</h4>
                        <div className="mdSales_buttons">
                            <button className="mdSales_button_table" onClick={() => handleTitleButton("byGoodsType", "table")}></button>
                            <button className="mdSales_button_chart" onClick={() => handleTitleButton("byGoodsType", "chart")}></button>
                        </div>
                    </div>
                    <div className="mdSales_content">
                        {resultByGoodsTypeState === "table" &&
                            <div className="mdSales_content_byType">
                                <div><b>상품종류</b></div>
                                <div><b>판매량</b></div>
                                <div><b>매출</b></div>
                                <div><b>취소량</b></div>
                                <div><b>취소율</b></div>
                            </div>}
                        {resultByGoodsTypeState === "table" &&
                            resultByGoodsType.map((element) => {
                                return (
                                    <div className="mdSales_content_byType">
                                        <div>{element.goodsType}</div>
                                        <div>{element.totalPaidQuantity}</div>
                                        <div>{element.totalSale.toLocaleString()}원</div>
                                        <div>{element.totalCancelledQuantity}</div>
                                        <div>{((element.totalCancelledQuantity / (element.totalCancelledQuantity + element.totalPaidQuantity)) * 100).toFixed(2)}%</div>
                                    </div>
                                )
                            })}
                        {resultByGoodsTypeState === "chart" &&
                            <div className="mdSales_chart">
                                <Bar options={typeOptions} data={typeData} style={{ height: `${typeChartHeight}px` }} />
                            </div>}
                    </div>
                </div>
                <div className="mdSales_byGender">
                    <div className="mdSales_title">
                        <h4 className="mdSales_category">성별</h4>
                        <div className="mdSales_buttons">
                            <button className="mdSales_button_table" onClick={() => handleTitleButton("byGender", "table")}></button>
                            <button className="mdSales_button_chart" onClick={() => handleTitleButton("byGender", "chart")}></button>
                        </div>
                    </div>
                    <div className="mdSales_content">
                        {resultByGenderState === "table" &&
                            <div className="mdSales_content_byGender">
                                <div><b>상품명</b></div>
                                <div><b>남성 구매량</b></div>
                                <div><b>여성 구매량</b></div>
                            </div>}
                        {resultByGenderState === "table" &&
                            resultByGoodsName.map((element) => {
                                return (
                                    <div className="mdSales_content_byGender">
                                        <div>{element.goodsName}</div>
                                        <div>{element.totalMaleCount}</div>
                                        <div>{element.totalFemaleCount}</div>
                                    </div>
                                )
                            })}
                        {/* {resultByGenderState === "table" &&
                            resultByGoodsType.map((element) => {
                                return (
                                    <div className="mdSales_element">
                                        <div>[종류]{element.goodsType}</div>
                                        <div>{element.totalMaleCount}</div>
                                        <div>{element.totalFemaleCount}</div>
                                    </div>
                                )
                            })} */}
                        {resultByGenderState === "chart" &&
                            <div className="mdSales_chart">
                                <Bar options={genderOptions} data={genderData} style={{ height: `${genderChartHeight}px` }} />
                            </div>}
                    </div>
                </div>
                <div className="mdSales_byDate">
                    <div className="mdSales_title">
                        <h4 className="mdSales_category">날짜</h4>
                        <div className="mdSales_buttons">
                            <button className="mdSales_button_table" onClick={() => handleTitleButton("byDate", "table")}></button>
                            <button className="mdSales_button_chart" onClick={() => handleTitleButton("byDate", "chart")}></button>
                        </div>
                    </div>
                    <div className="mdSales_content">
                        {resultByDateState === "table" &&
                            <div className="mdSales_content_byDate">
                                <div><b>날짜</b></div>
                                <div><b>매출량</b></div>
                                <div><b>누적매출</b></div>

                            </div>}
                        {resultByDateState === "table" &&
                            resultByDate.slice().reverse().map((element) => {
                                return (
                                    <div className="mdSales_content_byDate">
                                        <div>{element.date}</div>
                                        <div>{element.totalSale.toLocaleString()}원</div>
                                        <div>{element.accSales.toLocaleString()}원</div>
                                    </div>
                                )
                            })}
                        {resultByDateState === "chart" &&
                            <div className="mdSales_chart">
                            <Bar options={dateOptions} data={dateData} style={{ height: `${dateChartHeight}px` }} />
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MdSales;