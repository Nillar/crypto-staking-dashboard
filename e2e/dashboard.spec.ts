import { test, expect } from "@playwright/test";
import { mockCoinGeckoPrices } from "./helpers";

test.describe("Dashboard", () => {
    test.beforeEach(async ({ page }) => {
        await mockCoinGeckoPrices(page);
        await page.goto("/");
    });

    test("shows staking metrics for the default coin", async ({ page }) => {
        await expect(page.getByText("Metrics for Bitcoin")).toBeVisible();
        await expect(page.getByText("Current Price")).toBeVisible();
        await expect(page.getByText("Staking Returns Over Time")).toBeVisible();
    });

    test("updates the chart after picking a different coin and amount", async ({ page }) => {
        const fiatInput = page.getByLabel(/Amount in USD/i);
        await fiatInput.fill("20000");

        // react-select's label-associated input is an off-screen focus trap;
        // the visible, clickable surface is the rendered selected-value text.
        await page.getByText("BTC — Bitcoin").click();
        await page.getByText("ETH — Ethereum").click();

        await expect(page.getByText("Metrics for Ethereum")).toBeVisible();
        await expect(page.getByText("14%")).toBeVisible();
    });
});
