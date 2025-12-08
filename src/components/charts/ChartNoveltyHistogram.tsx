"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface NoveltyData {
  range: string
  count: number
  fill: string
}

interface ChartNoveltyHistogramProps {
  data: Array<{ Novelty_Score: number }>
  isDarkMode?: boolean
}

export function ChartNoveltyHistogram({ data, isDarkMode = false }: ChartNoveltyHistogramProps) {
  // Create histogram bins
  const bins = [
    { min: 0.15, max: 0.17, label: "0.15-0.17", color: "hsl(var(--chart-1))" },
    { min: 0.17, max: 0.19, label: "0.17-0.19", color: "hsl(var(--chart-2))" },
    { min: 0.19, max: 0.21, label: "0.19-0.21", color: "hsl(var(--chart-3))" },
    { min: 0.21, max: 0.23, label: "0.21-0.23", color: "hsl(var(--chart-4))" },
    { min: 0.23, max: 0.25, label: "0.23-0.25", color: "hsl(var(--chart-5))" },
    { min: 0.25, max: 0.31, label: "0.25+", color: "hsl(var(--chart-1))" },
  ]

  const chartData: NoveltyData[] = bins.map(bin => ({
    range: bin.label,
    count: data.filter(item => {
      const score = parseFloat(item.Novelty_Score.toString())
      return score >= bin.min && score < bin.max
    }).length,
    fill: bin.color
  }))

  const chartConfig = {
    count: {
      label: "Sequences",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const totalSequences = data.length
  const avgScore = (data.reduce((sum, item) => sum + parseFloat(item.Novelty_Score.toString()), 0) / totalSequences).toFixed(3)

  return (
    <Card className={isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}>
      <CardHeader>
        <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
          Novelty Score Distribution
        </CardTitle>
        <CardDescription className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          Histogram showing distribution of novelty scores across all sequences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
              <XAxis
                dataKey="range"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                style={{ fontSize: '12px' }}
                label={{ 
                  value: 'Number of Sequences', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: isDarkMode ? "#94a3b8" : "#64748b" }
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="line" />}
              />
              <Bar 
                dataKey="count" 
                radius={[8, 8, 0, 0]}
                fillOpacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Average novelty score: {avgScore} <TrendingUp className="h-4 w-4" />
        </div>
        <div className={`leading-none ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Total sequences analyzed: {totalSequences}
        </div>
      </CardFooter>
    </Card>
  )
}
