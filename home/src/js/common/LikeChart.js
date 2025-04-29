import Chart from 'chart.js/auto';
import React, { useRef, useEffect } from 'react';

// 화면 크기 변경을 감지하는 커스텀 훅 (생략)

function LikeChart({ labels, data, chartId, style }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  // 1) HSL 기반으로 동적 색상 생성
  const backgroundColor = labels.map((_, i) => {
    const hue = Math.round((i * 360) / labels.length);
    return `hsl(${hue}, 60%, 80%)`;
  });
  const borderColor = labels.map((_, i) => {
    const hue = Math.round((i * 360) / labels.length);
    return `hsl(${hue}, 70%, 50%)`;
  });

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // 기존 차트가 있으면 파괴
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.parsed}건`
            }
          }
        }
      }
    });

    return () => { chartRef.current.destroy(); };
  }, [labels, data]); // labels나 data 바뀌면 재렌더

  return (
    <div style={{      position: 'relative',
        width: '100%',
        height: '300px',  // 기본 높이
        ...style          // 여기서 Dashboard/GoodsLikeChart 쪽에서 넘겨준 style 이 덮어쓴다
      }}>
      <canvas
        ref={canvasRef}
        id={chartId}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default LikeChart;