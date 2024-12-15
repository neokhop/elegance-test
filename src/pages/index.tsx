import { getCookie } from "cookies-next";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { GoldPriceCard } from "@/components/GoldPriceCard";
import { formatRawDateToThai, formatUnixTimestampToThai } from "@/utils/formatDate";

import type { GetServerSideProps } from "next";
import type { ApiGoldSpot, ApiGoldSpotResponse, ApiGoldTH, ApiGoldTHResponse } from "@/types/goldResp";
import { TransactionTable } from "@/components/TransactionTable";
import { ApiTransaction } from "@/types/transaction";
import { Transaction } from "@prisma/client";

const checkStatus = (status: string) => {
  return status === "online";
};
export default function Home({ userId }: { userId: string }) {
  const [isRefresh, setIsRefresh] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState({
    id: "",
    spot: "",
    ninety_nine_nine: "",
    ninety_six_fifty: "",
  });
  const [price, setPrice] = useState<{
    spot: ApiGoldSpotResponse | undefined;
    th: ApiGoldTHResponse | undefined;
  }>({
    spot: undefined,
    th: undefined,
  });

  useEffect(() => {
    (async () => {
      const resPriceSpot = await fetch("/api/price-spot");
      const priceSpot = (await resPriceSpot.json()) as ApiGoldSpot;
      const resPrice = await fetch("/api/price");
      const price = (await resPrice.json()) as ApiGoldTH;
      setPrice({
        spot: priceSpot.response,
        th: price.response,
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (!res.ok) return;
      setStatus(data.response);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/tx");
      if (!res.ok) return;
      const data = (await res.json()) as ApiTransaction;
      setTransactions(data.response);
    })();
  }, [isRefresh]);

  if (price.spot === undefined || price.th === undefined) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 flex flex-col space-y-6 items-center">
        <GoldPriceCard
          title="Gold Spot"
          userID={userId}
          symbol="spot"
          date={formatRawDateToThai(price.spot.date)}
          buyPrice={checkStatus(status.spot) ? price.spot.items.xauPrice : 0}
          sellPrice={checkStatus(status.spot) ? price.spot.items.xauClose : 0}
          currency="USD"
          change={checkStatus(status.spot) ? price.spot.items.chgXau : ""}
          onRefresh={() => setIsRefresh((prev) => !prev)}
        />

        <GoldPriceCard
          title="ทองคำ 96.5%"
          userID={userId}
          symbol="96.50"
          date={formatUnixTimestampToThai(Number(price.th.date))}
          buyPrice={checkStatus(status.ninety_six_fifty) ? price.th.price.association.ask : 0}
          sellPrice={checkStatus(status.ninety_six_fifty) ? price.th.price.association.bid : 0}
          currency="THB"
          change={checkStatus(status.ninety_six_fifty) ? price.th.price.association.diff : ""}
          onRefresh={() => setIsRefresh((prev) => !prev)}
        />

        <GoldPriceCard
          title="ทองคำ 99.99%"
          userID={userId}
          symbol="99.99"
          date={formatUnixTimestampToThai(Number(price.th.date))}
          buyPrice={checkStatus(status.ninety_nine_nine) ? price.th.price.ninety_nine.ask : 0}
          sellPrice={checkStatus(status.ninety_nine_nine) ? price.th.price.ninety_nine.bid : 0}
          currency="THB"
          change={checkStatus(status.ninety_nine_nine) ? price.th.price.ninety_nine.diff : ""}
          onRefresh={() => setIsRefresh((prev) => !prev)}
        />
      </div>
      <div className="p-4 space-y-4">
        <div className="text-xl font-semibold text-gray-600">Transaction</div>
        <TransactionTable data={transactions} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = (await getCookie("user_id", { req, res })) as string | null;
  if (!userId) return { props: {} };
  return { props: { userId } };
};
