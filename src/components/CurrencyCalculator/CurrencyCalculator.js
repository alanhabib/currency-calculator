import React, { useEffect, useState } from "react";
import CurrencyInput from "../CurrencyInput";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import EuroIcon from "@material-ui/icons/Euro";
import { usePrevious } from "../../utils/hooks";
import "./CurrencyCalculator.css";

const CURRENCY_URL =
  "http://data.fixer.io/api/latest?access_key=d67af8166bbc4dc681b75242e9a06fd5";

const CurrencyCalculator = () => {
  const [currencyOption, setCurrencyOption] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [toAmount, setToAmount] = useState(0);
  const [fromAmount, setFromAmount] = useState(0);
  const [error, setError] = useState("");

  const prevCurrency = usePrevious(toCurrency);
  const prevExchangeRate = usePrevious(exchangeRate);

  useEffect(() => {
    const fetchDataHandler = async () => {
      try {
        const res = await fetch(CURRENCY_URL);
        const currencyData = await res.json();
        const rates = Object.keys(currencyData.rates);
        const firstCurrency = rates[0];
        setCurrencyOption([...currencyData.base, ...rates]);
        setFromCurrency(currencyData.base);
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
      const exchangeRateHandler = async () => {
        const res = await fetch(`${CURRENCY_URL}&symbols=${toCurrency}`);
        const data = await res.json();
        setExchangeRate(data.rates[toCurrency]);
      };
      exchangeRateHandler();
    }
  }, [toCurrency, prevCurrency]);

  useEffect(() => {
    if (prevExchangeRate !== exchangeRate) {
      setToAmount(fromAmount * exchangeRate);
    }
  }, [exchangeRate]);

  const fromAmountChangeHandler = (event) => {
    event.preventDefault();
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
          currencyOptions={currencyOption}
          options={false}
          onChangeCurrency={fromCurrency}
          selectedCurrency={fromCurrency}
          amount={fromAmount}
        />
        <EuroIcon className="euroIcon" />
      </div>
      <SwapHorizIcon />
      <CurrencyInput
        options={true}
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
