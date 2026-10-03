import newsData from "@/data/news.json";

export type NewsItem = {
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  summary: string;
  links: { label: string; url: string }[];
  image?: { src: string; alt: string; width: number; height: number };
};

type NewsContent = {
  title: string;
  articleLabel: string;
  items: NewsItem[];
};

export const news = newsData satisfies Record<string, NewsContent>;
