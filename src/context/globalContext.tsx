"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    JSX,
} from "react";
import { usePathname } from "next/navigation";
import { coins, currencies } from "@/lib/coins";

type Theme = "light" | "dark";
type Fiat = "usd" | "eur";

interface PricesMap {
    [coinId: string]: {
        [fiat: string]: number;
    };
}

interface GlobalContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
    activePage: string;
    fiat: Fiat;
    setFiat: (f: Fiat) => void;
    prices: PricesMap;
    loadingPrices: boolean;
    error: string | null;
    refreshPrices: () => Promise<void>;
}

const GlobalContextCtx = createContext<GlobalContextValue | undefined>(
    undefined
);

export function GlobalContext({ children }: { children: ReactNode }): JSX.Element {
    const [theme, setThemeState] = useState<Theme>("light");
    const [fiat, setFiatState] = useState<Fiat>("usd");
    const [mounted, setMounted] = useState(false);

    const [prices, setPrices] = useState<PricesMap>({});
    const [loadingPrices, setLoadingPrices] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activePage, setActivePage] = useState<string>("Dashboard");
    const pathname = usePathname();
    // On mount: theme & fiat
    useEffect(() => {
        // Theme
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        if (storedTheme) {
            setThemeState(storedTheme);
            document.documentElement.classList.toggle("dark", storedTheme === "dark");
            document.documentElement.classList.toggle("light", storedTheme === "light");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initial = prefersDark ? "dark" : "light";
            setThemeState(initial);
            document.documentElement.classList.toggle("dark", initial === "dark");
            document.documentElement.classList.toggle("light", initial === "light");
        }

        // Fiat
        const storedFiat = localStorage.getItem("fiat") as Fiat | null;
        if (storedFiat) setFiatState(storedFiat);

        setMounted(true);
    }, []);

    // Sync page with route
    useEffect(() => {
        if (pathname === "/") {
            setActivePage("Dashboard");
        } else if (pathname.startsWith("/documentation")) {
            setActivePage("Documentation");
        } else {
            setActivePage("Dashboard"); // fallback
        }
    }, [pathname]);

    // Fetch all prices once or when refreshed
    const fetchPrices = async () => {
        setLoadingPrices(true);
        setError(null);

        try {
            // build ids string: "bitcoin,ethereum,cardano,..."
            const ids = coins.map((c) => c.id).join(",");

            // build currencies string: "usd,eur"
            const vsCurrencies = currencies.join(",");

            const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vsCurrencies}`);

            if (!res.ok) {
                console.error("Bad response");
                setError(`API error: ${res.status}`);
            }

            const data = await res.json();
            const m: PricesMap = {};

            for (const [coinId, fiatData] of Object.entries(data)) {
                m[coinId] = fiatData as Record<string, number>;
            }
            setPrices(m);
        } catch (e) {
            console.error("Failed to fetch coin prices", e);
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoadingPrices(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        document.documentElement.classList.toggle("light", newTheme === "light");
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const setFiat = (f: Fiat) => {
        setFiatState(f);
        localStorage.setItem("fiat", f);
    };

    if (!mounted) return <></>;

    return (
        <GlobalContextCtx.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
                fiat,
                setFiat,
                prices,
                loadingPrices,
                error,
                refreshPrices: fetchPrices,
                activePage
            }}
        >
            {children}
        </GlobalContextCtx.Provider>
    );
}

export function useGlobalContext() {
    const context = useContext(GlobalContextCtx);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalContext");
    }
    return context;
}
