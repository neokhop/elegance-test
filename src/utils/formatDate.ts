import "dayjs/locale/th";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(localizedFormat);
dayjs.extend(buddhistEra);

export const formatRawDateToThai = (rawDate: string) => {
  const cleanDate = rawDate.replace(/(\d+)(st|nd|rd|th)/, "$1");

  // Remove any extra text like "NY"
  const cleanedDateString = cleanDate.replace(/,?\s?[A-Za-z]+$/, "");
  const parsedDate = dayjs(cleanedDateString);

  if (!parsedDate.isValid()) throw new Error("Invalid date format");

  const thaiFormattedDate = parsedDate
    .locale("th") // Use Thai locale
    .format("DD MMMM BBBB ([เวลา] HH:mm น.)");

  return thaiFormattedDate;
};

export const formatUnixTimestampToThai = (unixTimestamp: number) => {
  return dayjs.unix(unixTimestamp).locale("th").format("DD MMMM BBBB ([เวลา] HH:mm น.)");
};
