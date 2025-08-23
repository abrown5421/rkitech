export const parseTwClassName = (TwClassName: any[], activePrefix?: string | undefined): string => {
  if (!Array.isArray(TwClassName)) return "";
  
  return TwClassName
    .map((classObj) => {
      if (!classObj || typeof classObj !== "object") return "";
      
      const { noPrefix = "", md = "", xl = "", hover = "" } = classObj;
      
      let activeClass = "";
      
      if (activePrefix === "md") {
        activeClass = md || noPrefix;
      } else if (activePrefix === "xl") {
        activeClass = xl || md || noPrefix;
      } else {
        activeClass = noPrefix;
      }
      const cleanClass = activeClass.replace(/^(md:|xl:)/, "");
      
      const hoverClass = hover ? ` ${hover}` : "";
      
      return `${cleanClass}${hoverClass}`;
    })
    .filter(Boolean)
    .join(" ");
};