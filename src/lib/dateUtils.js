const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
const rest = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
return `${weekday}, ${rest}`;