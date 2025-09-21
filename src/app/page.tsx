"use client";

import {JSX, useState} from "react";
import {useGlobalContext} from "@/context/globalContext";
import StakingForm from "@/components/staking/StakingForm";
import StakingChart from "@/components/staking/StakingChart";
import styles from "@/assets/styles/page.module.scss";
import {clsx} from "clsx";

const {dashboard, errorWrap, light, dark} = styles;

export default function Page(): JSX.Element {
    const {fiat, loadingPrices, error, refreshPrices, theme} = useGlobalContext();
    const [formData, setFormData] = useState({
        amountInFiat: 10000,
        amountInCrypto: 0,
        apy: 0,
        periodDays: 60,
        cryptoId: "bitcoin"
    });

    return (
        <div className={dashboard}>
            <StakingForm onChangeAction={setFormData}/>

            {error && (
                <div className={clsx(errorWrap, {
                    [light]: theme === "light",
                    [dark]: theme === "dark",
                })}>
                    <h1 className="error">⚠️ {error}</h1>
                    <button onClick={refreshPrices}>Retry</button>
                </div>
            )}

            {!loadingPrices && !error && (
                <StakingChart
                    amountInCrypto={formData.amountInCrypto}
                    amountInFiat={formData.amountInFiat}
                    apy={formData.apy}
                    periodDays={formData.periodDays}
                    cryptoId={formData.cryptoId}
                    fiatCurrency={fiat}
                />
            )}
        </div>
    );
}
