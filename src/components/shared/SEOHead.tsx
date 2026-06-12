import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  robots?: string;
}

const SEOHead = ({
  title = "AXO Floors NJ - Professional Hardwood Flooring Installation & Refinishing",
  description = "Expert hardwood flooring services in New Jersey. Professional installation, refinishing, and restoration. Free estimates, licensed & insured. Call (732) 351-8653",
  keywords = "hardwood flooring NJ, floor refinishing New Jersey, flooring installation, wood floor restoration, AXO Floors",
  canonical,
  image = "https://axofloorsnj.com/og-image.jpg",
  robots = "index, follow",
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = `https://axofloorsnj.com${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    document.title = title;

    const updateMeta = (name: string, content: string) => {
      const existing = document.querySelectorAll(`meta[name="${name}"]`);
      existing.forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
      let meta = existing[0] as HTMLMetaElement | undefined;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updateProperty = (property: string, content: string) => {
      const existing = document.querySelectorAll(`meta[property="${property}"]`);
      existing.forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
      let meta = existing[0] as HTMLMetaElement | undefined;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('robots', robots);

    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:url', currentUrl);
    updateProperty('og:image', image);
    updateProperty('og:type', 'website');
    updateProperty('og:site_name', 'AXO Floors NJ');

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach((el, idx) => {
      if (idx > 0) el.remove();
    });
    let canonicalEl = existingCanonicals[0] as HTMLLinkElement | undefined;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);
  }, [title, description, keywords, currentUrl, canonicalUrl, image, robots]);

  return null;
};

export default SEOHead;
