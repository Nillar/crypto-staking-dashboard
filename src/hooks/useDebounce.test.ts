import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns the initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("a", 300));
        expect(result.current).toBe("a");
    });

    it("does not update before the delay has elapsed", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: "a" },
        });

        rerender({ value: "b" });
        act(() => {
            vi.advanceTimersByTime(200);
        });

        expect(result.current).toBe("a");
    });

    it("updates to the latest value once the delay elapses", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: "a" },
        });

        rerender({ value: "b" });
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(result.current).toBe("b");
    });

    it("resets the timer on rapid successive changes", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: "a" },
        });

        rerender({ value: "b" });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        rerender({ value: "c" });
        act(() => {
            vi.advanceTimersByTime(200);
        });

        expect(result.current).toBe("a");

        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(result.current).toBe("c");
    });
});
