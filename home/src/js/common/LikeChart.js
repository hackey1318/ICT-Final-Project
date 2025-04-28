import Chart from 'chart.js/auto';
import React, { useRef, useEffect, useState } from 'react';

// 화면 크기 변경을 감지하는 커스텀 훅
function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

function LikeChart({ labels, data, chartId }) {
    const maxItems = 5;
    const limitedLabels = labels.slice(0, maxItems);
    const limitedData = data.slice(0, maxItems);

    // 색상 배열 (5개 색상만 제공)
    const chartColors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"
    ];

    // 차트 데이터 설정
    const chartData = {
        labels: limitedLabels,
        datasets: [{
            data: limitedData,
            backgroundColor: chartColors.slice(0, limitedData.length), // 데이터 개수만큼 색상 할당
            borderWidth: 1
        }]
    };

    // 차트 옵션 설정
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.raw + ' Likes';  // 툴팁에 표시할 내용
                    }
                }
            }
        }
    };

    // 화면 크기 받아오기
    const { width, height } = useWindowDimensions();

    // ref로 canvas 엘리먼트에 접근
    const canvasRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        // 기존 차트 인스턴스가 있다면 파괴
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // 차트 인스턴스 생성
        const ctx = canvas.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
            type: 'pie',  // 원형 차트
            data: chartData,
            options: options
        });

        // 컴포넌트 언마운트 시 차트 인스턴스 파괴
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [limitedLabels, limitedData]); // 데이터나 라벨이 바뀌면 차트를 다시 렌더링

    // 화면 크기에 따라 차트의 크기 조정 (비율로)
    const chartWidth = width * 0.3;  // 화면의 30% 너비로 설정
    const chartHeight = chartWidth;  // 비율에 맞춰 높이 설정

    return (
        <div 
            style={{ 
                width: chartWidth, 
                height: chartHeight, 
                margin: '0 auto' 
            }}
        >  
            <canvas
                ref={canvasRef}
                id={chartId}
                style={{ display: 'block', width: '100%', height: '100%' }}  // 화면 크기에 맞춰 100% 크기
            ></canvas>
        </div>
    );
}

export default LikeChart;
