"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

interface ChartBarDefaultProps {
  data: Array<{ category: string; value: number }>;
  title: string;
  description: string;
  isDarkMode?: boolean;
}

const chartConfig = {
  value: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarDefault({ data, title, description, isDarkMode }: ChartBarDefaultProps) {
  return (
    <Card className={isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-blue-200'}>
      <CardHeader>
        <CardTitle className={isDarkMode ? 'text-white' : 'text-slate-900'}>{title}</CardTitle>
        <CardDescription className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} stroke={isDarkMode ? '#475569' : '#E2E8F0'} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke={isDarkMode ? '#94A3B8' : '#64748B'}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className={`flex gap-2 leading-none font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Taxonomic distribution analysis <TrendingUp className="h-4 w-4" />
        </div>
        <div className={`leading-none ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Showing sequence counts by taxonomic group
        </div>
      </CardFooter>
    </Card>
  )
}
