import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithGlobalContext, stubFetchWithPrices } from "@/test/testUtils";
import ThemeSwitcher from "./ThemeSwitcher";
import styles from "./ThemeSwitcher.module.scss";

describe("ThemeSwitcher", () => {
    beforeEach(() => {
        stubFetchWithPrices();
    });

    it("renders a toggle button", async () => {
        renderWithGlobalContext(<ThemeSwitcher />);
        expect(await screen.findByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    });

    it("starts in light mode and switches to dark on click", async () => {
        const { user } = renderWithGlobalContext(<ThemeSwitcher />);
        const button = await screen.findByRole("button", { name: /toggle theme/i });

        expect(button.className).toContain(styles.light);
        expect(button.className).not.toContain(styles.dark);

        await user.click(button);

        await waitFor(() => expect(button.className).toContain(styles.dark));
        expect(button.className).not.toContain(styles.light);
        expect(localStorage.getItem("theme")).toBe("dark");
    });
});
