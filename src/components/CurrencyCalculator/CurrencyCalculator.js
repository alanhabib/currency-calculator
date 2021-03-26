import React, { useEffect, useState } from "react";
import CurrencyInput from "../CurrencyInput";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import EuroIcon from "@material-ui/icons/Euro";
import { usePrevious } from "../../utils/hooks";
import "./CurrencyCalculator.css";
import { ENV } from "../../core/env";

const CurrencyCalculator = () => {
  const [currencyOption, setCurrencyOption] = useState([]);
  const [toCurrency, setToCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [toAmount, setToAmount] = useState(0);
  const [fromAmount, setFromAmount] = useState(0);
  const [error, setError] = useState("");

  // Get the previous value (was passed into hook on last render)
  const prevCurrency = usePrevious(toCurrency);
  const prevExchangeRate = usePrevious(exchangeRate);
  console.log("### CURRENCY CHANGE");
  useEffect(() => {
    console.log("### FROM NOW");
    const fetchDataHandler = async () => {
      try {
        const res = await fetch(ENV.BASE_URL);
        const currencyData = await res.json();
        const rates = Object.keys(currencyData.rates);
        const firstCurrency = rates[0];
        setCurrencyOption([currencyData.base, ...rates]);
        setToCurrency(firstCurrency);
        setExchangeRate(currencyData.rates[firstCurrency]);
      } catch (error) {
        setError(error);
      }
    };
    fetchDataHandler();
  }, []);

  useEffect(() => {
    if (prevCurrency !== toCurrency) {
      console.log("### FROM PREVIOUS");
      const exchangeRateHandler = async () => {
        const res = await fetch(`${ENV.BASE_URL}&symbols=${toCurrency}`);
        const data = await res.json();
        setExchangeRate(data.rates[toCurrency]);
      };
      exchangeRateHandler();
    }
  }, [toCurrency, prevCurrency]);

  useEffect(() => {
    if (prevExchangeRate !== exchangeRate) {
      console.log("### FROM PREVIOUS 2");
      setToAmount(parseFloat(fromAmount * exchangeRate).toFixed(2));
    }
  }, [exchangeRate]);

  const fromAmountChangeHandler = (event) => {
    event.preventDefault();
    console.log("### EVENT TARGET: ", typeof event.target.value);
    setFromAmount(event.target.value);
    setToAmount(parseFloat(event.target.value * exchangeRate).toFixed(2));
  };

  const toAmountChangeHandler = (event) => {
    event.preventDefault();
    setToAmount(event.target.value);
    setFromAmount(parseFloat(event.target.value / exchangeRate).toFixed(2));
  };

  return (
    <div className="wrapper">
      <div className="euroInputWrapper">
        <CurrencyInput
          onChangeAmount={fromAmountChangeHandler}
          currencyOptions={0}
          amount={fromAmount}
        />
        <EuroIcon className="euroIcon" />
      </div>
      <SwapHorizIcon />
      <CurrencyInput
        onChangeAmount={toAmountChangeHandler}
        currencyOptions={currencyOption}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        selectedCurrency={toCurrency}
        amount={toAmount}
      />
      {error && <div>Something went wrong {error}</div>}
    </div>
  );
};

export default CurrencyCalculator;
