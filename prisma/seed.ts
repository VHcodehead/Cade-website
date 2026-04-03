import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcryptjs from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const db = new PrismaClient({ adapter });

const projects = [
  {
    slug: 'aether-nz',
    title: 'Aether NZ',
    client: 'Aether Apparel',
    services: 'Production, Direction, Post-Production',
    year: 2024,
    vimeoId: '1010368544',
    previewClipUrl: '/videos/aether-nz.mp4',
    thumbnailUrl: '/thumbnails/aether-nz.jpg',
    sortOrder: 1,
    description:
      'VLACOVISION partnered with Aether Apparel to capture the essence of adventure and exploration across the stunning landscapes of New Zealand. This project showcases the perfect intersection of high-performance outdoor apparel and breathtaking natural environments.',
  },
  {
    slug: 'aventon',
    title: 'Aventon',
    client: 'Aventon Bikes',
    services: 'Creative Direction, Production, Cinematography',
    year: 2024,
    vimeoId: '1044752527',
    previewClipUrl: '/videos/aventon.mp4',
    thumbnailUrl: '/thumbnails/aventon.jpg',
    sortOrder: 2,
    description:
      'VLACOVISION partnered with Aventon to showcase the electric bike revolution that\'s transforming urban mobility. This project highlights how Aventon\'s innovative e-bikes are empowering riders to reimagine their daily commutes, weekend adventures, and relationship with their cities.',
  },
  {
    slug: 'bf-goodrich',
    title: 'BF Goodrich',
    client: 'BF Goodrich Tires',
    services: 'Production, Direction, Cinematography',
    year: 2023,
    vimeoId: '860534227',
    previewClipUrl: '/videos/bf-goodrich.mp4',
    sortOrder: 3,
    description:
      'VLACOVISION partnered with BF Goodrich to showcase the legendary performance of their off-road tire technology. This project takes viewers into extreme terrain where traction, durability, and innovation are put to the ultimate test.',
  },
  {
    slug: 'chase-sapphire',
    title: 'Chase Sapphire',
    client: 'Chase Bank',
    services: 'Creative Direction, Production, Post-Production',
    year: 2023,
    vimeoId: '857659249',
    previewClipUrl: '/videos/chase-sapphire.mp4',
    sortOrder: 4,
    description:
      'VLACOVISION collaborated with Chase to create a premium visual campaign for the Chase Sapphire card, capturing the aspirational lifestyle and travel rewards that define this prestigious financial product.',
  },
  {
    slug: 'destroy-boredom',
    title: 'Destroy Boredom',
    client: 'Destroy Boredom',
    services: 'Production, Direction, Cinematography',
    year: 2023,
    vimeoId: '414017871',
    sortOrder: 5,
    description:
      'VLACOVISION partnered with Destroy Boredom to capture the raw energy and adrenaline of action sports culture. This project is a visual manifesto celebrating the athletes and adventurers who refuse to settle for the mundane.',
  },
  {
    slug: 'dirt',
    title: 'Dirt',
    client: 'Independent',
    services: 'Production, Direction, Cinematography',
    year: 2023,
    vimeoId: '627630020',
    sortOrder: 6,
    description:
      'VLACOVISION created "Dirt" as a raw, unfiltered celebration of mountain bike culture in its purest form. This project strips away the gloss and marketing speak to focus on what really matters: riders, trails, and the primal connection between human, machine, and earth.',
  },
  {
    slug: 'dr-bronners-2',
    title: "Dr. Bronner's",
    client: "Dr. Bronner's",
    services: 'Production, Direction, Post-Production',
    year: 2023,
    vimeoId: '762422704',
    sortOrder: 7,
    description:
      'VLACOVISION returned to Dr. Bronner\'s to document their "All-One" philosophy in action, taking viewers beyond the product to explore the real-world impact of their ethical business practices.',
  },
  {
    slug: 'dr-bronners',
    title: "Dr. Bronner's",
    client: "Dr. Bronner's",
    services: 'Creative Direction, Production, Post-Production',
    year: 2023,
    vimeoId: '844374776',
    previewClipUrl: '/videos/dr-bronners.mp4',
    sortOrder: 8,
    description:
      'VLACOVISION collaborated with Dr. Bronner\'s to create a visual narrative celebrating their commitment to organic, fair-trade products and ethical business practices.',
  },
  {
    slug: 'entelligence',
    title: 'Entelligence',
    client: 'Entelligence',
    services: 'Creative Direction, Production, Post-Production',
    year: 2024,
    vimeoId: '1115912854',
    previewClipUrl: '/videos/entelligence.mp4',
    thumbnailUrl: '/thumbnails/entelligence.jpg',
    sortOrder: 9,
    description:
      'VLACOVISION collaborated with Entelligence to translate complex technology solutions into compelling visual narratives, demonstrating how innovative technology can transform business operations.',
  },
  {
    slug: 'get-off-the-couch',
    title: 'Get Off The Couch',
    client: 'Independent',
    services: 'Creative Direction, Production, Post-Production',
    year: 2023,
    vimeoId: '516353824',
    sortOrder: 10,
    description:
      'VLACOVISION created "Get Off The Couch" as a motivational call-to-action for the outdoor lifestyle community. This project challenges viewers to break free from screens and comfort zones, trading Netflix marathons for real adventures.',
  },
  {
    slug: 'go-fast-campers',
    title: 'Go Fast Campers',
    client: 'Go Fast Campers',
    services: 'Production, Direction, Cinematography',
    year: 2023,
    vimeoId: '686871276',
    sortOrder: 11,
    description:
      'VLACOVISION collaborated with Go Fast Campers to showcase their innovative adventure vehicle systems that transform trucks into fully equipped basecamp platforms.',
  },
  {
    slug: 'introducing-gt',
    title: 'Introducing GT',
    client: 'GT Bicycles',
    services: 'Creative Direction, Production, Cinematography',
    year: 2023,
    vimeoId: '641234117',
    sortOrder: 12,
    description:
      'VLACOVISION partnered with GT Bicycles to create a launch campaign celebrating their legendary mountain biking heritage, honoring decades of innovation while introducing their latest designs.',
  },
  {
    slug: 'kith-x-columbia',
    title: 'Kith x Columbia',
    client: 'Kith / Columbia Sportswear',
    services: 'Creative Direction, Production, Cinematography',
    year: 2024,
    vimeoId: '1010370479',
    sortOrder: 13,
    description:
      'VLACOVISION captured the essence of the Kith x Columbia collaboration, a groundbreaking fusion of street culture and outdoor performance showcasing how premium streetwear design meets technical outdoor apparel.',
  },
  {
    slug: 'lost-summer',
    title: 'Lost Summer',
    client: 'Independent',
    services: 'Production, Direction, Cinematography',
    year: 2023,
    vimeoId: '588179052',
    sortOrder: 14,
    description:
      'VLACOVISION presents "Lost Summer," a documentary exploration of adventure, friendship, and the pursuit of perfect moments during the fleeting warmth of summer.',
  },
  {
    slug: 'lululemon',
    title: 'Lululemon',
    client: 'Lululemon Athletica',
    services: 'Creative Direction, Production, Cinematography',
    year: 2024,
    vimeoId: '1018385941',
    previewClipUrl: '/videos/lululemon.mp4',
    sortOrder: 15,
    description:
      'VLACOVISION collaborated with Lululemon to create a dynamic campaign celebrating movement, mindfulness, and athletic lifestyle, focusing on authentic storytelling and the technical innovation behind their product line.',
  },
  {
    slug: 'mikes-bikes-2',
    title: "Mike's Bikes",
    client: "Mike's Bikes",
    services: 'Production, Direction, Cinematography',
    year: 2023,
    vimeoId: '761621877',
    previewClipUrl: '/videos/mikes-bikes-2.mp4',
    sortOrder: 16,
    description:
      "VLACOVISION returned to Mike's Bikes to capture a deeper look into the cycling community and culture, shifting focus from products to people and the vibrant network of riders throughout the Bay Area.",
  },
  {
    slug: 'mikes-bikes',
    title: "Mike's Bikes",
    client: "Mike's Bikes",
    services: 'Creative Direction, Production, Post-Production',
    year: 2024,
    vimeoId: '1018383973',
    previewClipUrl: '/videos/mikes-bikes.mp4',
    sortOrder: 17,
    description:
      "VLACOVISION collaborated with Mike's Bikes to create a visual celebration of premium cycling culture, capturing the intersection of high-performance bicycles, expert craftsmanship, and the passionate Bay Area cycling community.",
  },
  {
    slug: 'offield',
    title: 'Offield',
    client: 'Offield',
    services: 'Production, Direction, Cinematography',
    year: 2024,
    vimeoId: '1044746189',
    previewClipUrl: '/videos/offield.mp4',
    thumbnailUrl: '/thumbnails/offield.jpg',
    sortOrder: 18,
    description:
      'VLACOVISION partnered with Offield to capture the spirit of adventure and the outdoor lifestyle that defines their brand, exploring the relationship between people and wild places.',
  },
  {
    slug: 'prickly-motorsports',
    title: 'Prickly Motorsports',
    client: 'Prickly Motorsports',
    services: 'Creative Direction, Production, Cinematography',
    year: 2024,
    vimeoId: '1010444232',
    previewClipUrl: '/videos/prickly-motorsports.mp4',
    sortOrder: 19,
    description:
      'VLACOVISION partnered with Prickly Motorsports to capture the raw intensity and adrenaline-fueled world of competitive racing, diving deep into the culture of high-performance motorsports.',
  },
  {
    slug: 'pulpan-brothers',
    title: 'Pulpan Brothers',
    client: 'Pulpan Brothers',
    services: 'Creative Direction, Production, Cinematography',
    year: 2023,
    vimeoId: '786140277',
    sortOrder: 20,
    description:
      'VLACOVISION partnered with Pulpan Brothers to document the artistry and dedication behind traditional craftsmanship, celebrating the intersection of heritage techniques and contemporary design.',
  },
  {
    slug: 'texino',
    title: 'Texino',
    client: 'Texino',
    services: 'Creative Direction, Production, Cinematography',
    year: 2023,
    vimeoId: '718438350',
    previewClipUrl: '/videos/texino.mp4',
    sortOrder: 21,
    description:
      'VLACOVISION collaborated with Texino to showcase the art of handcrafted leather goods, documenting the meticulous process and skilled craftsmanship behind each piece.',
  },
  {
    slug: 'town-trail',
    title: 'Town / Trail',
    client: 'Independent',
    services: 'Creative Direction, Production, Cinematography',
    year: 2023,
    vimeoId: '296068871',
    sortOrder: 22,
    description:
      'VLACOVISION created "Town / Trail" to explore the dual nature of modern cycling culture — the seamless transition between urban commuting and trail riding that defines the contemporary cycling experience.',
  },
  {
    slug: 'aventon-current',
    title: 'Aventon Current',
    client: 'Aventon',
    services: 'Creative Direction, Production, Cinematography',
    year: 2024,
    vimeoId: '1178599224',
    previewClipUrl: '/videos/aventon-current.mp4',
    thumbnailUrl: '/thumbnails/aventon-current.jpg',
    sortOrder: 23,
    description:
      'VLACOVISION partnered with Aventon to launch the Current — their latest electric bike model. This project captures the freedom and innovation of modern e-mobility through cinematic storytelling.',
  },
  {
    slug: 'headspace',
    title: 'Headspace',
    client: 'Headspace',
    services: 'Creative Direction, Production, Post-Production',
    year: 2024,
    vimeoId: '1128320354',
    previewClipUrl: '/videos/headspace.mp4',
    thumbnailUrl: '/thumbnails/headspace.jpg',
    sortOrder: 24,
    description:
      'VLACOVISION collaborated with Headspace to create a series of visual pieces exploring mindfulness and mental wellness through cinematic imagery and thoughtful direction.',
  },
];

