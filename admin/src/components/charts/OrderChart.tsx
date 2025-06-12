import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", order: 150 },
  { date: "2024-04-02", order: 180 },
  { date: "2024-04-03", order: 120 },
  { date: "2024-04-04", order: 260 },
  { date: "2024-04-05", order: 290 },
  { date: "2024-04-06", order: 340 },
  { date: "2024-04-07", order: 180 },
  { date: "2024-04-08", order: 320 },
  { date: "2024-04-09", order: 110 },
  { date: "2024-04-10", order: 190 },
  { date: "2024-04-11", order: 350 },
  { date: "2024-04-12", order: 210 },
  { date: "2024-04-13", order: 380 },
  { date: "2024-04-14", order: 220 },
  { date: "2024-04-15", order: 170 },
  { date: "2024-04-16", order: 190 },
  { date: "2024-04-17", order: 360 },
  { date: "2024-04-18", order: 410 },
  { date: "2024-04-19", order: 180 },
  { date: "2024-04-20", order: 150 },
  { date: "2024-04-21", order: 200 },
  { date: "2024-04-22", order: 170 },
  { date: "2024-04-23", order: 230 },
  { date: "2024-04-24", order: 290 },
  { date: "2024-04-25", order: 250 },
  { date: "2024-04-26", order: 130 },
  { date: "2024-04-27", order: 420 },
  { date: "2024-04-28", order: 180 },
  { date: "2024-04-29", order: 240 },
  { date: "2024-04-30", order: 380 },
  { date: "2024-05-01", order: 220 },
  { date: "2024-05-02", order: 310 },
  { date: "2024-05-03", order: 190 },
  { date: "2024-05-04", order: 420 },
  { date: "2024-05-05", order: 390 },
  { date: "2024-05-06", order: 520 },
  { date: "2024-05-07", order: 300 },
  { date: "2024-05-08", order: 210 },
  { date: "2024-05-09", order: 180 },
  { date: "2024-05-10", order: 330 },
  { date: "2024-05-11", order: 270 },
  { date: "2024-05-12", order: 240 },
  { date: "2024-05-13", order: 160 },
  { date: "2024-05-14", order: 490 },
  { date: "2024-05-15", order: 380 },
  { date: "2024-05-16", order: 400 },
  { date: "2024-05-17", order: 420 },
  { date: "2024-05-18", order: 350 },
  { date: "2024-05-19", order: 180 },
  { date: "2024-05-20", order: 230 },
  { date: "2024-05-21", order: 140 },
  { date: "2024-05-22", order: 120 },
  { date: "2024-05-23", order: 290 },
  { date: "2024-05-24", order: 220 },
  { date: "2024-05-25", order: 250 },
  { date: "2024-05-26", order: 170 },
  { date: "2024-05-27", order: 460 },
  { date: "2024-05-28", order: 190 },
  { date: "2024-05-29", order: 130 },
  { date: "2024-05-30", order: 280 },
  { date: "2024-05-31", order: 230 },
  { date: "2024-06-01", order: 200 },
  { date: "2024-06-02", order: 410 },
  { date: "2024-06-03", order: 160 },
  { date: "2024-06-04", order: 380 },
  { date: "2024-06-05", order: 140 },
  { date: "2024-06-06", order: 250 },
  { date: "2024-06-07", order: 370 },
  { date: "2024-06-08", order: 320 },
  { date: "2024-06-09", order: 480 },
  { date: "2024-06-10", order: 200 },
  { date: "2024-06-11", order: 150 },
  { date: "2024-06-12", order: 420 },
  { date: "2024-06-13", order: 130 },
  { date: "2024-06-14", order: 380 },
  { date: "2024-06-15", order: 350 },
  { date: "2024-06-16", order: 310 },
  { date: "2024-06-17", order: 520 },
  { date: "2024-06-18", order: 170 },
  { date: "2024-06-19", order: 290 },
  { date: "2024-06-20", order: 450 },
  { date: "2024-06-21", order: 210 },
  { date: "2024-06-22", order: 270 },
  { date: "2024-06-23", order: 530 },
  { date: "2024-06-24", order: 180 },
  { date: "2024-06-25", order: 190 },
  { date: "2024-06-26", order: 380 },
  { date: "2024-06-27", order: 490 },
  { date: "2024-06-28", order: 200 },
  { date: "2024-06-29", order: 160 },
  { date: "2024-06-30", order: 400 },
]

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-1)",
  },
}

const OrderChart = () => {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Orders Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total orders for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillOrder" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-orders)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-orders)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: any) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: any) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="order"
              type="natural"
              fill="url(#fillOrder)"
              stroke="var(--color-orders)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default OrderChart;
