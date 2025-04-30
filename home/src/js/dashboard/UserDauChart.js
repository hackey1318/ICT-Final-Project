import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function UserDauChart({ chartTitle, chartDauList, totalCount, chartStyle  }){

    // 차트 설정
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${chartTitle} 활동인원수`,
            },
        },
        scales: {
            y: {
                min: 0,
                ticks: {
                    stepSize: 1, //간격
                }
            },
        },
        // aspectRatio: 2,
    };

    const labels = chartDauList.map(item => item.dateTime);
    const data = {
        labels,
        datasets: [
            {
                label: '활동인원수',
                data: chartDauList.map(item => item.count),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    return(
        <div style={chartStyle}>
            <Line options={options} data={data} />
            <div className="userdat-chart-totaluser">총인원수 : {totalCount}명</div>
        </div>
    )
}

export default UserDauChart;