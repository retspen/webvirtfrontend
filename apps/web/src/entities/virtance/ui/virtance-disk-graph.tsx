import { useQuery } from '@tanstack/react-query';
import { format, fromUnixTime } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Spin } from 'ui/components/spin';

import {
  getVirtanceDiskMetrics,
  VirtanceDiskMetrics,
  virtanceQueries,
} from '@/entities/virtance';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart';

type TransformedData = {
  date: number;
  read: number;
  write: number;
};

function transformData(data: VirtanceDiskMetrics['data']): TransformedData[] {
  return data.read.map(([timestamp, readValue], index) => ({
    date: timestamp,
    read: parseFloat(readValue),
    write: parseFloat(data.write[index][1]),
  }));
}

const chartConfig = {
  read: {
    label: 'read',
    color: 'hsl(var(--chart-1))',
  },
  write: {
    label: 'write',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function VirtanceDiskGraph({ virtanceId }: { virtanceId: number }) {
  const { data } = useQuery({
    queryKey: virtanceQueries.metrics.disk(virtanceId),
    queryFn: () =>
      getVirtanceDiskMetrics(virtanceId).then((response) =>
        transformData(response.metrics[0].data),
      ),
    refetchInterval: 5000,
  });

  return (
    <div className="bg-card space-y-1 rounded-lg border shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-base font-semibold">Disk I/O</h2>
      </div>
      <div className="p-4 pl-0">
        {data ? (
          <ChartContainer
            config={chartConfig}
            className="-ml-2 aspect-auto h-[320px] w-full"
          >
            <AreaChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={true}
                tickMargin={8}
                axisLine={true}
                style={{ fontSize: '10px' }}
                minTickGap={32}
                tickFormatter={(value: number) => format(fromUnixTime(value), 'HH:mm a')}
              />
              <YAxis
                style={{ fontSize: '10px' }}
                tickFormatter={(value: number) => `${value}MB/s`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, [payload]) =>
                      format(fromUnixTime(payload.payload.date), 'MMM d, y h:mm:ss a')
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="step"
                dataKey="read"
                fill="var(--color-read)"
                fillOpacity={0.4}
                stroke="var(--color-read)"
              />
              <Area
                type="step"
                dataKey="write"
                fill="var(--color-write)"
                fillOpacity={0.4}
                stroke="var(--color-write)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[320px] w-full items-center justify-center">
            <Spin />
          </div>
        )}
      </div>
    </div>
  );
}
