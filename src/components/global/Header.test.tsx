import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithGlobalContext, stubFetchWithPrices } from "@/test/testUtils";
import Header from "./Header";

describe("Header", () => {
    beforeEach(() => {
        stubFetchWithPrices();
    });

    it("marks the Dashboard link active for the mocked '/' route", async () => {
        renderWithGlobalContext(<Header />);

        const dashboardButton = await screen.findByRole("button", { name: "Dashboard" });
        const docsButton = screen.getByRole("button", { name: "Documentation" });

        expect(dashboardButton).toBeDisabled();
        expect(docsButton).not.toBeDisabled();
    });

    it("renders the theme switcher", async () => {
        renderWithGlobalContext(<Header />);
        expect(await screen.findByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    });
});