async function main() {
  console.log('Seeding database with 24 projects...');

  for (const project of projects) {
    await db.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        client: project.client,
        services: project.services,
        year: project.year,
        vimeoId: project.vimeoId,
        previewClipUrl: project.previewClipUrl,
        thumbnailUrl: project.thumbnailUrl,
        sortOrder: project.sortOrder,
        description: project.description,
      },
      create: project,
    });
    console.log(`  Upserted: ${project.slug}`);
  }

  await db.siteConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroVimeoId: '1129060654',
      aboutText:
        'A San Francisco Bay Area production house specializing in bold, authentic storytelling through film.',
      contactEmail: '',
      ctaHeading: "Let's create something worth watching.",
      ctaButtonText: 'Start a Project',
      aboutHeading: 'Vlacovision',
    },
  });

  console.log('SiteConfig seeded.');

  // Seed team members
  const teamMembers = [
    {
      name: 'Alex Vlaco',
      role: 'Founder / Director',
      bio: 'Alex founded Vlacovision with a passion for cinematic storytelling and a commitment to capturing authentic moments.',
      sortOrder: 1,
    },
    {
      name: 'Jordan Lee',
      role: 'Director of Photography',
      bio: 'Jordan brings over a decade of cinematography experience across commercial, documentary, and narrative projects.',
      sortOrder: 2,
    },
    {
      name: 'Sam Rivera',
      role: 'Editor / Post-Production',
      bio: 'Sam shapes raw footage into compelling stories with a keen eye for pacing and visual rhythm.',
      sortOrder: 3,
    },
  ];

  for (const member of teamMembers) {
    const existing = await db.teamMember.findFirst({ where: { name: member.name } });
    if (!existing) {
      await db.teamMember.create({ data: member });
      console.log(`  Created team member: ${member.name}`);
    } else {
      console.log(`  Team member already exists: ${member.name}`);
    }
  }

  // Seed testimonials
  const testimonials = [
    {
      quote: 'Vlacovision brought our brand story to life in ways we never imagined. Their attention to detail and creative vision is unmatched.',
      personName: 'Sarah Chen',
      personTitle: 'Marketing Director',
      company: 'Aether Apparel',
      sortOrder: 1,
    },
    {
      quote: 'Working with the Vlacovision team was an incredible experience. They understood our vision from day one and delivered beyond expectations.',
      personName: 'Marcus Johnson',
      personTitle: 'Brand Manager',
      company: 'Aventon Bikes',
      sortOrder: 2,
    },
    {
      quote: 'The quality of their work speaks for itself. Every frame is intentional, every cut purposeful. True craftspeople.',
      personName: 'Emily Torres',
      personTitle: 'Creative Director',
      company: 'Lululemon',
      sortOrder: 3,
    },
  ];

  for (const testimonial of testimonials) {
    const existing = await db.testimonial.findFirst({ where: { personName: testimonial.personName } });
    if (!existing) {
      await db.testimonial.create({ data: testimonial });
      console.log(`  Created testimonial from: ${testimonial.personName}`);
    } else {
      console.log(`  Testimonial already exists from: ${testimonial.personName}`);
    }
  }

  console.log('Team members and testimonials seeded.');

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@vlacovision.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme';
  const hashedPassword = await bcryptjs.hash(adminPassword, 12);

  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: { hashedPassword },
    create: { email: adminEmail, hashedPassword },
  });
  console.log(`  Admin user seeded: ${adminEmail}`);

  console.log('Seed complete: 24 projects + SiteConfig + AdminUser.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
