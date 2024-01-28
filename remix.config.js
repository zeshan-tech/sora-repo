/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: [
    /^swiper.*/,
    /@remix-pwa\/.*/,
    /^is-ip.*/,
    /remix-i18next\/.*/,
  ],
};
