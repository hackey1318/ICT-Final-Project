import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function GenderChart({ data }){
    
    //파이차트
    const dataSet = {
        labels: ['남', '여'],
        datasets: [
          {
            label: '인원',
            data: [data.male, data.female],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
  
      //파이차트 옵션
      const options = {
          plugins: {
              title: {
                  display: true,
                  text: '성별 비율',
                  font: {
                      size: 18,
                      weight: 'bold',
                  },
                  padding: {
                      top: 10,
                      bottom: 20,
                  },
                      color: '#333',
              },
              legend: {
                  position: 'bottom',
                  labels: {
                      padding: 20,
                  }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed || 0;
                    return `${label}: ${value}명`;
                  }
                }
              }
          },
      };

    return(
        <Pie data={dataSet} options={options}/>
    )
}

export default GenderChart;