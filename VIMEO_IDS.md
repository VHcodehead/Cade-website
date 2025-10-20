# Vimeo Video IDs Setup Guide

This file helps you map your Vimeo videos to the website. Replace the placeholder IDs in `index.html` with your actual Vimeo video IDs.

## How to Find Your Vimeo Video ID

1. Go to your video on Vimeo (e.g., `https://vimeo.com/123456789`)
2. The number at the end is your video ID: **123456789**
3. Copy that number

## Video List (in order of appearance)

Update each `data-vimeo-id` in `index.html`:

1. **Lululemon** - Athletic lifestyle brand campaign
   - Current ID: `123456789`
   - Your ID: `___________`

2. **Aether - Snow & NZ** - Outdoor performance gear showcase
   - Current ID: `123456790`
   - Your ID: `___________`

3. **Prickly Motorsports** - High-octane racing culture
   - Current ID: `123456791`
   - Your ID: `___________`

4. **Mike's Bikes** - Premium cycling experience
   - Current ID: `123456792`
   - Your ID: `___________`

5. **BF Goodrich** - Off-road tire performance
   - Current ID: `123456793`
   - Your ID: `___________`

6. **Kith x Columbia** - Collaborative streetwear collection
   - Current ID: `123456794`
   - Your ID: `___________`

7. **Chase Sapphire** - Premium travel rewards
   - Current ID: `123456795`
   - Your ID: `___________`

8. **Dr. Bronners** - Organic soap philosophy
   - Current ID: `123456796`
   - Your ID: `___________`

9. **Aventon** - Electric bike revolution
   - Current ID: `123456797`
   - Your ID: `___________`

10. **Go Fast Campers** - Adventure vehicle systems
    - Current ID: `123456798`
    - Your ID: `___________`

11. **Texino** - Handcrafted leather goods
    - Current ID: `123456799`
    - Your ID: `___________`

12. **Pulpan Brothers** - Traditional craftsmanship
    - Current ID: `123456800`
    - Your ID: `___________`

## Quick Find & Replace

In `index.html`, search for `data-vimeo-id="123456789"` and replace with your actual Vimeo ID.

## Adding More Videos

To add additional videos, copy this template into `index.html`:

```html
<div class="video-item" data-vimeo-id="YOUR_VIMEO_ID">
    <div class="video-wrapper">
        <div class="video-overlay">
            <span class="company-name">VLACOVISION</span>
            <div class="play-indicator">HOVER TO PLAY</div>
        </div>
        <div class="video-container"></div>
    </div>
    <div class="video-info">
        <h3>Client/Project Name</h3>
        <p>Brief description of the project</p>
    </div>
</div>
```

## Notes

- Videos are listed in the same order as vlacovision.com
- You can add more projects by duplicating the HTML structure
- Update both the title and description for each video
- The website currently shows 12 projects (you had 19 on the original site)
- Feel free to add the remaining 7 projects using the template above
