import type { MetadataRoute } from "next";
import { SITE_URL } from "./siteConfig";

/*
 * 현재 공개 페이지는 스토어 메인 하나다.
 * 교재 상세 페이지가 생기면 여기서 목록을 조회해 URL을 추가한다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
