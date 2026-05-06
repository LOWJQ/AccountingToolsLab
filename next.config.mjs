/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "accountingtoolslab.com"
          }
        ],
        destination: "https://www.accountingtoolslab.com/:path*",
        permanent: true
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.accountingtoolslab.com"
          },
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http"
          }
        ],
        destination: "https://www.accountingtoolslab.com/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
