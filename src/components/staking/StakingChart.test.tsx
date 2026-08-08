import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithGlobalContext, stubFetchWithPrices, mockCoinPrices } from "@/test/testUtils";
import StakingChart from "./StakingChart";
import { calculateGrowthSeries } from "@/lib/staking";

describe("StakingChart", () => {
    it("renders the metrics panel using the real growth calculation", async () => {
        stubFetchWithPrices();

        renderWithGlobalContext(
            <StakingChart
                amountInCrypto={1}
                amountInFiat={10000}
                apy={12}
                periodDays={90}
                fiatCurrency="usd"
                cryptoId="bitcoin"
            />
        );

        expect(await screen.findByText("Metrics for Bitcoin")).toBeInTheDocument();

        const currencyFormatter = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "usd",
            maximumFractionDigits: 2,
        });
        const points = calculateGrowthSeries({ amountInFiat: 10000, apy: 12, periodDays: 90 });
        const expectedGrowth = points[points.length - 1].growth;

        expect(screen.getByText(currencyFormatter.format(65000))).toBeInTheDocument();
        expect(screen.getByText("12%")).toBeInTheDocument();
        expect(screen.getByText(currencyFormatter.format(expectedGrowth))).toBeInTheDocument();
    });

    it("shows a fallback message when no price is available for the coin/currency", async () => {
        stubFetchWithPrices(mockCoinPrices({ bitcoin: {} }));

        renderWithGlobalContext(
            <StakingChart
                amountInCrypto={1}
                amountInFiat={10000}
                apy={12}
                periodDays={90}
                fiatCurrency="usd"
                cryptoId="bitcoin"
            />
        );

        expect(
            await screen.findByText(/Price data not available for bitcoin in USD/i)
        ).toBeInTheDocument();
    });
});
