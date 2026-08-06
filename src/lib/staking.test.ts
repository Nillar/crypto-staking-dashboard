import { describe, it, expect } from "vitest";
import { calculateGrowthSeries, formatAxisValue } from "./staking";

describe("calculateGrowthSeries", () => {
    it("returns one point per month plus the starting point", () => {
        const points = calculateGrowthSeries({ amountInFiat: 1000, apy: 12, periodDays: 90 });
        expect(points).toHaveLength(4); // months 0..3
        expect(points[0]).toMatchObject({ monthIndex: 0, daysElapsed: 0, principal: 1000, growth: 0 });
    });

    it("compounds growth using the daily rate over elapsed days", () => {
        const points = calculateGrowthSeries({ amountInFiat: 1000, apy: 36.5, periodDays: 30 });
        const last = points[points.length - 1];
        const dailyRate = 36.5 / 100 / 365;
        const expectedTotal = 1000 * Math.pow(1 + dailyRate, 30);

        expect(last.totalFiat).toBeCloseTo(expectedTotal, 6);
        expect(last.growth).toBeCloseTo(expectedTotal - 1000, 6);
    });

    it("caps daysElapsed at periodDays for the final point", () => {
        const points = calculateGrowthSeries({ amountInFiat: 500, apy: 10, periodDays: 45 });
        expect(points[points.length - 1].daysElapsed).toBe(45);
    });

    it("produces zero growth when apy is 0", () => {
        const points = calculateGrowthSeries({ amountInFiat: 500, apy: 0, periodDays: 60 });
        points.forEach((point) => expect(point.growth).toBe(0));
    });
});

describe("formatAxisValue", () => {
    it("returns the raw value with a symbol below 1000", () => {
        expect(formatAxisValue(500, "$")).toBe("$500");
    });

    it("formats thousands with a k suffix", () => {
        expect(formatAxisValue(2000, "$")).toBe("$2k");
    });

    it("formats millions with an m suffix", () => {
        expect(formatAxisValue(2500000, "€")).toBe("€2.5m");
    });
});
