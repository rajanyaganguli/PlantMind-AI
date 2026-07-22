import { ResponsiveContainer, LineChart, Line, AreaChart, Area, Tooltip } from 'recharts';

interface SparkProps { data: number[]; color: string; }

const d = (data: number[]) => data.map((v, i) => ({ v, i }));

export function SparklineChart({ data, color }: SparkProps) {
  return (
    <ResponsiveContainer width="100%" height={28}>
      <AreaChart data={d(data)} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg-${color.replace('#','')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Generic line chart used inside cards
interface LineProps { data: {name:string;value:number}[]; color: string; height?: number; }

export function MiniLineChart({ data, color, height = 120 }: LineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        <Tooltip
          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px' }}
          labelStyle={{ color: 'var(--text-muted)' }}
          itemStyle={{ color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
