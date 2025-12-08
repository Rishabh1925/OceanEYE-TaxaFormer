"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
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

interface ChartPieInteractiveProps {
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
  description: string;
  isDarkMode?: boolean;
}

export function ChartPieInteractive({ data, title, description, isDarkMode }: ChartPieInteractiveProps) {
  const id = "pie-interactive"
  
  // Transform data to match chart format
  const chartData = data.map(item => ({
    category: item.name,
    value: item.value,
    fill: item.color
  }))

  const [activeCategory, setActiveCategory] = React.useState(chartData[0].category)

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.category === activeCategory),
    [activeCategory, chartData]
  )
  
  const categories = React.useMemo(() => chartData.map((item) => item.category), [chartData])

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.category] = {
      label: item.category,
      color: item.fill,
    }
    return acc
  }, {} as ChartConfig)

  return (
    <Card data-chart={id} className={`flex flex-col ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-blue-200'}`}>
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className={isDarkMode ? 'text-white' : 'text-slate-900'}>{title}</CardTitle>
          <CardDescription className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{description}</CardDescription>
        </div>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger
            className={`ml-auto h-7 w-[130px] rounded-lg pl-2.5 ${
              isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-blue-200'
            }`}
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent align="end" className={`rounded-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
            {categories.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className={`rounded-lg [&_span]:flex ${isDarkMode ? 'text-white hover:bg-slate-700' : 'hover:bg-blue-50'}`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: config.color,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={`text-3xl font-bold ${isDarkMode ? 'fill-white' : 'fill-slate-900'}`}
                        >
                          {chartData[activeIndex].value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className={isDarkMode ? 'fill-slate-400' : 'fill-slate-600'}
                        >
                          Sequences
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
