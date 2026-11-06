// next.config.js
/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Don't let browsers guess content types (blocks some XSS vectors)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The app is never meant to be embedded in someone else's iframe
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Don't leak full URLs (which may contain invite tokens) to other sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // This app never needs these browser capabilities
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile)
  output: "standalone",
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
      {
        protocol: "https",
        hostname: "pub-0ee8bfcd4f3446679c841a3fd9a22377.r2.dev",
      },
      {
        // Presigned (expiring) memory image URLs — bucket.account.r2...
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        // Memory-card fallback art
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
