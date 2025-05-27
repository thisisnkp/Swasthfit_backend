import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output : 'export',

  images: {
    unoptimized: true
},

  // Add basePath for subfolder deployment
  basePath: '/swasthfit-gym'
};

export default nextConfig;


// module.exports = {
//   basePath: '/your-base-path', // If this exists, images must use `/your-base-path/images/profile.jpg`
// };


// module.exports = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'your-image-host.com',
//       },
//     ],
//   },
// };