import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithGlobalContext, stubFetchWithPrices } from "@/test/testUtils";
import Page from "./page";
import { calculateGrowthSeries } from "@/lib/staking";

describe("Dashboard page (StakingForm + StakingChart integration)", () => {
    it("updates the chart's metrics after picking a different coin and amount", async () => {
        stubFetchWithPrices();
        const { user } = renderWithGlobalContext(<Page />);

        expect(await screen.findByText("Metrics for Bitcoin")).toBeInTheDocument();

        const fiatInput = screen.getByLabelText(/Amount in USD/i) as HTMLInputElement;
        await user.clear(fiatInput);
        await user.type(fiatInput, "20000");

        const cryptoSelect = screen.getByLabelText("Select Crypto");
        await user.click(cryptoSelect);
        const ethereumOption = await screen.findByText("ETH — Ethereum");
        await user.click(ethereumOption);

        expect(await screen.findByText("Metrics for Ethereum")).toBeInTheDocument();

        const currencyFormatter = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "usd",
            maximumFractionDigits: 2,
        });

        // Ethereum's price should now be shown for the newly selected coin.
        expect(screen.getByText(currencyFormatter.format(3200))).toBeInTheDocument();

        // The debounced form -> chart update takes ~500ms, so give it room.
        await waitFor(() => expect(screen.getByText("14%")).toBeInTheDocument(), { timeout: 1500 });

        await waitFor(
            () => {
                const points = calculateGrowthSeries({ amountInFiat: 20000, apy: 14, periodDays: 365 });
                const expectedGrowth = points[points.length - 1].growth;
                expect(screen.getByText(currencyFormatter.format(expectedGrowth))).toBeInTheDocument();
            },
            { timeout: 1500 }
        );
    });

    it("shows an error banner with a working retry button when prices fail to load", async () => {
        stubFetchWithPrices(undefined, false);
        const { user } = renderWithGlobalContext(<Page />);

        const retryButton = await screen.findByRole("button", { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
        expect(screen.queryByText(/Metrics for/)).not.toBeInTheDocument();

        stubFetchWithPrices(); // the retry succeeds this time
        await user.click(retryButton);

        expect(await screen.findByText("Metrics for Bitcoin")).toBeInTheDocument();
    });
});
