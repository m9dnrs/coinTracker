import ApexChart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atom';
interface ChartProps {
	coinId: string;
}

interface IHistorical {
	time_open: string;
	time_close: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	market_cap: number;
}

function Chart({ coinId }: ChartProps) {
	const isDark = useRecoilValue(isDarkAtom);
	const { isLoading, data } = useQuery<IHistorical[]>(
		['ohlcv', coinId],
		() => fetchCoinHistory(coinId),
		{ refetchInterval: 10000 },
	);
	return (
		<>
			{isLoading ? (
				'Loading chart...'
			) : (
				<>
					<ApexChart
						type='candlestick'
						series={[
							{
								data: data?.map((price) => {
									return {
										x: price.time_close,
										y: [price.open, price.high, price.low, price.close],
									};
								}) as [],
								name: 'Price',
							},
						]}
						options={{
							plotOptions: {
								candlestick: {
									wick: {
										useFillColor: true,
									},
								},
							},
							chart: {
								type: 'candlestick',
								height: 300,
								width: 500,
								background: 'transparent',
								toolbar: {
									show: false,
								},
							},
							xaxis: {
								type: 'datetime',
							},
							yaxis: {
								tooltip: {
									enabled: true,
								},
								labels: {
									formatter: (value) => `$${value.toFixed(2)}`,
								},
							},
							tooltip: {
								y: {
									formatter: (value) => `$${value.toFixed(2)}`,
								},
							},
							theme: {
								mode: isDark ? 'dark' : 'light',
							},
						}}
					/>
					<ApexChart
						type='line'
						series={[
							{
								name: 'Price',
								data: data?.map((price) => price.close) as number[],
							},
						]}
						options={{
							theme: {
								mode: isDark ? 'dark' : 'light',
							},
							markers: {
								size: 2,
							},
							chart: {
								height: 300,
								width: 500,
								toolbar: {
									show: false,
								},
								background: 'transparent',
							},
							grid: { show: false },
							stroke: {
								curve: 'straight',
								width: 4,
							},
							yaxis: {
								show: false,
							},
							xaxis: {
								axisBorder: { show: false },
								axisTicks: { show: false },
								labels: { show: false },
								type: 'datetime',
								categories: data?.map((price) => price.time_close),
							},
							fill: {
								type: 'gradient',
								gradient: { gradientToColors: ['#0be881'], stops: [0, 100] },
							},
							colors: ['#0fbcf9'],
							tooltip: {
								y: {
									formatter: (value) => `$${value.toFixed(2)}`,
								},
							},
						}}
					/>
				</>
			)}
		</>
	);
}

export default Chart;
