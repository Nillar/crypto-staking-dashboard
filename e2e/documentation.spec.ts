import { test, expect } from "@playwright/test";
import { mockCoinGeckoPrices } from "./helpers";

test("navigates from the dashboard to the documentation page and back", async ({ page }) => {
    await mockCoinGeckoPrices(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Documentation" }).click();
    await expect(page).toHaveURL(/\/documentation$/);
    await expect(page.getByText("Introduction")).toBeVisible();

    await page.getByRole("button", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Metrics for Bitcoin")).toBeVisible();
});
