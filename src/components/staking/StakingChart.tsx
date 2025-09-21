"use client";

import {JSX, useMemo, useState} from "react";
import {useGlobalContext} from "@/context/globalContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";
import styles from "./StakingChart.module.scss";
import {coins} from "@/lib/coins";
import {
    TrendingUp,
    DollarSign,
    Calendar,
    Euro
} from 'lucide-react';
import {clsx} from "clsx";

type StakingChartProps = {
    amountInCrypto: number;
    amountInFiat: number;
    apy: number;
    periodDays: number;
    fiatCurrency: string;
    cryptoId: string; // must be CoinGecko id, e.g. "bitcoin"
};

type Point = {
    monthIndex: number;
    daysElapsed: number;
    principal: number;
    growth: number;
    totalFiat: number;
    label: string;
};

const {
    wrap,
    light,
    dark,
    metricsWrap,
    metricBoxes,
    priceContainer,
    apyContainer,
    growthContainer,
    iconContainer,
    metricLabel,
    metricValue,
    chartWrap,
    chartContainer,
    barTooltip,
    txtGreen,
    txtBlue
} = styles;

export default function StakingChart({
                                         amountInFiat,
                                         apy,
                                         periodDays,
                                         fiatCurrency,
                                         cryptoId,
                                     }: StakingChartProps): JSX.Element {
    const {prices, theme} = useGlobalContext();
    const [totalGrowth, setTotalGrowth] = useState(0);
    const currentCrypto = coins.find(coin => coin.id === cryptoId);

    const price = prices[cryptoId]?.[fiatCurrency] ?? null;

    const data: Point[] = useMemo(() => {
        const months = Math.round(periodDays / 30);
        const dailyRate = apy / 100 / 365;
        const points: Point[] = [];

        for (let m = 0; m <= months; m++) {
            const daysElapsed = Math.min(periodDays, m * 30);
            const growthFactor = Math.pow(1 + dailyRate, daysElapsed);
            const totalFiat = amountInFiat * growthFactor;

            points.push({
                monthIndex: m,
                daysElapsed,
                principal: amountInFiat,
                growth: totalFiat - amountInFiat,
                totalFiat,
                label: `${m}m`,
            });
        }

        setTotalGrowth(points[points.length - 1].growth);

        return points;
    }, [amountInFiat, apy, periodDays]);

    const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: fiatCurrency,
        maximumFractionDigits: 2,
    });

    const CustomTooltip = ({active, payload}: {
        active: boolean | undefined,
        payload: { payload: Point }[] | undefined
    }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const p: Point | undefined = payload?.[0]?.payload;
            const currencySymbol = fiatCurrency === "usd" ? "$" : "€";

            return (
                <div className={clsx(barTooltip, {
                    [light]: theme === "light",
                    [dark]: theme === "dark"
                })}>
                    <p>{`Month ${p?.monthIndex} — ${p?.daysElapsed} day(s)`}</p>
                    <p className={txtGreen}>
                        Growth: {currencySymbol}{data.growth.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                    </p>
                    <p className={txtBlue}>
                        Principal: {currencySymbol}{data.principal.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                    </p>
                </div>
            );
        }
        return <></>;
    };

    return (
        <div className={clsx(wrap, {
            [light]: theme === 'light',
            [dark]: theme === 'dark'
        })}>
            {!price ? (
                <p>⚠️ Price data not available for {cryptoId} in {fiatCurrency.toUpperCase()}.</p>
            ) : (
                <>
                    <div className={metricsWrap}>
                        <h2>Metrics for {currentCrypto?.name}</h2>
                        <div className={metricBoxes}>
                            <div className={priceContainer}>
                                <div className={iconContainer}>
                                    {fiatCurrency === "usd" ? <DollarSign size={24}/> : <Euro size={24}/>}
                                </div>
                                <h3 className={metricLabel}>Current Price</h3>
                                <h4 className={metricValue}>{currencyFormatter.format(price)}</h4>
                            </div>
                            <div className={apyContainer}>
                                <div className={iconContainer}>
                                    <TrendingUp size={24}/>
                                </div>
                                <h3 className={metricLabel}>APY</h3>
                                <h4 className={metricValue}>{apy}%</h4>
                            </div>
                            <div className={growthContainer}>
                                <div className={iconContainer}>
                                    <Calendar size={24}/>
                                </div>
                                <h3 className={metricLabel}>Growth</h3>
                                <h4 className={metricValue}>{currencyFormatter.format(totalGrowth)}</h4>
                            </div>
                        </div>
                    </div>

                    <div className={chartWrap}>
                        <h2>Staking Returns Over Time</h2>
                        <div className={chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data}
                                    margin={{top: 0, right: 0, left: -55, bottom: 0}}
                                    barGap={4}
                                >
                                    <CartesianGrid strokeDasharray="3 3"
                                                   stroke={theme === "dark" ? '#374151' : '#f0f0f0'}/>
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{fill: theme === "dark" ? '#9CA3AF' : '#6b7280', fontSize: 12}}
                                    />
                                    <YAxis
                                        width={100}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{fill: theme === "dark" ? '#9CA3AF' : '#6b7280', fontSize: 12}}
                                        tickFormatter={(value) => {
                                            let formattedValue = value.toString();
                                            const currencySymbol = fiatCurrency === "usd" ? "$" : "€";

                                            if (value >= 1000 && value < 1000000) {
                                                formattedValue = `${(value / 1000).toFixed(0)}k`;
                                            } else if (value >= 1000000) {
                                                formattedValue = `${(value / 1000000).toFixed(1).replace("0", "")}m`;
                                            }

                                            return `${currencySymbol}${formattedValue}`
                                        }}
                                    />
                                    <Tooltip content={<CustomTooltip active={undefined} payload={undefined}/>}/>
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: '10px',
                                            left: "0",
                                            width: "100%",
                                            color: theme === "dark" ? '#E5E7EB' : '#374151'
                                        }}
                                        iconType="rect"/>
                                    <Bar dataKey="principal" name="Principal" stackId="a" fill="#3b82f6"
                                         radius={[0, 0, 4, 4]}/>
                                    <Bar dataKey="growth" name="Growth" stackId="a" fill="#10b981"
                                         radius={[4, 4, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
