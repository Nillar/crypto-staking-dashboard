"use client";

import {JSX} from "react";
import DocSection from "@/components/documentation/DocSection";
import CodeBlock from "@/components/documentation/CodeBlock";
import DocLayout from "@/components/documentation/DocLayout";
import ArchitectureDiagram from "@/components/documentation/ArchitectureDiagram";
import styles from "@/assets/styles/page.module.scss";
import Image from "next/image";
import retryBtnImage from "../../assets/images/retryBtn.png";
import {Smile} from "lucide-react";

export default function DocumentationPage(): JSX.Element {
    const { documentation, retryBtnImg } = styles;
    return (
        <div className={documentation}>
            <DocLayout>
                <DocSection title="Introduction">
                    <p>
                        The goal of this application is to provide a simple and interactive
                        interface for exploring cryptocurrency staking. Users can input either
                        fiat or crypto amounts and instantly see how much they would earn over
                        different staking periods. The app retrieves real-time prices from
                        CoinGecko and visualizes the results in a chart.
                    </p>
                    <p>
                        The application is designed as a demo financial tool as well as
                        a demonstration of clean React/Next.js architecture, global state
                        management, and UI best practices.
                    </p>
                </DocSection>

                <DocSection
                    title="Libraries & Tools"
                    subtitle="Key technologies powering the app"
                >
                    <p>
                        This project leverages a modern React + Next.js stack, complemented by a
                        carefully selected set of libraries to improve performance, maintainability,
                        and developer experience.
                    </p>

                    <ul>
                        <li>
                            <strong>Next.js</strong> – for routing, layouts, and SSR/SSG features.
                        </li>
                        <li>
                            <strong>React (with TypeScript)</strong> – component-driven UI with type
                            safety.
                        </li>
                        <li>
                            <strong>SCSS Modules</strong> – encapsulated, theme-aware styles.
                        </li>
                        <li>
                            <strong>clsx</strong> – conditional className utility for clean class
                            toggling.
                        </li>
                        <li>
                            <strong>React Context API (GlobalContext)</strong> – centralized state for
                            theme, price rates, and form state.
                        </li>
                        <li>
                            <strong>CoinGecko API</strong> – real-time crypto pricing data.
                        </li>
                        <li>
                            <strong>recharts</strong> – lightweight, declarative charting for the
                            staking visualization.
                        </li>
                        <li>
                            <strong>react-select</strong> – accessible, customizable dropdowns for
                            crypto and fiat selections.
                        </li>
                        <li>
                            <strong>react-code-blocks</strong> – syntax-highlighted code snippets used
                            in this documentation.
                        </li>
                        <li>
                            <strong>lucide-react</strong> - modern-looking icons for better visualization
                        </li>
                    </ul>
                </DocSection>

                <DocSection title="Business Logic" subtitle="Live Chart Updates">
                    <p>
                        The central business logic of the app is that <strong>any change in user input immediately updates
                        the staking chart</strong>. This creates a seamless, real-time simulation experience: adjusting the
                        investment amount, changing the staking period, or switching currencies all trigger a recalculation
                        and refresh of the chart.

                        This ensures users always see the most accurate projection of their staking rewards without needing
                        to submit or refresh manually.
                    </p>
                </DocSection>

                <DocSection subtitle="Fiat–Crypto Conversion">
                    <p>
                        On top of live updates, the app provides a smooth <strong>two-way synchronization</strong> between
                        fiat and cryptocurrency amounts:
                    </p>
                    <ul>
                        <li>Users can type in either fiat or crypto.</li>
                        <li>The app tracks which amount field was last edited via `lastEdited`.</li>
                        <li>After a short debounce delay, the other field is recalculated using price data from CoinGecko.
                        </li>
                    </ul>
                    <p>
                        Example: Entering <code>$1,000</code> in fiat updates the crypto
                        field, and entering <code>0.5 ETH</code> updates the fiat field.
                    </p>
                    <CodeBlock
                        language="tsx"
                        code={`
const [amountInFiat, setAmountInFiat] = useState(50000);
const [amountInCrypto, setAmountInCrypto] = useState(0);
const [lastEdited, setLastEdited] = useState<"fiat" | "crypto">("fiat");

useEffect(() => {
  if (!currentPrice) return;

  if (lastEdited === "fiat") {
    setAmountInCrypto(amountInFiat / currentPrice);
  } else {
    setAmountInFiat(amountInCrypto * currentPrice);
  }
}, [amountInFiat, amountInCrypto, lastEdited, currentPrice]);
          `}
                    />
                </DocSection>

                <DocSection subtitle="Debouncing User Input">
                    <p>
                        To prevent recalculations and re-renders on every keystroke, input values are debounced. This
                        ensures a smoother typing experience while still keeping conversions accurate.
                    </p>
                    <p>
                        After 500ms of inactivity, the debounced value is applied. Effects run only on debounced values,
                        ensuring stability.
                    </p>
                    <CodeBlock
                        language="tsx"
                        code={`
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage:
const debouncedFiat = useDebounce(amountInFiat, 500);
const debouncedCrypto = useDebounce(amountInCrypto, 500);
          `}
                    />
                </DocSection>

                <DocSection subtitle="Staking Rewards">
                    <p>
                        Users can select a staking period. Rewards are calculated using:
                    </p>
                    <CodeBlock
                        language="ts"
                        code={`
reward = amountInCrypto * (APY / 100) * (days / 365)
          `}
                    />
                    <p>
                        The chart displays growth over time based on these calculations. APY (Annual Percent Yield)
                        values are predefined per coin.
                    </p>
                </DocSection>

                <DocSection
                    subtitle="Staking Returns"
                >
                    <p>
                        Based on the user&apos;s inputs (amount, period, APY), the app calculates projected staking returns.
                        The Staking Chart component is used for visualization.
                    </p>
                    <CodeBlock
                        code={`
const calculateStakingReturns = (
    principal: number,
    apy: number,
    days: number
): number => {
    const yearlyRate = apy / 100;
    const dailyRate = Math.pow(1 + yearlyRate, 1 / 365) - 1;
    return principal * Math.pow(1 + dailyRate, days);
};
                        `}
                        language="tsx"
                    />
                </DocSection>

                <DocSection title="Architecture">
                    <p>
                        The application is structured with a <b>clear separation of concerns</b> by utilizing global logic,
                        staking-specific components, and reusable utilities. This modular approach makes the project easy to
                        scale and maintain.
                    </p>
                </DocSection>
                <DocSection subtitle="Components">
                    <ul>
                        <li>
                            <b>Global</b>: Header, ThemeSwitcher
                        </li>
                        <li>
                            <b>Staking</b>: StakingForm, StakingChart
                        </li>
                        <li>
                            <b>Documentation</b>: DocSection, CodeBlock, ArchitectureDiagram
                        </li>
                    </ul>
                </DocSection>
                <DocSection subtitle="Global Context">
                    <p>Using <strong>global context</strong> to set the data which is consumed by the various components.
                    </p>
                    <CodeBlock
                        code={`
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
}`}
                        language="tsx"
                    />
                </DocSection>
                <DocSection subtitle="Data Flow">
                    <ol>
                        <li>Global context fetches real-time prices from CoinGecko.</li>
                        <li>StakingForm consumes context and calculates amounts.</li>
                        <li>
                            Changes are passed up via <code><strong>onChangeAction</strong></code> to update
                            StakingChart.
                        </li>
                    </ol>
                    <CodeBlock language="tsx" code={`useEffect(() => {
        onChangeAction({
            amountInFiat: debouncedFiat,
            amountInCrypto: debouncedCrypto,
            apy: coin.defaultApy,
            periodDays,
            cryptoId: coin.id,
            cryptoSymbol: coin.symbol.toUpperCase(),
            currency: fiat.toUpperCase(),
        });
    }, [debouncedFiat, debouncedCrypto, coin, periodDays, fiat, currentPrice, onChangeAction]);`}/>

                    <ArchitectureDiagram/>
                </DocSection>

                <DocSection
                    title="Error Handling"
                    subtitle="Gracefully recovering from failures"
                >
                    <p>
                        The app is designed to handle API errors gracefully. When a request to the{" "}
                        <strong>CoinGecko API</strong> fails, the error state is captured in{" "}
                        <code>GlobalContext</code>, and a retry mechanism is offered directly in the
                        UI.
                    </p>

                    <p>
                        Instead of breaking the app, a fallback screen is displayed with an error
                        message and a <strong>Retry</strong> button that allows the user to trigger
                        the API call again. This ensures the app remains functional even if external
                        services experience downtime.
                    </p>

                    {/* Screenshot of the Retry button */}
                    <Image
                        src={retryBtnImage}
                        alt="Error screen with Retry button"
                        className={retryBtnImg}
                    />

                    <p>Here’s a simplified example of the retry logic in context:</p>

                    <CodeBlock
                        language="tsx"
                        code={`
// GlobalContext.tsx
const [error, setError] = useState<string | null>(null);

const fetchPrices = async () => {
  setLoadingPrices(true);
  setError(null);

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(\`API error: \${res.status}\`);
    const data = await res.json();
    setPrices(transformData(data));
  } catch (e) {
    setError(e instanceof Error ? e.message : "Unknown error");
  } finally {
    setLoadingPrices(false);
  }
};
`}
                    />

                    <p>Usage in <strong>page.tsx</strong></p>
                    <CodeBlock language="tsx" code={`
{error && (
    <div className={clsx(errorWrap, {
        [light]: theme === "light",
        [dark]: theme === "dark",
    })}>
        <h1 className="error">⚠️ {error}</h1>
        <button onClick={refreshPrices}>Retry</button>
    </div>)}`
                    }/>
                </DocSection>

                <DocSection title="Codebase">
                    <p>All the code can be seen in <strong><a href="https://github.com/Nillar/crypto-staking-dashboard" style={{textDecoration: "underline"}}>Github</a></strong></p>
                    <p>Feel free to ask me questions at the interview <Smile size={18} style={{display: "inline"}}/></p>
                </DocSection>
            </DocLayout>
        </div>
    );
}