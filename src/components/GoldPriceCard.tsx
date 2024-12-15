import clsx from "clsx";
import { useRouter } from "next/router";
import { useState, type FC } from "react";
import { BuySell } from "@/components/BuySell";

type GoldPriceProps = {
  title: string;
  userID: string;
  symbol: "spot" | "96.50" | "99.99";
  date: string;
  buyPrice: number;
  sellPrice: number;
  currency: string;
  change: string | number;
  onRefresh?: () => void;
};

export const GoldPriceCard: FC<GoldPriceProps> = ({
  title,
  userID,
  symbol,
  date,
  buyPrice,
  sellPrice,
  currency,
  change,
  onRefresh,
}) => {
  const router = useRouter();
  const [isBuy, setIsBuy] = useState(false);
  const [isSell, setIsSell] = useState(false);
  const [selectdPrice, setSelectedPrice] = useState(0);

  const handleBuy = () => {
    if (!userID) return router.push("/signin");
    setIsBuy(true);
    setSelectedPrice(buyPrice);
  };

  const handleSell = () => {
    if (!userID) return router.push("/signin");
    setIsSell(true);
    setSelectedPrice(sellPrice);
  };

  return (
    <>
      <BuySell
        type={isBuy ? "buy" : "sell"}
        userID={userID}
        currency={currency}
        isOpen={isBuy || isSell}
        symbol={symbol}
        price={selectdPrice}
        onOpenChange={(isOpen) => {
          setIsBuy(isOpen);
          setIsSell(isOpen);
          if (onRefresh) onRefresh();
        }}
      />
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6 relative overflow-hidden">
        {/* Title Section */}
        <div className="text-center relative z-10">
          <div className="flex gap-2 justify-center items-center">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            {change && (
              <span className={`font-semibold ${Number(change) >= 0 ? "text-green-600" : "text-red-600"}`}>
                ({change?.toLocaleString("en-US", { maximumFractionDigits: 2 })})
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{date}</p>
        </div>

        {/* Price Section */}
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-extrabold text-green-600 flex gap-2">
              <p className="text-gray-500 font-medium text-lg">ราคาซื้อ</p>
              <p className="text-sm">{currency}</p>
            </div>
            <p className="text-2xl font-extrabold text-green-600 flex gap-2">
              {buyPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-extrabold text-red-600 flex gap-2">
              <p className="text-gray-500 font-medium text-lg">ราคาขาย</p>
              <p className="text-sm">{currency}</p>
            </div>
            <p className="text-2xl font-extrabold text-red-600 flex gap-2">
              {sellPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Buy & Sell Buttons */}
        <div className="flex justify-between space-x-4 relative z-10">
          <button
            className={clsx(
              buyPrice === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "shadow bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 hover:shadow-lg transition-all",
              "w-full font-bold text-white py-2 rounded-lg"
            )}
            onClick={handleBuy}
            disabled={buyPrice === 0}
          >
            ซื้อ
          </button>
          <button
            className={clsx(
              buyPrice === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "shadow bg-gradient-to-r from-red-400 to-red-600 hover:opacity-90 hover:shadow-lg transition-all",
              "w-full font-bold text-white py-2 rounded-lg"
            )}
            onClick={handleSell}
            disabled={sellPrice === 0}
          >
            ขาย
          </button>
        </div>
      </div>
    </>
  );
};
