"use client";

import {JSX, useEffect, useMemo, useState} from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Select from "react-select";
import {coins, currencies} from "@/lib/coins";
import {useGlobalContext} from "@/context/globalContext";
import styles from "./StakingForm.module.scss";
import {clsx} from "clsx";
import { Bitcoin } from 'lucide-react';

const { wrap, light, dark, headingContainer, iconContainer, stakingForm, formGroup, cryptoSelect, fiatSelect, stakingSelect } = styles;

type Fiat = "usd" | "eur";
type StakingFormProps = {
    onChangeAction: (data: {
        amountInCrypto: number;
        amountInFiat: number;
        apy: number;
        cryptoId: string;
        cryptoSymbol: string;
        currency: string;
        periodDays: number;
    }) => void;
};

const stakingPeriodOptions = [
    {value: 30, label: "30 days"},
    {value: 60, label: "60 days"},
    {value: 90, label: "90 days"},
    {value: 180, label: "180 days"},
    {value: 365, label: "1 year"},
    {value: 730, label: "2 years"},
];

export default function StakingForm({onChangeAction}: StakingFormProps): JSX.Element {
    const { fiat, setFiat, prices, theme } = useGlobalContext();
    const [selectedCoinId, setSelectedCoinId] = useState(coins[0].id);
    const [periodDays, setPeriodDays] = useState(365);
    const [amountInFiat, setAmountInFiat] = useState(50000);
    const [amountInCrypto, setAmountInCrypto] = useState(0);
    const [lastEdited, setLastEdited] = useState<"fiat" | "crypto">("fiat");

    const coin = useMemo(() => coins.find((c) => c.id === selectedCoinId)!, [selectedCoinId]);
    const currentPrice = prices[selectedCoinId]?.[fiat];

    const coinOptions = useMemo(
        () => coins.map((c) => ({ value: c.id, label: `${c.symbol.toUpperCase()} — ${c.name}` })),
        []
    );
    const coinOptionValue = coinOptions.find((o) => o.value === selectedCoinId);

    const periodOptionValue =
        stakingPeriodOptions.find((o) => o.value === periodDays) ?? stakingPeriodOptions[1];

    const currenciesOptions = currencies.map((c) => ({ value: c as Fiat, label: c.toUpperCase() }));

    // debounce values directly
    const debouncedFiat = useDebounce(amountInFiat, 500);
    const debouncedCrypto = useDebounce(amountInCrypto, 500);

    // notify parent (chart)
    useEffect(() => {
        onChangeAction({
            amountInFiat: debouncedFiat,
            amountInCrypto: debouncedCrypto,
            apy: coin.defaultApy,
            periodDays,
            cryptoId: coin.id,
            cryptoSymbol: coin.symbol.toUpperCase(),
            currency: fiat.toUpperCase(),
        });
    }, [debouncedFiat, debouncedCrypto, coin, periodDays, fiat, currentPrice, onChangeAction]);

    // keep fiat <-> crypto in sync
    useEffect(() => {
        if (!currentPrice || currentPrice <= 0) return;

        if (lastEdited === "fiat") {
            const cryptoVal = amountInFiat / currentPrice;
            if (!Number.isNaN(cryptoVal)) setAmountInCrypto(cryptoVal);
        }
        else if (lastEdited === "crypto") {
            const fiatVal = amountInCrypto * currentPrice;
            if (!Number.isNaN(fiatVal)) setAmountInFiat(fiatVal);
        }
    }, [amountInFiat, amountInCrypto, lastEdited, currentPrice]);

    return (
        <div className={clsx(wrap, {
            [light]: theme === 'light',
            [dark]: theme === 'dark'
        })}>
            <div className={headingContainer}>
                <div className={iconContainer}>
                    <Bitcoin size={24}/>
                </div>
                <h1>Crypto Staking</h1>
            </div>

            <form className={stakingForm}>
                <div className={formGroup}>
                    <label htmlFor="fieldCrypto">Select Crypto</label>
                    <Select
                        inputId="fieldCrypto"
                        options={coinOptions}
                        value={coinOptionValue}
                        onChange={(opt) => {
                            if (!opt) return;
                            setLastEdited("fiat");
                            setSelectedCoinId(opt.value);
                        }}
                        className={cryptoSelect}
                        classNamePrefix={cryptoSelect}
                        isSearchable={false}
                    />
                </div>

                <div className={formGroup}>
                    <label htmlFor="fieldFiat">Fiat Currency</label>
                    <Select
                        inputId="fieldFiat"
                        options={currenciesOptions}
                        value={{value: fiat as Fiat, label: fiat.toUpperCase()}}
                        onChange={(opt) => {
                            if (!opt) return;
                            setLastEdited("fiat");
                            setFiat(opt.value);
                        }}
                        className={fiatSelect}
                        classNamePrefix={fiatSelect}
                        isSearchable={false}
                    />
                </div>

                <div className={formGroup}>
                    <label htmlFor="fieldAmountFiat">Amount in {fiat.toUpperCase()}</label>
                    <input
                        id="fieldAmountFiat"
                        type="number"
                        step="0.1"
                        min={1000}
                        max={1000000}
                        value={amountInFiat}
                        onChange={(e) => {
                            // Remove leading zeros but keep "0" if that's the only digit
                            if (e.target.value.length > 1 && e.target.value.startsWith("0")) {
                                e.target.value = e.target.value.replace(/^0+/, "");
                            }
                            setLastEdited("fiat");
                            setAmountInFiat(Number(e.target.value));
                        }}
                    />
                </div>

                <div className={formGroup}>
                    <label htmlFor="fieldAmountCrypto">Amount in {coin.symbol.toUpperCase()}</label>
                    <input
                        id="fieldAmountCrypto"
                        type="number"
                        step="0.1"
                        value={amountInCrypto}
                        onChange={(e) => {
                            if (e.target.value.length > 1 && e.target.value.startsWith("0")) {
                                e.target.value = e.target.value.replace(/^0+/, "");
                            }
                            setLastEdited("crypto");
                            setAmountInCrypto(Number(e.target.value));
                        }}
                    />
                </div>

                <div className={formGroup}>
                    <label htmlFor="fieldPeriod">Staking Period</label>
                    <Select
                        inputId="fieldPeriod"
                        options={stakingPeriodOptions}
                        value={periodOptionValue}
                        onChange={(opt) => {
                            if (!opt) return;
                            setPeriodDays(opt.value);
                        }}
                        className={stakingSelect}
                        classNamePrefix={stakingSelect}
                        isSearchable={false}
                    />
                </div>
            </form>
        </div>
    );
}