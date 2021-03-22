import React from "react";
import "./CurrencyInput.css";

const CurrencyInput = ({
  amount,
  currencyOptions = [],
  selectedCurrency,
  onChangeAmount,
  onChangeCurrency,
}) => {
  return (
    <div className="currencyInputWrapper">
      <input
        type="number"
        className="input"
        value={amount}
        onChange={onChangeAmount}
      />
      {currencyOptions.length && (
        <select value={selectedCurrency} onChange={onChangeCurrency}>
          {currencyOptions?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CurrencyInput;
