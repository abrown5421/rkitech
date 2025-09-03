type PrefixKey = "base" | "md" | "xl" | "hover";

const PREFIX_MAP: Record<PrefixKey, string> = {
  base: "",
  md: "md:",
  xl: "xl:",
  hover: "hover:",
};

export const parseTwClassName = (
  TwClassName: Record<string, any>,
  cmsMode = false,
  activePrefix?: string
): string => {
  if (!TwClassName || typeof TwClassName !== "object") return "";

  const classes: string[] = [];

  for (const [, propVal] of Object.entries(TwClassName)) {
    if (!propVal || typeof propVal !== "object") continue;

    const normalize = (val: any): string[] => {
      if (!val) return [];
      if (typeof val === "string") return val ? [val] : [];
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val === "object") return Object.values(val).filter(Boolean) as string[];
      return [];
    };

    if (cmsMode) {
      const key = (activePrefix as PrefixKey) || "base";
      const rawClasses = normalize(propVal[key]);
      classes.push(...rawClasses);
    } else {
      (Object.keys(propVal) as PrefixKey[]).forEach((bp) => {
        const rawClasses = normalize(propVal[bp]);
        rawClasses.forEach((cls) => {
          if (!cls) return;
          const prefix = PREFIX_MAP[bp];
          const finalClass = (prefix && !cls.startsWith(prefix)) ? `${prefix}${cls}` : cls;
          classes.push(finalClass);
        });
      });
    }
  }

  return classes.filter(Boolean).join(" ");
};