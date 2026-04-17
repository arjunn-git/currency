import React, { useMemo, useState } from 'react'
import Input from './components/Input'
import useCurrencyInfo from './hooks/useCurrencyinfo'
import './App.css'
import src from './assets/images/bg.jpg'

function App() {
  const [amount, setAmount] = useState(1)
  const [from, setFrom] = useState('usd')
  const [to, setTo] = useState('inr')
  const [copied, setCopied] = useState(false)

  const { data: currencyInfo, loading, error, lastUpdated, refetch } = useCurrencyInfo(from)
  const currencyOptions = useMemo(
    () => Object.keys(currencyInfo).length ? Object.keys(currencyInfo) : [from, to],
    [currencyInfo, from, to]
  )

  const convertedAmount = useMemo(
    () => (currencyInfo[to] && amount > 0 ? amount * currencyInfo[to] : 0),
    [amount, to, currencyInfo]
  )

  const isConversionReady = Boolean(currencyInfo[to] && amount > 0)

  const handleAmountChange = (value) => {
    setAmount(value < 0 ? 0 : value)
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  const copyToClipboard = async () => {
    if (!isConversionReady) return

    try {
      await navigator.clipboard.writeText(convertedAmount.toFixed(2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const refreshRates = () => refetch()

  return (
    <div
        className="w-full min-h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12"
        style={{
            backgroundImage: `url(${src})`,
        }}
    >
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="border-2 border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-md bg-white/20 shadow-2xl ring-1 ring-white/10">
                <div className="flex justify-between items-center mb-6 sm:mb-7 md:mb-8">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white drop-shadow-xl tracking-wide leading-tight">
                    Currency Converter
                  </h1>
                  <button
                    onClick={refreshRates}
                    disabled={loading}
                    className="text-white hover:text-blue-200 disabled:opacity-50 p-2 sm:p-3 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-110"
                    title="Refresh rates"
                  >
                    🔄
                  </button>
                </div>

                {error && (
                  <div className="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-red-100/90 border border-red-400 text-red-800 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-lg">
                    <span className="font-semibold text-sm sm:text-base">⚠️ Error:</span> {error}
                  </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="w-full mb-2">
                        <Input
                          label="From"
                          amount={amount}
                          currencyOptions={currencyOptions}
                          onCurrencyChange={setFrom}
                          selectedCurrency={from}
                          onAmountChange={handleAmountChange}
                          disabled={loading}
                        />
                    </div>
                    <div className="relative w-full h-0.5 my-4 sm:my-5 md:my-6">
                        <button
                            type="button"
                            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/80 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-base sm:text-lg"
                            onClick={swap}
                            disabled={loading}
                        >
                            {loading ? '⏳' : '⇅'}
                        </button>
                    </div>
                    <div className="w-full mt-2 mb-4 sm:mb-5 md:mb-6">
                        <Input
                            label="To"
                            amount={convertedAmount}
                            currencyOptions={currencyOptions}
                            onCurrencyChange={setTo}
                            amountDisabled={true}
                            selectedCurrency={to}
                            disabled={loading}
                        />
                        {isConversionReady && (
                          <button
                            type="button"
                            onClick={copyToClipboard}
                            className="mt-3 w-full py-2.5 px-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 hover:text-blue-900 border-2 border-blue-300 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                          >
                            {copied ? (
                              <>
                                <span>✅</span>
                                <span>Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <span>📋</span>
                                <span>Copy Result</span>
                              </>
                            )}
                          </button>
                        )}
                    </div>
                    {loading && (
                      <div className="w-full mb-4 sm:mb-5 md:mb-6 text-center text-blue-700 bg-blue-50/80 p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-lg border border-blue-200">
                        <span className="font-semibold text-sm sm:text-base">🔄 Loading currency rates...</span>
                      </div>
                    )}
                    {lastUpdated && !loading && (
                      <div className="w-full mb-4 sm:mb-5 md:mb-6 text-center text-xs sm:text-sm text-gray-700 bg-gray-50/80 p-2 sm:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-lg border border-gray-200">
                        <span className="font-medium">📅 Last updated:</span> {lastUpdated}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 font-bold text-base sm:text-lg tracking-wide"
                      disabled={loading || !isConversionReady}
                    >
                      Convert {from.toUpperCase()} to {to.toUpperCase()}
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}

export default App
