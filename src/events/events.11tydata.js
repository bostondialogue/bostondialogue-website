module.exports = {
  layout: "event.njk",
  tags: ["event"],
  permalink: (data) => `/events/${data.page.fileSlug}/index.html`,
};
