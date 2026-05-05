// Reserved for future shared JSON-LD schema helpers as more pages are built.
export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite"
  };
}

export function createSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication"
  };
}

export function createFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage"
  };
}
