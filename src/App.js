import "./App.css";
import CurrencyCalculator from "./components/CurrencyCalculator";

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1 className="logoText">Currency converter</h1>
      </header>
      <div className="currencyWrapper">
        <CurrencyCalculator />
      </div>
    </div>
  );
}

export default App;
