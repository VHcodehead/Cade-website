# VLACOVISION — Remaining TODO

## Completed
- [x] All 6 phases built and deployed (Foundation, Auth, Portfolio, Animations, Admin CMS, Analytics)
- [x] 24 projects with Vimeo links + preview clips
- [x] Admin panel (projects, team, testimonials, settings, logos, messages, analytics)
- [x] Hover-to-play with native MP4 clips (12 projects) + Vimeo fallback
- [x] Multi-video sequential playlist (Headspace)
- [x] Brand logo marquee (pre-rendered + admin-uploaded)
- [x] Contact form with Resend email notifications
- [x] Framer Motion animations (page transitions, scroll reveals, hover effects)
- [x] Warm dark gradient tonal zones
- [x] Cream/black logo swap on scroll
- [x] Drag-and-drop project reordering
- [x] Analytics tracking (page views, video plays, dashboard)
- [x] Deployed to Railway with PostgreSQL

## Still TODO

### High Priority
- [ ] Connect vlacovision.com domain to Railway (DNS setup)
- [ ] SEO: robots.txt, sitemap.xml, structured data (JSON-LD), Google Search Console submission
- [ ] Re-upload: buddy's portrait on /admin/team (lost on last deploy)
- [ ] Re-upload: any admin-uploaded brand logos (lost on last deploy)
- [ ] Re-upload: American Express preview clip + thumbnail (lost on last deploy)

### Medium Priority
- [ ] Cloud storage (Cloudflare R2 or AWS S3) for permanent admin file uploads
- [ ] Responsive audit on narrow/wide monitors (buddy reported right-side overflow)
- [ ] Brand logo sizing fine-tuning if still uneven
- [ ] Mobile testing (touch interactions, video autoplay, responsive layout)

### Low Priority / Future
- [ ] Custom domain email for Resend (currently uses onboarding@resend.dev)
- [ ] Password change feature in admin
- [ ] Gallery images section (GalleryImage model exists but no admin UI yet)
- [ ] v2 features: custom cursor, magnetic hover, smooth scroll (Lenis), project filtering

## Site URLs
- **Live site:** https://cade-website-production.up.railway.app
- **Admin:** https://cade-website-production.up.railway.app/admin
- **Admin login:** admin@vlacovision.com / changeme123

## Railway
- **Project:** ideal-nourishment
- **Service:** Cade-website
- **DB:** PostgreSQL (public URL: interchange.proxy.rlwy.net:21219)
