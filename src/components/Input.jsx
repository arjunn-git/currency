import React, { useId } from 'react'

function Input({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    selectedCurrency = "usd",
    amountDisabled = false,
    currencyDisabled = false,
    disabled = false,
    className = "",
}) {

    const amountInputId = useId();
    const isDisabled = disabled || amountDisabled;
    const isCurrencyDisabled = disabled || currencyDisabled;

    return (
        <div className={`bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm flex shadow-lg border border-white/20 ${className} ${isDisabled ? 'opacity-60' : ''} transition-all duration-200`}>
            <div className="w-1/2 pr-2 sm:pr-3">
                <label htmlFor={amountInputId} className="text-gray-700 mb-2 sm:mb-3 inline-block font-semibold text-sm sm:text-base">
                    {label}
                </label>
                <input
                    id={amountInputId}
                    className="outline-none w-full bg-transparent py-1.5 sm:py-2 text-base sm:text-lg font-medium disabled:cursor-not-allowed placeholder-gray-400"
                    type="number"
                    placeholder="0.00"
                    disabled={isDisabled}
                    value={amount}
                    onChange={(e) => onAmountChange && onAmountChange(Number(e.target.value))}
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="w-1/2 flex flex-wrap justify-end text-right pl-2 sm:pl-3">
                <p className="text-gray-700 mb-2 sm:mb-3 w-full font-semibold text-sm sm:text-base">Currency</p>
                <select
                    className="rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 cursor-pointer outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base shadow-sm w-full"
                    value={selectedCurrency}
                    onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
                    disabled={isCurrencyDisabled}
                >

                    {currencyOptions.map((currency) => (
                        <option key={currency} value={currency} className="font-medium">
                            {currency.toUpperCase()}
                        </option>
                    ))}

                </select>
            </div>
        </div>
    );
}

export default Input;