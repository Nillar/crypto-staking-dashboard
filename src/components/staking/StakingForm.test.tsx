import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithGlobalContext, stubFetchWithPrices } from "@/test/testUtils";
import StakingForm from "./StakingForm";

describe("StakingForm", () => {
    beforeEach(() => {
        stubFetchWithPrices();
    });

    it("syncs the crypto amount immediately when the fiat amount changes, and notifies the parent after the debounce", async () => {
        const onChangeAction = vi.fn();
        const { user } = renderWithGlobalContext(<StakingForm onChangeAction={onChangeAction} />);

        const fiatInput = (await screen.findByLabelText(/Amount in USD/i)) as HTMLInputElement;
        const cryptoInput = screen.getByLabelText(/Amount in BTC/i) as HTMLInputElement;

        await user.clear(fiatInput);
        await user.type(fiatInput, "20000");

        await waitFor(() => {
            expect(Number(cryptoInput.value)).toBeCloseTo(20000 / 65000, 5);
        });

        await waitFor(
            () => {
                const lastCall = onChangeAction.mock.calls.at(-1)?.[0];
                expect(lastCall?.amountInFiat).toBe(20000);
                expect(lastCall?.amountInCrypto).toBeCloseTo(20000 / 65000, 5);
            },
            { timeout: 1500 }
        );
    });

    it("syncs the fiat amount when the crypto amount changes", async () => {
        const onChangeAction = vi.fn();
        const { user } = renderWithGlobalContext(<StakingForm onChangeAction={onChangeAction} />);

        const cryptoInput = (await screen.findByLabelText(/Amount in BTC/i)) as HTMLInputElement;
        const fiatInput = screen.getByLabelText(/Amount in USD/i) as HTMLInputElement;

        // Wait for the initial fiat->crypto sync so we know the stubbed price has
        // loaded before driving the crypto->fiat direction below.
        await waitFor(() => expect(Number(cryptoInput.value)).toBeGreaterThan(0));

        await user.clear(cryptoInput);
        await user.type(cryptoInput, "2");

        await waitFor(() => {
            expect(Number(fiatInput.value)).toBeCloseTo(2 * 65000, 2);
        });
    });

    it("strips leading zeros from a typed amount", async () => {
        const onChangeAction = vi.fn();
        const { user } = renderWithGlobalContext(<StakingForm onChangeAction={onChangeAction} />);

        const fiatInput = (await screen.findByLabelText(/Amount in USD/i)) as HTMLInputElement;
        await user.clear(fiatInput);
        await user.type(fiatInput, "05000");

        expect(fiatInput).toHaveValue(5000);
    });

    it("updates apy/cryptoId/cryptoSymbol when a different coin is selected", async () => {
        const onChangeAction = vi.fn();
        const { user } = renderWithGlobalContext(<StakingForm onChangeAction={onChangeAction} />);

        const cryptoSelect = await screen.findByLabelText("Select Crypto");
        await user.click(cryptoSelect);

        const ethereumOption = await screen.findByText("ETH — Ethereum");
        await user.click(ethereumOption);

        await waitFor(() => {
            const lastCall = onChangeAction.mock.calls.at(-1)?.[0];
            expect(lastCall?.cryptoId).toBe("ethereum");
            expect(lastCall?.cryptoSymbol).toBe("ETH");
            expect(lastCall?.apy).toBe(14);
        });
    });
});
