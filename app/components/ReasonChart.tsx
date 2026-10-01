"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ReasonChartProps {
  reasonData: Record<string, number>;
}

// Color palette for the chart slices
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function ReasonChart({ reasonData }: ReasonChartProps) {
  // 1. Calculate total visits for the donut center label
  const totalVisits = React.useMemo(() => {
    return Object.values(reasonData).reduce((acc, curr) => acc + curr, 0);
  }, [reasonData]);

  // 2. Build chart data array & dynamic chart configuration
  const { chartData, chartConfig } = React.useMemo(() => {
    const entries = Object.entries(reasonData);
    const config: ChartConfig = {
      visits: {
        label: "Visits",
      },
    };

    const data = entries.map(([reason, count], index) => {
      // Key formatted for CSS variables/keys
      const key = reason.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const color = CHART_COLORS[index % CHART_COLORS.length];

      config[key] = {
        label: reason,
        color: color,
      };

      return {
        reason,
        visits: count,
        fill: `var(--color-${key})`,
      };
    });

    return { chartData: data, chartConfig: config };
  }, [reasonData]);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="visits"
          nameKey="reason"
          innerRadius={60}
          outerRadius={95}
          strokeWidth={4}
        >
          {/* Donut Center Label showing total visits */}
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
                      className="fill-slate-900 text-3xl font-bold"
                    >
                      {totalVisits.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 22}
                      className="fill-slate-500 text-xs"
                    >
                      Total Visits
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="reason" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:baseline"
        />
      </PieChart>
    </ChartContainer>
  );
}
