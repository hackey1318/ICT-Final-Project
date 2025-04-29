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

function SalesChart({ salesData }) {

    const paidSalesByGoods = salesData.reduce((acc, item) => {
        if (item.ordersStatus !== 'PAID') return acc;

        const key = item.goodsName;
        const salesAmount = item.price * item.quantity;

        if (!acc[key]) {
            acc[key] = {
                goodsName: key,
                totalSales: salesAmount
            };
        } else {
            acc[key].totalSales += salesAmount;
        }

        return acc;
    }, {})

    console.log(paidSalesByGoods);

    const chartOptions = {
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
                formatter: (value) => {
                    return value.toLocaleString() + "원";
                },
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

    const chartData = {
        labels: Object.keys(paidSalesByGoods),
        datasets: [
            {
                label: '판매량',
                data: Object.values(paidSalesByGoods).map(item => item.totalSales),
                backgroundColor: 'rgb(139, 170, 255)',
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: `${Object.keys(paidSalesByGoods).length * 50}px` }}>
            <Bar options={chartOptions} data={chartData} />
        </div>)

}

export default SalesChart;