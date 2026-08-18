# Web Weaver Studio

https://spydyy-portfolio.vercel.app/                                                                                                                                                                                                                                                                                                 Build a premium, cinematic personal portfolio website for a full-stack developer.

Tech stack:
- React
- Tailwind CSS
- JavaScript
- GSAP
- GSAP ScrollTrigger

Visual direction:
- Premium creative developer portfolio
- Minimal but highly interactive
- Spider-web-inspired visual language without directly copying copyrighted characters
- White/light-gray background
- Deep red and black accents
- Bold editorial typography
- Strong visual hierarchy
- High-end agency/creative developer aesthetic
- Avoid generic portfolio templates

Hero:
- Full-screen cinematic composition
- Layered images
- Mouse-following image reveal/mask
- Large bold uppercase typography
- Spider-web decorations
- Smooth entrance animation
- CTA buttons
- Subtle interactive motion

About section:
- Responsive two-column desktop layout
- Large circular profile image
- Make the image appear suspended from the ceiling with a long thin thread
- Add subtle swinging motion
- Add spider-web decorations hanging from the top corners
- Keep background webs low-opacity
- Add an eyebrow label with a small spider graphic
- Add a large italic uppercase heading
- Reveal the heading with clip-path
- Reveal paragraphs using a subtle 3D rotation
- Add technology pills
- Animate pills with staggered scale-in
- Add subtle floating motion to pills
- Add a breathing glow around the profile frame
- Make the profile image grayscale by default and transition to color on hover

Animation rules:
- Use GSAP for major motion
- Use ScrollTrigger for scroll-based entrance
- Use elastic easing for hanging objects
- Use sine.inOut for natural continuous motion
- Use staggered reveals
- Keep movement smooth and intentional
- Avoid excessive animation

React requirements:
- useRef for animated elements
- useEffect for GSAP setup
- gsap.context() for cleanup
- ctx.revert() on unmount
- Register ScrollTrigger
- Keep entrance animations separate from continuous ambient animations
- Make everything responsive
- Do not add unnecessary dependencies

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/63e4f9ae-a700-4932-a53d-c3851717401f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
