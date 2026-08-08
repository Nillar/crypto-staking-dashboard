import { test, expect } from "@playwright/test";
import { mockCoinGeckoPrices } from "./helpers";

test("theme toggle persists across a reload", async ({ page }) => {
    // Pin the OS-level preference so the starting theme is deterministic
    // regardless of the machine running the test.
    await page.emulateMedia({ colorScheme: "light" });
    await mockCoinGeckoPrices(page);
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/light/);

    await page.getByRole("button", { name: /toggle theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
});
