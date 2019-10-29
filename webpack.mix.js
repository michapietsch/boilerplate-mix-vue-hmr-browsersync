let mix = require("laravel-mix");

mix.browserSync({
  proxy: null,
  server: {
    baseDir: "public",
    index: "index.html"
  },
  files: ["public/**/*"]
});

mix.js("resources/js/app.js", "public/js/app.js");
