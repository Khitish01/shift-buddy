'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DonutChart = () => {
    const chartOptions: Highcharts.Options = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            height: 200,
            width: 200,
            spacing: [10, 10, 10, 10],
        },
        title: {
            text: '46',
            align: 'center',
            verticalAlign: 'middle',
            style: {
                fontSize: '36px',
                fontWeight: '700',
                color: '#1f2937',
                fontFamily: 'Inter, sans-serif',
            },
            floating: true,
            // y: -10,
        },
        subtitle: {
            text: '',
        },
        tooltip: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                innerSize: '80%',
                dataLabels: {
                    enabled: false,
                },
                enableMouseTracking: true,
                borderWidth: 0,
                states: {
                    hover: {
                        enabled: true,
                    },
                },
            },
        },
        series: [
            {
                name: 'Active Carers',
                type: 'pie',
                data: [
                    {
                        name: 'Active',
                        y: 51,
                        color: '#69417E',
                    },
                    {
                        name: 'Inactive',
                        y: 49,
                        color: '#F2C7AC',
                    },
                ],
                size: '100%',
                startAngle: -90,
            },
        ],
        legend: {
            enabled: false,
        },
        credits: {
            enabled: false,
        },
    };

    return (
        // <div className="flex flex-col items-center justify-center p-8">
        //   <div className="relative">
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
        //   </div>


        // </div>
    );
};

export default DonutChart;