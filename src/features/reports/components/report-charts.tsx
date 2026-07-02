'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '../types';
import { ChartSkeleton } from '@/components/ui/skeleton';

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

interface ReportBarChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  barColor?: string;
  formatter?: (value: number) => string;
  loading?: boolean;
  title?: string;
}

export function ReportBarChart({
  data,
  dataKey = 'value',
  barColor = '#3b82f6',
  formatter,
  loading,
  title,
}: ReportBarChartProps) {
  if (loading) return <ChartSkeleton />;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Sin datos disponibles
      </div>
    );
  }

  const chart = (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatter}
        />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
          formatter={(value: unknown) => {
            const v =
              typeof value === 'number' && formatter ? formatter(value) : String(value ?? 0);
            return [v, ''];
          }}
        />
        <Bar dataKey={dataKey} fill={barColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  if (title) {
    return <ChartCard title={title}>{chart}</ChartCard>;
  }
  return chart;
}

interface ReportLineChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  lineColor?: string;
  formatter?: (value: number) => string;
  loading?: boolean;
  title?: string;
}

export function ReportLineChart({
  data,
  dataKey = 'value',
  lineColor = '#10b981',
  formatter,
  loading,
  title,
}: ReportLineChartProps) {
  if (loading) return <ChartSkeleton />;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Sin datos disponibles
      </div>
    );
  }

  const chart = (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatter}
        />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
          formatter={(value: unknown) => {
            const v =
              typeof value === 'number' && formatter ? formatter(value) : String(value ?? 0);
            return [v, ''];
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  if (title) {
    return <ChartCard title={title}>{chart}</ChartCard>;
  }
  return chart;
}

interface ReportPieChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  loading?: boolean;
  title?: string;
  showLegend?: boolean;
}

export function ReportPieChart({
  data,
  dataKey = 'value',
  innerRadius = 60,
  outerRadius = 100,
  loading,
  title,
  showLegend = true,
}: ReportPieChartProps) {
  if (loading) return <ChartSkeleton />;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Sin datos disponibles
      </div>
    );
  }

  const chart = (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
            formatter={(value: unknown, name: unknown) => [String(value ?? 0), String(name ?? '')]}
          />
        </PieChart>
      </ResponsiveContainer>
      {showLegend && (
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {data.map((d, idx) => (
            <div key={d.label} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              {d.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (title) {
    return <ChartCard title={title}>{chart}</ChartCard>;
  }
  return chart;
}

interface ReportAreaChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  areaColor?: string;
  formatter?: (value: number) => string;
  loading?: boolean;
  title?: string;
}

export function ReportAreaChart({
  data,
  dataKey = 'value',
  areaColor = '#8b5cf6',
  formatter,
  loading,
  title,
}: ReportAreaChartProps) {
  if (loading) return <ChartSkeleton />;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Sin datos disponibles
      </div>
    );
  }

  const chart = (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatter}
        />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }}
          formatter={(value: unknown) => {
            const v =
              typeof value === 'number' && formatter ? formatter(value) : String(value ?? 0);
            return [v, ''];
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={areaColor}
          fill={areaColor}
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  if (title) {
    return <ChartCard title={title}>{chart}</ChartCard>;
  }
  return chart;
}
