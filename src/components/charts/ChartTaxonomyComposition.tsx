"use client"

import { Dna } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

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
} from "@/components/ui/chart"

interface CompositionData {
  name: string
  value: number
  fill: string
}

interface ChartTaxonomyCompositionProps {
  data: Array<{ Predicted_Taxonomy: string }>
  level?: 'kingdom' | 'phylum' | 'class' | 'order'
  isDarkMode?: boolean
}

const LEVEL_INDEX = {
  kingdom: 1, // After Eukaryota
  phylum: 2,
  class: 4,
  order: 5,
}

const COLORS = [
  "#22D3EE", // cyan
  "#10B981", // emerald
  "#A78BFA", // purple
  "#F59E0B", // amber
  "#EC4899", // pink
  "#64748B", // slate
  "#3B82F6", // blue
  "#14B8A6", // teal
  "#F97316", // orange
  "#8B5CF6", // violet
]

export function ChartTaxonomyComposition({ 
  data, 
  level = 'phylum',
  isDarkMode = false 
}: ChartTaxonomyCompositionProps) {
  // Extract taxonomy at specified level
  const levelCounts = new Map<string, number>()
  const levelIndex = LEVEL_INDEX[level]
  
  data.forEach(item => {
    const taxonomy = item.Predicted_Taxonomy
    const parts = taxonomy.split(';')
    
    // Get the taxonomic level after removing ID prefix
    const taxonPart = parts[levelIndex]?.split(' ').slice(1).join(' ').trim()
    
    if (taxonPart) {
      levelCounts.set(taxonPart, (levelCounts.get(taxonPart) || 0) + 1)
    }
  })

  // Convert to array and sort by count
  const sortedTaxa = Array.from(levelCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10 groups

  const chartData: CompositionData[] = sortedTaxa.map(([name, value], index) => ({
    name: name.length > 25 ? name.substring(0, 25) + '...' : name,
    value,
    fill: COLORS[index % COLORS.length]
  }))

  const chartConfig = {
    value: {
      label: "Sequences",
    },
  } satisfies ChartConfig

  const total = data.length
  const topGroups = sortedTaxa.reduce((sum, [, count]) => sum + count, 0)
  const percentage = ((topGroups / total) * 100).toFixed(1)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percent = ((data.value / total) * 100).toFixed(1)
      return (
        <div className={`rounded-lg border p-2 shadow-sm ${
          isDarkMode 
            ? "bg-slate-800 border-slate-700 text-white" 
            : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="font-semibold">{data.name}</div>
          <div className="text-sm">
            Count: {data.value} ({percent}%)
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}>
      <CardHeader>
        <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
          Taxonomy Composition ({level.charAt(0).toUpperCase() + level.slice(1)} Level)
        </CardTitle>
        <CardDescription className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
          Distribution of sequences across taxonomic {level}s
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => 
                  percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Top {sortedTaxa.length} groups represent {percentage}% of data <Dna className="h-4 w-4" />
        </div>
        <div className={`leading-none ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          {levelCounts.size} unique {level}s identified
        </div>
      </CardFooter>
    </Card>
  )
}
