"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

interface ChartAreaGradientProps {
  data: Array<{ category: string; confidence: number; overlap: number }>;
  title: string;
  description: string;
  isDarkMode?: boolean;
}

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "var(--chart-1)",
  },
  overlap: {
    label: "Overlap",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaGradient({ data, title, description, isDarkMode }: ChartAreaGradientProps) {
  return (
    <Card className={isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-blue-200'}>
      <CardHeader>
        <CardTitle className={isDarkMode ? 'text-white' : 'text-slate-900'}>{title}</CardTitle>
        <CardDescription className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke={isDarkMode ? '#475569' : '#E2E8F0'} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke={isDarkMode ? '#94A3B8' : '#64748B'}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-confidence)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-confidence)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOverlap" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-overlap)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-overlap)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="overlap"
              type="natural"
              fill="url(#fillOverlap)"
              fillOpacity={0.4}
              stroke="var(--color-overlap)"
              stackId="a"
            />
            <Area
              dataKey="confidence"
              type="natural"
              fill="url(#fillConfidence)"
              fillOpacity={0.4}
              stroke="var(--color-confidence)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className={`flex items-center gap-2 leading-none font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              High confidence matches <TrendingUp className="h-4 w-4" />
            </div>
            <div className={`flex items-center gap-2 leading-none ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Analysis confidence and reference overlap metrics
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
