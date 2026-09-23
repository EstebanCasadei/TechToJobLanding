import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => ({
  locale: "es",
  messages: (await import("../messages/es.json")).default,
}));
