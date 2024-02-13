const cspHeader = `
    default-src 'self';
    script-src 'self';
    style-src 'self';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`

/** @type {import('next').NextConfig} */

const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, ''),
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY"
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff"
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
