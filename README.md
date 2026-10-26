# NOIR CHD — Cinematic Luxury Coming Soon Experience

> **Chandigarh After Dark. Something is coming.**  
> A scroll-driven, cinematic luxury brand teaser for **NOIR CHD**, an upcoming ultra-exclusive nightlife experience in Chandigarh, India (December 2026).

---

## 🌙 Creative Direction & Brand Identity

The visual identity closely embodies the established **NOIR CHD** aesthetic:
- **Obsidian Black (`#050505`)**: Pure luxury negative space (85%).
- **Midnight Charcoal (`#0E0E0E`)**: Dimensional depth and subtle shadows.
- **Champagne Gold (`#C9A66B`)**: Logo illumination, crescent rim glow, and restrained accents (5%).
- **Antique Gold (`#A8874F`)**: Basaltic crater shadows and subtle gradients.
- **Warm Ivory (`#F4EFE5`)**: Primary editorial typography (10%).
- **Muted Stone (`#89847C`)**: Secondary coordinates and subtle micro-labels.

### Typography
- **Editorial High-Contrast Serif**: *Cormorant Garamond* & *Bodoni Moda*
- **Refined Modern Sans**: *Manrope*
- **Insignia Monogram**: *Cinzel*

---

## 🎬 The 5 Connected Story Scenes

1. **Scene 01 — The Arrival (Hero)**
   - Starts in darkness with an opening 2.5s cinematic reveal sequence.
   - High-fidelity crescent moon emerges from soft golden haze.
   - NOIR wordmark appears with champagne reflections; CHD lettering follows.
   - "CHANDIGARH AFTER DARK &bull; SOMETHING IS COMING."
   - Animated luxury scroll indicator with downward-travelling gold line.

2. **Scene 02 — Into the Darkness**
   - Scroll-driven transition dissolving the hero mark into midnight atmosphere.
   - Volumetric champagne-gold light rays and dark metallic specular sweep.
   - Editorial typography reveal:
     > *"NOT EVERY NIGHT IS MEANT TO BE ORDINARY.*  
     > *SOME ARE MEANT TO BE REMEMBERED."*

3. **Scene 03 — The Moon Experience (Signature Centerpiece)**
   - Pinned sticky storytelling section (320vh scroll track).
   - High-resolution crescent moon with authentic lunar surface texture, craters, maria, and metallic rim lighting.
   - Moon dynamically scales up (1.7x), halo blooms, and drifts across the frame.
   - Massive editorial typography:
     - **"THE CITY SLEEPS."**
     - **"WE BEGIN."**

4. **Scene 04 — The Anticipation**
   - Ultra-fine horizontal champagne gold laser beam.
   - Small label: `AN EXPERIENCE YET TO BE REVEALED`
   - Bold contrasting statements:
     - **"GOOD TASTE."** (Warm Ivory)
     - **"BAD DECISIONS."** (Muted Champagne Gold)
   - Supporting whisper: *"Chandigarh, something different is on its way."*

5. **Scene 05 — The Final Reveal (Coming Soon)**
   - Re-anchoring the NOIR CHD signature insignia.
   - **"COMING SOON."** &bull; **DECEMBER 2026** &bull; **CHANDIGARH, INDIA**
   - Luxury CTA button: **FOLLOW THE UNKNOWN** linking directly to `https://www.instagram.com/noir.chd/`.
   - Subtext: `@NOIR.CHD`
   - Minimalist brand footer.

---

## 💎 Micro-Interactions & Technical Architecture

- **Lenis Smooth Scroll**: Buttery 60fps luxury momentum scrolling synced with GSAP ScrollTrigger.
- **Canvas Particle Field**: Floating champagne-gold stardust drifting upward in 3D-like depth.
- **35mm Film Grain Overlay**: Subtle cinematic analog grain texture.
- **Custom Desktop Cursor**: Champagne gold halo follower with smooth lerp tracking (disabled on touch).
- **Procedural Ambient Atmosphere**: Web Audio API synthesized warm sub-bass drone and harmonic vinyl warmth with mute/unmute control in the header (starts muted).
- **Reduced Motion Support**: Full compliance with `prefers-reduced-motion: reduce`.
- **Zero Extraneous Clutter**: No tickets, no fake booking forms, no ecommerce. Pure coming soon anticipation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested with Node 24 LTS)
- npm or pnpm

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
The optimized production bundle will be created in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via GitHub
1. Create a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: NOIR CHD Cinematic Luxury Coming Soon Experience"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com).
3. Click **"Add New Project"** and import the repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Click **"Deploy"**. The site will be live on an ultra-fast global CDN with SSL and optimized assets!

---

&copy; 2026 NOIR CHD. All Rights Reserved.
