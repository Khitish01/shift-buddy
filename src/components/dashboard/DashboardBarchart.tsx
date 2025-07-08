'use client';

import { useSidebar } from '@/context/SidebarContext';
import { useIsMobile } from '@/hooks/useIsMobile';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarChart = () => {
    const isMobile = useIsMobile();
    const { isCollapse, isOpen } = useSidebar();
    const chartOptions: Highcharts.Options = {
        chart: {
            type: 'column',
            backgroundColor: '#ffffff',
            borderColor: '',
            borderWidth: 1,
            borderRadius: 8,
            spacing: [20, 20, 20, 20],
            height: 350,
            width: isCollapse ? 600 : 500
        },
        title: {
            text: '',
            align: 'left',
            style: {
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                fontFamily: 'Inter, sans-serif',
            },
            margin: 25,
        },
        subtitle: {
            text: '',
        },
        xAxis: {
            categories: ["Sep\n'24", "Oct\n'24", "Nov\n'24", "Dec\n'24", "Jan\n'25", "Feb\n'25", "Mar\n'25"],
            lineWidth: 0,
            tickWidth: 0,
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif',
                },
            },
        },
        yAxis: {
            title: {
                text: '',
            },
            labels: {
                formatter: function () {
                    return (this.value as number / 1000) + 'K';
                },
                style: {
                    fontSize: '12px',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif',
                },
            },
            gridLineColor: '#f3f4f6',
            lineWidth: 0,
            tickWidth: 0,
            min: 0,
            max: 6000,
            tickInterval: 1000,
        },
        plotOptions: {
            column: {
                borderWidth: 0,
                borderRadius: {
                    radius: 8,
                    scope: 'point',
                    where: 'all'
                },
                pointPadding: 0.05,
                groupPadding: isCollapse ? 0.3 : 0.25,
                pointWidth: 12,
            },
        },
        series: [
            {
                name: 'Total Income',
                type: 'column',
                data: [5000, 4800, 5200, 4500, 3500, 5100, 5000],
                color: '#69417E',

            },
            {
                name: 'Total Client',
                type: 'column',
                data: [5000, 4000, 4800, 3500, 3000, 4000, 4000],
                color: '#F2C7AC',
            },
        ],
        legend: {
            align: 'left',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            itemStyle: {
                fontSize: '12px',
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '500',
            },
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 20,
            // itemMarginRight: 20,
            margin: 20,
        },
        tooltip: {
            formatter: function () {
                return `<b>${this.series.name}</b><br/>${this.x}: ${(this.y as number).toLocaleString()}`;
            },
            backgroundColor: '#ffffff',
            borderColor: '#e5e7eb',
            borderRadius: 8,
            shadow: true,
        },
        credits: {
            enabled: false,
        },
    };
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    )
}

export default BarChart;