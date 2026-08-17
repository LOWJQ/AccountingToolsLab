const isDevelopment = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${
    isDevelopment ? " 'unsafe-eval'" : ""
  } https://challenges.cloudflare.com https://va.vercel-scripts.com https://*.vercel-scripts.com`,
  "connect-src 'self' https://challenges.cloudflare.com https://vitals.vercel-insights.com https://*.vercel-insights.com https://*.vercel-analytics.com https://va.vercel-scripts.com",
  "frame-src https://challenges.cloudflare.com",
  "child-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "media-src 'self' data: blob:",
  "manifest-src 'self'"
].join("; ");

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/guides/how-to-create-a-simple-invoice",
        destination:
          "/guides/what-should-an-invoice-include-before-you-send-it",
        permanent: true
      },
      {
        source: "/guides/trial-balance-explained",
        destination: "/guides/errors-not-revealed-by-a-trial-balance",
        permanent: true
      },
      {
        source: "/guides/cash-flow-vs-profit",
        destination: "/guides/profitable-but-no-cash",
        permanent: true
      },
      {
        source: "/guides/break-even-point-explained",
        destination: "/guides/fixed-vs-variable-costs",
        permanent: true
      },
      {
        source: "/guides/financial-ratios-for-beginners",
        destination: "/guides/what-is-a-good-financial-ratio",
        permanent: true
      },
      {
        source: "/guides/sst-calculator-malaysia-add-remove-sst",
        destination: "/guides/do-i-need-to-register-for-sst-malaysia",
        permanent: true
      },
      {
        source:
          "/guides/sst-calculator-malaysia-service-charge-restaurant-bills",
        destination: "/guides/do-i-need-to-register-for-sst-malaysia",
        permanent: true
      },
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
