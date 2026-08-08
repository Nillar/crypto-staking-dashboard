import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { GlobalContext } from "@/context/globalContext";

// GlobalContext reads the current route via next/navigation's usePathname.
// Outside of the Next.js app runtime that hook has no provider to read from,
// so it needs a stand-in for every test that renders GlobalContext.
vi.mock("next/navigation", () => ({
    usePathname: () => "/",
}));

type PriceMap = Record<string, Record<string, number>>;

export function mockCoinPrices(overrides?: PriceMap): PriceMap {
    return {
        bitcoin: { usd: 65000, eur: 60000 },
        ethereum: { usd: 3200, eur: 2950 },
        cardano: { usd: 0.45, eur: 0.42 },
        solana: { usd: 150, eur: 138 },
        polkadot: { usd: 6.5, eur: 6 },
        cosmos: { usd: 9, eur: 8.3 },
        "avalanche-2": { usd: 35, eur: 32 },
        ...overrides,
    };
}

export function stubFetchWithPrices(prices: PriceMap = mockCoinPrices(), ok = true) {
    const fetchMock = vi.fn().mockResolvedValue({
        ok,
        status: ok ? 200 : 500,
        json: async () => prices,
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}

export function renderWithGlobalContext(ui: ReactElement, options?: RenderOptions) {
    const user = userEvent.setup();
    const result = render(<GlobalContext>{ui}</GlobalContext>, options);
    return { ...result, user };
}
