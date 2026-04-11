import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',
      },
    ],
  },
  async redirects() {
    return [
      // Section anchors
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/work', destination: '/#work', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/story', destination: '/#about', permanent: true },
      { source: '/brand', destination: '/#work', permanent: true },

      // Old site short slugs (from cadevlacos.com era)
      { source: '/destroyboredom', destination: '/projects/destroy-boredom', permanent: true },
      { source: '/pintgt', destination: '/projects/introducing-gt', permanent: true },
      { source: '/pulpan', destination: '/projects/pulpan-brothers', permanent: true },
      { source: '/homegrown', destination: '/projects/homegrown-s25', permanent: true },

      // Old site root-level slugs → new /projects/ routes
      { source: '/aether-nz', destination: '/projects/aether-nz', permanent: true },
      { source: '/aventon', destination: '/projects/aventon', permanent: true },
      { source: '/bf-goodrich', destination: '/projects/bf-goodrich', permanent: true },
      { source: '/chase-sapphire', destination: '/projects/chase-sapphire', permanent: true },
      { source: '/destroy-boredom', destination: '/projects/destroy-boredom', permanent: true },
      { source: '/dirt', destination: '/projects/dirt', permanent: true },
      { source: '/dr-bronners', destination: '/projects/dr-bronner-s', permanent: true },
      { source: '/dr-bronners-2', destination: '/projects/dr-bronner-s', permanent: true },
      { source: '/entelligence', destination: '/projects/entelligence', permanent: true },
      { source: '/get-off-the-couch', destination: '/projects/get-off-the-couch', permanent: true },
      { source: '/go-fast-campers', destination: '/projects/go-fast-campers', permanent: true },
      { source: '/introducing-gt', destination: '/projects/introducing-gt', permanent: true },
      { source: '/kith-x-columbia', destination: '/projects/kith-x-columbia', permanent: true },
      { source: '/lost-summer', destination: '/projects/lost-summer', permanent: true },
      { source: '/lululemon', destination: '/projects/lululemon', permanent: true },
      { source: '/mikes-bikes', destination: '/projects/mikes-bikes', permanent: true },
      { source: '/mikes-bikes-2', destination: '/projects/mikes-bikes-2', permanent: true },
      { source: '/mbtv', destination: '/projects/mikes-bikes', permanent: true },
      { source: '/offield', destination: '/projects/offield', permanent: true },
      { source: '/prickly', destination: '/projects/prickly-motorsports', permanent: true },
      { source: '/prickly-motorsports', destination: '/projects/prickly-motorsports', permanent: true },
      { source: '/pulpan-brothers', destination: '/projects/pulpan-brothers', permanent: true },
      { source: '/texino', destination: '/projects/texino', permanent: true },
      { source: '/town-trail', destination: '/projects/town-trail', permanent: true },

      // Old .html extensions
      { source: '/projects/aether-nz.html', destination: '/projects/aether-nz', permanent: true },
      { source: '/projects/aventon.html', destination: '/projects/aventon', permanent: true },
      { source: '/projects/bf-goodrich.html', destination: '/projects/bf-goodrich', permanent: true },
      { source: '/projects/chase-sapphire.html', destination: '/projects/chase-sapphire', permanent: true },
      { source: '/projects/destroy-boredom.html', destination: '/projects/destroy-boredom', permanent: true },
      { source: '/projects/dirt.html', destination: '/projects/dirt', permanent: true },
      { source: '/projects/dr-bronners-2.html', destination: '/projects/dr-bronners-2', permanent: true },
      { source: '/projects/dr-bronners.html', destination: '/projects/dr-bronners', permanent: true },
      { source: '/projects/entelligence.html', destination: '/projects/entelligence', permanent: true },
      { source: '/projects/get-off-the-couch.html', destination: '/projects/get-off-the-couch', permanent: true },
      { source: '/projects/go-fast-campers.html', destination: '/projects/go-fast-campers', permanent: true },
      { source: '/projects/introducing-gt.html', destination: '/projects/introducing-gt', permanent: true },
      { source: '/projects/kith-x-columbia.html', destination: '/projects/kith-x-columbia', permanent: true },
      { source: '/projects/lost-summer.html', destination: '/projects/lost-summer', permanent: true },
      { source: '/projects/lululemon.html', destination: '/projects/lululemon', permanent: true },
      { source: '/projects/mikes-bikes-2.html', destination: '/projects/mikes-bikes-2', permanent: true },
      { source: '/projects/mikes-bikes.html', destination: '/projects/mikes-bikes', permanent: true },
      { source: '/projects/offield.html', destination: '/projects/offield', permanent: true },
      { source: '/projects/prickly-motorsports.html', destination: '/projects/prickly-motorsports', permanent: true },
      { source: '/projects/pulpan-brothers.html', destination: '/projects/pulpan-brothers', permanent: true },
      { source: '/projects/texino.html', destination: '/projects/texino', permanent: true },
      { source: '/projects/town-trail.html', destination: '/projects/town-trail', permanent: true },
    ];
  },
};

export default nextConfig;
