import PRICE_CONFIG from "@/config/price";
export const priceSpotHandler = async () => {
  const res = await fetch(PRICE_CONFIG.API_SPOT_URL);
  const statusCode = res.status;
  const data = await res.json();
  if (statusCode !== 200 || !data || (data ?? []).length === 0) {
    return {
      status: "failure",
      response: "Service is unavailable, Please try again later.",
    };
  }

  return {
    status: "success",
    response: {
      date: data.date,
      items: data.items[0],
    },
  };
};
