import { getRequestConfig } from "next-intl/server";
import { news } from "@/lib/news";

export default getRequestConfig(async () => ({
  locale: "es",
  messages: {
    ...(await import("../messages/es.json")).default,
    news: news.es,
  },
}));
