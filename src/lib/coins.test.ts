import { describe, it, expect } from "vitest";
import { coins, currencies } from "./coins";

describe("coins", () => {
    it("has unique ids", () => {
        const ids = coins.map((coin) => coin.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("has unique symbols", () => {
        const symbols = coins.map((coin) => coin.symbol);
        expect(new Set(symbols).size).toBe(symbols.length);
    });

    it("gives every coin an id, symbol, name, and positive defaultApy", () => {
        coins.forEach((coin) => {
            expect(coin.id).toBeTruthy();
            expect(coin.symbol).toBeTruthy();
            expect(coin.name).toBeTruthy();
            expect(coin.defaultApy).toBeGreaterThan(0);
        });
    });
});

describe("currencies", () => {
    it("includes usd", () => {
        expect(currencies).toContain("usd");
    });

    it("includes eur", () => {
        expect(currencies).toContain("eur");
    });

    it("has no duplicates", () => {
        expect(new Set(currencies).size).toBe(currencies.length);
    });
});
