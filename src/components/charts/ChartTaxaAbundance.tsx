"use client"

import { Database } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

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

interface TaxaData {
  name: string
  count: number
  fill: string
}

interface ChartTaxaAbundanceProps {
  data: Array<{ Predicted_Taxonomy: string }>
  isDarkMode?: boolean
}

export function ChartTaxaAbundance({ data, isDarkMode = false }: ChartTaxaAbundanceProps) {
  // Extract genus/species level taxa and count occurrences
  const taxaCounts = new Map<string, number>()
  
  data.forEach(item => {
    const taxonomy = item.Predicted_Taxonomy
    // Extract the last part of taxonomy (genus/species)
    const parts = taxonomy.split(';')
    const lastPart = parts[parts.length - 1]?.trim()
    if (lastPart) {
      taxaCounts.set(lastPart, (taxaCounts.get(lastPart) || 0) + 1)
    }
  })

  // Convert to array and sort by count
  const sortedTaxa = Array.from(taxaCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15) // Top 15 taxa

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const chartData: TaxaData[] = sortedTaxa.map(([name, count], index) => ({
    name: name.length > 30 ? name.substring(0, 30) + '...' : name,
    count,
    fill: colors[index % colors.length]
  }))

  const chartConfig = {
    count: {
      label: "Frequency",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const totalUnique = taxaCounts.size
  const totalSequences = data.length

  return (
    <Card className={isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}>
      <CardHeader>
        <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
          Known Taxa Frequency & Abundance
        </CardTitle>
        <CardDescription className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          Top 15 most abundant taxa in the dataset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
              <XAxis 
                type="number"
                stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                style={{ fontSize: '11px' }}
                width={140}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel indicator="line" />}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
                fillOpacity={0.8}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {totalUnique} unique taxa identified <Database className="h-4 w-4" />
        </div>
        <div className={`leading-none ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          Showing top 15 of {totalUnique} total taxa ({totalSequences} sequences)
        </div>
      </CardFooter>
    </Card>
  )
}
