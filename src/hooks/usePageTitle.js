import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | YOYO Fun N Foods` : "YOYO Fun N Foods";
    return () => { document.title = prev; };
  }, [title]);
}

export function usePageHeading(pageTitle) {
  usePageTitle(pageTitle);
}
