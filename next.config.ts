import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
