# VLACOVISION - Production Company Website

Modern, edgy production company website with hover-to-play video functionality and gritty grain texture aesthetic.

## Features

- **Hover-to-Play Videos**: Videos only load and play when user hovers over them
- **Gritty Grain Texture**: Animated film grain overlay for edgy aesthetic
- **Responsive Design**: Optimized for all screen sizes
- **Vimeo Integration**: Seamless video embedding with Vimeo Player API
- **Performance Optimized**: Lazy loading, compression, and efficient asset delivery

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

### Adding Your Vimeo Videos

Edit `index.html` and replace the `data-vimeo-id` values with your actual Vimeo video IDs:

```html
<div class="video-item" data-vimeo-id="YOUR_VIMEO_ID_HERE">
```

To find your Vimeo video ID:
1. Go to your video on Vimeo
2. The ID is in the URL: `vimeo.com/123456789` (123456789 is the ID)

## Deployment to Railway

### Method 1: GitHub Integration (Recommended)

1. Push this code to a GitHub repository
2. Go to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect the Node.js project and deploy

### Method 2: Railway CLI

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize and deploy:
```bash
railway init
railway up
```

4. Get your deployment URL:
```bash
railway domain
```

## Customization

### Colors
Edit `styles.css` variables at the top:
```css
:root {
    --black: #0a0a0a;
    --accent: #ff4400;
    /* etc. */
}
```

### Content
- **Company Name**: Edit in `index.html`
- **Video Descriptions**: Update the `<h3>` and `<p>` tags under each video item
- **About Section**: Modify the text in the `<section id="about">` section
- **Contact Info**: Update footer contact details

### Grain Intensity
Adjust grain opacity in `styles.css`:
```css
.grain-overlay {
    opacity: 0.15; /* Increase for more grain, decrease for less */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Technologies

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Vimeo Player API
- Express.js (Server)
- Node.js

## License

MIT

## Contact

For questions or support, contact: info@vlacovision.com
