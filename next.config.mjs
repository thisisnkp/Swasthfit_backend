/** @type {import("next").NextConfig} */
const nextConfig = {
 //output : 'export',
  images: {
    //unoptimized: true,
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      }
    ]
  },
  // Add basePath for subfolder deployment
  // basePath: '/frontswasth',

  // // Add assetPrefix for static files
  // assetPrefix: '/frontswasth/',

  // // Ensure trailing slashes for consistent routing
  // trailingSlash: true,
};

export default nextConfig;
