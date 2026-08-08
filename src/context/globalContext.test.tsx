import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithGlobalContext, stubFetchWithPrices, mockCoinPrices } from "@/test/testUtils";
import { useGlobalContext } from "@/context/globalContext";

function Consumer() {
    const { loadingPrices, prices, error, theme, fiat, toggleTheme, setFiat } = useGlobalContext();

    return (
        <div>
            <span data-testid="loading">{String(loadingPrices)}</span>
            <span data-testid="error">{error ?? ""}</span>
            <span data-testid="theme">{theme}</span>
            <span data-testid="fiat">{fiat}</span>
            <span data-testid="btc-usd">{prices.bitcoin?.usd ?? ""}</span>
            <button onClick={toggleTheme}>toggle theme</button>
            <button onClick={() => setFiat("eur")}>use eur</button>
        </div>
    );
}

describe("GlobalContext", () => {
    it("starts loadingPrices and populates prices once the fetch resolves", async () => {
        stubFetchWithPrices();
        renderWithGlobalContext(<Consumer />);

        expect(screen.getByTestId("loading")).toHaveTextContent("true");

        await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
        expect(screen.getByTestId("btc-usd")).toHaveTextContent("65000");
        expect(screen.getByTestId("error")).toHaveTextContent("");
    });

    it("toggles theme and persists the choice to localStorage", async () => {
        stubFetchWithPrices();
        const { user } = renderWithGlobalContext(<Consumer />);

        expect(await screen.findByTestId("theme")).toHaveTextContent("light");

        await user.click(screen.getByRole("button", { name: "toggle theme" }));

        expect(screen.getByTestId("theme")).toHaveTextContent("dark");
        expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("switches fiat currency and persists the choice to localStorage", async () => {
        stubFetchWithPrices();
        const { user } = renderWithGlobalContext(<Consumer />);

        expect(await screen.findByTestId("fiat")).toHaveTextContent("usd");

        await user.click(screen.getByRole("button", { name: "use eur" }));

        expect(screen.getByTestId("fiat")).toHaveTextContent("eur");
        expect(localStorage.getItem("fiat")).toBe("eur");
    });

    it("sets an error when the price API responds with a non-OK status", async () => {
        stubFetchWithPrices(mockCoinPrices(), false);
        renderWithGlobalContext(<Consumer />);

        await waitFor(() => expect(screen.getByTestId("error")).toHaveTextContent("API error: 500"));
    });

    it("sets an error when the fetch itself rejects (e.g. the API is unreachable)", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network down")));
        renderWithGlobalContext(<Consumer />);

        await waitFor(() => expect(screen.getByTestId("error")).toHaveTextContent("Network down"));
    });
});
