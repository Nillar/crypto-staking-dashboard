export type GrowthPoint = {
    monthIndex: number;
    daysElapsed: number;
    principal: number;
    growth: number;
    totalFiat: number;
    label: string;
};

type GrowthSeriesInput = {
    amountInFiat: number;
    apy: number;
    periodDays: number;
};

export function calculateGrowthSeries({amountInFiat, apy, periodDays}: GrowthSeriesInput): GrowthPoint[] {
    const months = Math.round(periodDays / 30);
    const dailyRate = apy / 100 / 365;
    const points: GrowthPoint[] = [];

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

    return points;
}

export function formatAxisValue(value: number, currencySymbol: string): string {
    let formattedValue = value.toString();

    if (value >= 1000 && value < 1000000) {
        formattedValue = `${(value / 1000).toFixed(0)}k`;
    } else if (value >= 1000000) {
        formattedValue = `${(value / 1000000).toFixed(1).replace("0", "")}m`;
    }

    return `${currencySymbol}${formattedValue}`;
}
