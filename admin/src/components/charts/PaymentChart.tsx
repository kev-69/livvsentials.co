import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Chart as ChartJS, ChartData, ChartOptions } from 'chart.js';

// You'll need to install Chart.js:
// npm install chart.js

const PaymentChart = () => {
  // Add proper types to refs
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    // We'll need to import Chart.js dynamically to avoid SSR issues
    const initChart = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Add null check before accessing current
      if (!chartRef.current) return;
      
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Revenue',
              data: [1800, 2200, 1900, 2800, 3500, 3200, 4100, 3800, 4500, 4200, 4800, 5200],
              borderColor: 'rgb(99, 102, 241)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Orders',
              data: [120, 145, 135, 150, 180, 175, 195, 185, 200, 210, 215, 230],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          }
        }
      });
    };

    initChart();

    // Clean up
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Use separate canvases for each tab to prevent rendering issues
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="yearly">
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="h-[300px]">
            <canvas ref={chartRef} />
          </TabsContent>
          <TabsContent value="quarterly" className="h-[300px]">
            <div className="h-full">
              {/* We can use the same ref for simplicity, or create separate charts */}
              {/* If you want separate charts, use different refs and useEffects */}
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="h-[300px]">
            <div className="h-full">
              {/* Same here */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentChart;