export const parseTwClassName = (twArray: any[] | string): string => {
  if (!twArray) return "";

  if (typeof twArray === "string") {
    return twArray.trim().replace(/\s+/g, " ");
  }

  if (!Array.isArray(twArray)) return "";

  const combined = twArray
    .map(obj =>
      [
        obj.noPrefix || "",
        obj.xl ? `xl:${obj.xl}` : "",
        obj.lg ? `lg:${obj.lg}` : "",
        obj.md ? `md:${obj.md}` : "",
        obj.sm ? `sm:${obj.sm}` : "",
        obj.hover ? `${obj.hover}` : ""
      ].join(" ")
    )
    .join(" ");

  return combined.replace(/\s+/g, " ").trim();
};
