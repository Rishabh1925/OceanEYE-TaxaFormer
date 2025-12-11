"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  { date: "2024-04-01", sequences: 222, samples: 150 },
  { date: "2024-04-02", sequences: 97, samples: 180 },
  { date: "2024-04-03", sequences: 167, samples: 120 },
  { date: "2024-04-04", sequences: 242, samples: 260 },
  { date: "2024-04-05", sequences: 373, samples: 290 },
  { date: "2024-04-06", sequences: 301, samples: 340 },
  { date: "2024-04-07", sequences: 245, samples: 180 },
  { date: "2024-04-08", sequences: 409, samples: 320 },
  { date: "2024-04-09", sequences: 59, samples: 110 },
  { date: "2024-04-10", sequences: 261, samples: 190 },
  { date: "2024-04-11", sequences: 327, samples: 350 },
  { date: "2024-04-12", sequences: 292, samples: 210 },
  { date: "2024-04-13", sequences: 342, samples: 380 },
  { date: "2024-04-14", sequences: 137, samples: 220 },
  { date: "2024-04-15", sequences: 120, samples: 170 },
  { date: "2024-04-16", sequences: 138, samples: 190 },
  { date: "2024-04-17", sequences: 446, samples: 360 },
  { date: "2024-04-18", sequences: 364, samples: 410 },
  { date: "2024-04-19", sequences: 243, samples: 180 },
  { date: "2024-04-20", sequences: 89, samples: 150 },
  { date: "2024-04-21", sequences: 137, samples: 200 },
  { date: "2024-04-22", sequences: 224, samples: 170 },
  { date: "2024-04-23", sequences: 138, samples: 230 },
  { date: "2024-04-24", sequences: 387, samples: 290 },
  { date: "2024-04-25", sequences: 215, samples: 250 },
  { date: "2024-04-26", sequences: 75, samples: 130 },
  { date: "2024-04-27", sequences: 383, samples: 420 },
  { date: "2024-04-28", sequences: 122, samples: 180 },
  { date: "2024-04-29", sequences: 315, samples: 240 },
  { date: "2024-04-30", sequences: 454, samples: 380 },
  { date: "2024-05-01", sequences: 165, samples: 220 },
  { date: "2024-05-02", sequences: 293, samples: 310 },
  { date: "2024-05-03", sequences: 247, samples: 190 },
  { date: "2024-05-04", sequences: 385, samples: 420 },
  { date: "2024-05-05", sequences: 481, samples: 390 },
  { date: "2024-05-06", sequences: 498, samples: 520 },
  { date: "2024-05-07", sequences: 388, samples: 300 },
  { date: "2024-05-08", sequences: 149, samples: 210 },
  { date: "2024-05-09", sequences: 227, samples: 180 },
  { date: "2024-05-10", sequences: 293, samples: 330 },
  { date: "2024-05-11", sequences: 335, samples: 270 },
  { date: "2024-05-12", sequences: 197, samples: 240 },
  { date: "2024-05-13", sequences: 197, samples: 160 },
  { date: "2024-05-14", sequences: 448, samples: 490 },
  { date: "2024-05-15", sequences: 473, samples: 380 },
  { date: "2024-05-16", sequences: 338, samples: 400 },
  { date: "2024-05-17", sequences: 499, samples: 420 },
  { date: "2024-05-18", sequences: 315, samples: 350 },
  { date: "2024-05-19", sequences: 235, samples: 180 },
  { date: "2024-05-20", sequences: 177, samples: 230 },
  { date: "2024-05-21", sequences: 82, samples: 140 },
  { date: "2024-05-22", sequences: 81, samples: 120 },
  { date: "2024-05-23", sequences: 252, samples: 290 },
  { date: "2024-05-24", sequences: 294, samples: 220 },
  { date: "2024-05-25", sequences: 201, samples: 250 },
  { date: "2024-05-26", sequences: 213, samples: 170 },
  { date: "2024-05-27", sequences: 420, samples: 460 },
  { date: "2024-05-28", sequences: 233, samples: 190 },
  { date: "2024-05-29", sequences: 78, samples: 130 },
  { date: "2024-05-30", sequences: 340, samples: 280 },
  { date: "2024-05-31", sequences: 178, samples: 230 },
  { date: "2024-06-01", sequences: 178, samples: 200 },
  { date: "2024-06-02", sequences: 470, samples: 410 },
  { date: "2024-06-03", sequences: 103, samples: 160 },
  { date: "2024-06-04", sequences: 439, samples: 380 },
  { date: "2024-06-05", sequences: 88, samples: 140 },
  { date: "2024-06-06", sequences: 294, samples: 250 },
  { date: "2024-06-07", sequences: 323, samples: 370 },
  { date: "2024-06-08", sequences: 385, samples: 320 },
  { date: "2024-06-09", sequences: 438, samples: 480 },
  { date: "2024-06-10", sequences: 155, samples: 200 },
  { date: "2024-06-11", sequences: 92, samples: 150 },
  { date: "2024-06-12", sequences: 492, samples: 420 },
  { date: "2024-06-13", sequences: 81, samples: 130 },
  { date: "2024-06-14", sequences: 426, samples: 380 },
  { date: "2024-06-15", sequences: 307, samples: 350 },
  { date: "2024-06-16", sequences: 371, samples: 310 },
  { date: "2024-06-17", sequences: 475, samples: 520 },
  { date: "2024-06-18", sequences: 107, samples: 170 },
  { date: "2024-06-19", sequences: 341, samples: 290 },
  { date: "2024-06-20", sequences: 408, samples: 450 },
  { date: "2024-06-21", sequences: 169, samples: 210 },
  { date: "2024-06-22", sequences: 317, samples: 270 },
  { date: "2024-06-23", sequences: 480, samples: 530 },
  { date: "2024-06-24", sequences: 132, samples: 180 },
  { date: "2024-06-25", sequences: 141, samples: 190 },
  { date: "2024-06-26", sequences: 434, samples: 380 },
  { date: "2024-06-27", sequences: 448, samples: 490 },
  { date: "2024-06-28", sequences: 149, samples: 200 },
  { date: "2024-06-29", sequences: 103, samples: 160 },
  { date: "2024-06-30", sequences: 446, samples: 400 },
]

const chartConfig = {
  sequences: {
    label: "DNA Sequences",
    // Lighter violet for larger series
    color: "#C4B5FD",
  },
  samples: {
    label: "Sample Files",
    // Darker violet for typically smaller series
    color: "#A855F7",
  },
} satisfies ChartConfig

export default function ChartAreaInteractive() {
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
          <CardTitle>Sequence Coverage Trends</CardTitle>
          <CardDescription>
            Tracking DNA sequence processing and sample file uploads over time
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
              <linearGradient id="fillSequences" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#C4B5FD"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="#C4B5FD"
                  stopOpacity={0.06}
                />
              </linearGradient>
              <linearGradient id="fillSamples" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#A855F7"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="#A855F7"
                  stopOpacity={0.06}
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
              tickFormatter={(value: string) => {
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
                  className="w-[220px]"
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label || name}
                      <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                        {value}
                      </div>
                      {index === 1 && (
                        <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                          Total
                          <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                            {item.payload.sequences + item.payload.samples}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              }
            />
            <Area
              dataKey="samples"
              type="natural"
              fill="url(#fillSamples)"
              stroke="#A855F7"
              stackId="a"
            />
            <Area
              dataKey="sequences"
              type="natural"
              fill="url(#fillSequences)"
              stroke="#C4B5FD"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
