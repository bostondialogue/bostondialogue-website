module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  eleventyConfig.addFilter("readableDate", (iso) => {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
  });

  const byDateDesc = (a, b) => (b.data.date || "0000-00-00").localeCompare(a.data.date || "0000-00-00");

  eleventyConfig.addCollection("events", (api) =>
    api.getFilteredByTag("event").sort(byDateDesc));

  eleventyConfig.addCollection("upcomingEvents", (api) => {
    const today = new Date().toISOString().slice(0, 10);
    return api.getFilteredByTag("event")
      .filter((e) => e.data.date && e.data.date >= today)
      .sort((a, b) => (a.data.date || "").localeCompare(b.data.date || ""));
  });

  eleventyConfig.addCollection("pastEvents", (api) => {
    const today = new Date().toISOString().slice(0, 10);
    return api.getFilteredByTag("event")
      .filter((e) => !e.data.date || e.data.date < today)
      .sort(byDateDesc);
  });

  eleventyConfig.addCollection("homeEvents", (api) => {
    const events = api.getFilteredByTag("event").sort(byDateDesc);
    const featured = events.filter((e) => e.data.featured);
    return (featured.length >= 3 ? featured : events).slice(0, 3);
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
  };
};
