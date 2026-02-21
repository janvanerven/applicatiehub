🌲 Verdant Design System

A lush, grounded, corporate-grade visual language inspired by forest depth and natural warmth.

1. Brand Foundation
Brand Personality
Trait	Expression
Grounded	Deep forest greens, strong structure
Trustworthy	Clear hierarchy, consistent spacing
Warm	Earth tones, soft curves
Fresh	Light gradients, luminous highlights
Calm	Balanced contrast, intentional whitespace
2. Color System
🌲 Primary Palette (Forest Core)
Token	Hex	Usage
forest-900	#0B2E22	Background depth
forest-800	#0F3D2E	Dark sections
forest-700	#145A32	Primary brand
forest-600	#1E8449	Interactive states
forest-500	#27AE60	Primary buttons
forest-400	#2ECC71	Hover states
🌿 Accent Palette (Lush Energy)
Token	Hex	Usage
moss	#6FAF5F	Highlights
fern	#4CAF50	Subtle fills
sunlight	#F4D03F	Callouts / focus ring
sky-mist	#D4EFDF	Light surfaces
🐻 Earth Palette (Warmth)
Token	Hex	Usage
bark	#6E3B1F	Illustration tones
soil	#8E5A2A	Depth
sand	#C58C5A	Soft highlights
⚪ Neutral Palette
Token	Hex
white	#FFFFFF
gray-100	#F8F9F9
gray-300	#D5DBDB
gray-600	#566573
gray-900	#1C2833
3. Gradient System
Hero Gradient
linear-gradient(to top, #0F3D2E, #145A32, #1E8449);
Light Bloom Overlay
radial-gradient(circle at 70% 20%, rgba(255,255,200,0.15), transparent 60%);
Premium Button Gradient
linear-gradient(135deg, #2ECC71, #27AE60);
4. Typography
Font Stack

Primary:

Inter, Segoe UI, system-ui, -apple-system, sans-serif
Type Scale
Role	Size	Weight
Display	64–120px	800
H1	48px	700
H2	36px	600
H3	28px	600
Body Large	18px	400
Body	16px	400
Caption	14px	400
Typography Notes

Slight letter-spacing for large numerics

Use soft white over dark green

Avoid pure black — use gray-900

5. Elevation & Shadows

Inspired by filtered forest light.

Soft Card Shadow
0 6px 18px rgba(0,0,0,0.15);
Deep Elevation
0 10px 25px rgba(0,0,0,0.25);
Glow Accent
0 0 25px rgba(255,255,255,0.15);
6. Border Radius System
Token	Value	Usage
radius-sm	6px	Inputs
radius-md	12px	Cards
radius-lg	20px	Panels
radius-xl	30px	Pills
radius-organic	60% 60% 50% 50%	Mascots / organic shapes
7. Spacing System

Based on an 8px grid.

Token	Value
space-1	8px
space-2	16px
space-3	24px
space-4	32px
space-6	48px
space-8	64px
8. Motion System

Inspired by forest breeze and subtle light movement.

Duration
Type	Value
Micro	150ms
Standard	250ms
Emphasis	400ms
Easing
cubic-bezier(0.4, 0.0, 0.2, 1);
Motion Principles

Subtle vertical drift

Gentle fade-in upward

Hover lift (2–4px)

Soft glow pulses

No sharp snapping animations

9. Component Guidelines
🌲 Buttons
Primary

Green gradient background

White text

Soft shadow

Hover lift + stronger shadow

Secondary

Transparent background

2px forest-500 border

forest-500 text

🌿 Cards

Background: forest-800 or white

Radius: radius-md or radius-lg

Shadow: soft card shadow

Optional radial highlight

🐻 Illustration Style

Rounded geometry

Warm earth tones

No harsh outlines

Soft internal shading

Slight asymmetry for organic feel

10. Accessibility

Minimum contrast ratio: 4.5:1

Avoid green-on-green text

Use white or gray-100 over forest backgrounds

Focus ring: 2px solid #F4D03F

11. Example CSS Variable Mapping
:root {
  --forest-700: #145A32;
  --forest-500: #27AE60;
  --forest-900: #0B2E22;

  --bark: #6E3B1F;
  --sand: #C58C5A;

  --radius-md: 12px;
  --shadow-card: 0 6px 18px rgba(0,0,0,0.15);
  --transition-standard: 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
12. Brand Voice

Tone:

Calm

Confident

Warm but not playful

Nature-inspired without cliché

Messaging Example

Instead of:

Oops! You’re lost!

Use:

Looks like you’ve stepped off the trail.

13. Use Cases

This system scales naturally into:

Sustainability platforms

Climate fintech

Outdoor SaaS

Eco-conscious product brands

Corporate environmental tools