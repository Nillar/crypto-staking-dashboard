import { Page } from "@playwright/test";

export const mockPrices = {
    bitcoin: { usd: 65000, eur: 60000 },
    ethereum: { usd: 3200, eur: 2950 },
    cardano: { usd: 0.45, eur: 0.42 },
    solana: { usd: 150, eur: 138 },
    polkadot: { usd: 6.5, eur: 6 },
    cosmos: { usd: 9, eur: 8.3 },
    "avalanche-2": { usd: 35, eur: 32 },
};

// The app fetches live prices from CoinGecko client-side on mount. Intercepting
// it keeps e2e runs deterministic and independent of a third-party API being up.
export async function mockCoinGeckoPrices(page: Page) {
    await page.route("https://api.coingecko.com/api/v3/simple/price**", async (route) => {
        await route.fulfill({ json: mockPrices });
    });
}
