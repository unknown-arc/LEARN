# Sacred India — Temple Tourism Website

A modern, responsive Temple Tourism webpage titled **“Sacred India — Explore the Timeless Temples of India”**.

The website is designed using **HTML5 and CSS3 only**, with a heritage-inspired visual style, modern layouts, responsive behaviour, hover effects, and subtle animations.

---

## 1. Project Overview

**Purpose:**  
Showcase famous Indian temples through a modern tourism-style webpage rather than a simple information page.

**Main concept:**  
Combine Indian heritage, temple architecture, travel information, photography, and a simple journey-planning form into one attractive webpage.

### Technologies

- **HTML5** — page structure and content
- **CSS3** — complete visual design, layouts, effects and responsiveness
- **Google Fonts** — typography
- **Wikimedia Commons image URLs** — temple photography
- **JavaScript** — Not required for the current design

---

## 2. File Structure

```text
Sacred_India_Temple_Tourism/
│
├── index.html
└── style.css
```

### `index.html`

Contains:

- Header
- Navigation
- Hero section
- Introduction
- 10 temple cards
- Temple gallery
- Featured temple
- Why Explore section
- Travel Guide
- Travel enquiry form
- Footer

### `style.css`

Contains:

- Colour system
- Typography
- Flexbox layouts
- CSS Grid layouts
- Spacing
- Borders
- Shadows
- Image effects
- Hover effects
- Transitions
- Animations
- Responsive media queries

---

# 3. Visual Design

## Design Style

The website follows a:

- Modern
- Minimal
- Elegant
- Heritage-inspired
- Tourism-focused
- Editorial

visual style.

The design uses large photography, serif headings, muted natural colours, generous spacing and subtle interactions.

---

# 4. Fonts

Two main fonts are used.

## Playfair Display

Used mainly for:

- Hero heading
- Section headings
- Temple names
- Featured destination heading
- Footer/brand typography

**Style:** Elegant serif / editorial / heritage feel.

## DM Sans

Used mainly for:

- Navigation
- Body text
- Descriptions
- Buttons
- Form labels
- Small information text

**Style:** Clean modern sans-serif.

### Font import

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
```

---

# 5. Colour Palette

| Colour | HEX | Usage |
|---|---|---|
| Ink | `#1F241F` | Main text |
| Muted Grey-Green | `#687067` | Supporting text |
| Cream | `#F6F2E9` | Section backgrounds |
| Paper | `#FFFDF8` | Main page/card background |
| Sage | `#536858` | Links and accents |
| Deep Sage | `#33473A` | Featured section, buttons and footer |
| Warm Gold | `#C4934B` | Highlights and accents |
| Light Border | `#DED8CB` | Borders and separators |
| White | `#FFFFFF` | Dark-section text |

The warm gold colour is used as the main heritage accent.

---

# 6. Header & Navigation

The header contains:

- Sacred India logo
- Om symbol
- Home
- Explore Temples
- Gallery
- Travel Guide
- Contact

### Main CSS features

```css
position: sticky;
top: 0;
z-index: 100;
backdrop-filter: blur(16px);
```

The navigation remains visible while scrolling.

### Hover effect

Navigation links display an animated gold underline.

```css
.nav-links a::after {
    width: 0;
    transition: width 0.25s ease;
}

.nav-links a:hover::after {
    width: 100%;
}
```

---

# 7. Hero Section

## Content

### Main heading

**Discover the Sacred Heritage of India**

### Supporting text

Explore magnificent temples where history, architecture, culture, and spirituality come together.

### Button

**Explore Temples**

The button links to the temple section.

## Hero design

The hero uses:

- Large background image
- Dark gradient overlay
- Large Playfair Display heading
- Gold highlighted text
- White supporting text
- CTA button
- Scroll indicator

### Main CSS properties

```css
background-image;
background-size: cover;
background-position: center;
min-height;
display: flex;
align-items: center;
```

---

# 8. Introduction Section

The introduction uses a **two-column layout**.

### Left

Konark Sun Temple image.

### Right

- Heritage introduction
- Supporting paragraph
- Three statistics

### Statistics

- **10** — Iconic Temples
- **8+** — Regions Represented
- **1000s** — Years of Heritage

### Image styling

The image uses:

- Rounded corner
- Box shadow
- Fixed responsive height
- `object-fit: cover`

---

# 9. Ten Temple Cards

The main temple section contains **10 destination cards**.

Each card contains:

1. Temple image
2. Number
3. Location
4. Temple name
5. Short description
6. Interesting fact
7. Explore More link

## Temple List

### 01 — Kashi Vishwanath Temple

**Location:** Varanasi, Uttar Pradesh

**Highlight:**  
One of the twelve Jyotirlingas of Lord Shiva.

**Architecture:**  
North Indian Nagara style with a gold-plated spire.

---

### 02 — Golden Temple

**Location:** Amritsar, Punjab

**Highlight:**  
Harmandir Sahib sits within the Amrit Sarovar.

**Experience:**  
Sikh architecture and community Langar.

---

### 03 — Meenakshi Amman Temple

**Location:** Madurai, Tamil Nadu

**Highlight:**  
Known for towering gopurams and thousands of sculptures.

**Feature:**  
Hall of a Thousand Pillars.

---

### 04 — Tirupati Balaji Temple

**Location:** Tirumala, Andhra Pradesh

**Highlight:**  
Dedicated to Lord Venkateswara and located among the seven hills.

**Tradition:**  
Devotees offer hair as a mark of devotion.

---

### 05 — Jagannath Temple

**Location:** Puri, Odisha

**Highlight:**  
One of India's four Char Dham pilgrimage sites.

**Architecture:**  
Kalinga style with a curved tower.

---

### 06 — Somnath Temple

**Location:** Prabhas Patan, Gujarat

**Highlight:**  
Jyotirlinga temple located on the Arabian Sea coastline.

**Architecture:**  
Chaulukya-inspired architecture.

---

### 07 — Akshardham Temple

**Location:** New Delhi, Delhi

**Highlight:**  
Modern monument showcasing traditional Hindu architectural craftsmanship.

**Features:**  
Pink sandstone, white marble and fountain shows.

---

### 08 — Konark Sun Temple

**Location:** Konark, Odisha

**Highlight:**  
UNESCO World Heritage Site designed as a giant stone chariot.

**Wonder:**  
Its carved wheels can function as sundials.

---

### 09 — Vaishno Devi Temple

**Location:** Katra, Jammu & Kashmir

**Highlight:**  
Cave shrine in the Trikuta Mountains.

**Altitude:**  
Approximately 5,200 feet.

---

### 10 — Kedarnath Temple

**Location:** Kedarnath, Uttarakhand

**Highlight:**  
Himalayan Jyotirlinga surrounded by snow-capped peaks.

**Altitude:**  
Approximately 3,580 metres.

---

# 10. Temple Card Hover Effects

When the user moves the mouse over a temple card:

### Card

Moves slightly upward.

```css
transform: translateY(-9px);
```

### Shadow

Becomes stronger.

### Image

Slightly enlarges.

```css
transform: scale(1.07);
```

### Border

Changes subtly.

### Explore link

Arrow shifts diagonally.

These effects use CSS `transition` for smooth movement.

---

# 11. Temple Gallery

The gallery contains four image cards:

- Kashi Vishwanath
- Meenakshi Amman
- Somnath
- Kedarnath

## Gallery design

Desktop:

- One large image
- Three smaller images
- CSS Grid layout

Each gallery card contains:

- Image
- Temple name
- Location
- Dark gradient overlay

## Hover effect

On hover:

```css
transform: scale(1.08);
```

The image zooms slightly and the caption remains readable through the dark overlay.

---

# 12. Featured Temple

## Featured Destination

**Kedarnath**

### Information

- Uttarakhand
- Himalayas
- Approximately 3,580 m

### Travel details

- Best time: May–June and September–October
- Airport: Jolly Grant, Dehradun
- Railway: Rishikesh

### Design

The section uses:

- Large image
- Deep sage background
- White typography
- Gold accent
- Three travel-detail columns
- CTA button

On smaller screens, the image and content stack vertically.

---

# 13. Why Explore Indian Temples?

Four information cards are used.

## Architecture

Discover extraordinary forms, carvings, towers and design traditions.

## Heritage

Walk through places shaped by centuries of history and devotion.

## Culture

Experience festivals, traditions, food and local stories.

## Travel Experience

Turn every visit into a meaningful cultural journey.

### Design

Each card includes:

- Simple symbol/icon
- Heading
- Description
- Border
- Light background

### Hover

Cards move upward slightly and receive a soft shadow.

---

# 14. Travel Guide

Six information cards are included.

### 01 — Best Time to Visit

General seasonal travel guidance.

### 02 — Transportation

Airports, railway stations, buses, taxis and pilgrimage routes.

### 03 — Accommodation

Planning stays near temples or transport hubs.

### 04 — Visitor Guidelines

Respectful dress and temple-specific rules.

### 05 — Photography

Check photography restrictions.

### 06 — Nearby Attractions

Explore local landmarks, food, markets and cultural experiences.

---

# 15. Travel Enquiry Form

The form contains:

- Full Name
- Email
- Select Temple / Destination
- Travel Date
- Number of Visitors
- City
- Message
- Plan My Journey button

## Form controls

HTML elements include:

```html
<input>
<select>
<textarea>
<button>
```

## Styling

Inputs use:

- Border
- Padding
- Background
- Consistent spacing
- Focus effects

### Focus effect

When an input is selected:

- Border becomes gold
- A subtle gold focus ring appears

---

# 16. Footer

The footer contains four main areas.

## Brand

Sacred India

Short website description.

## Quick Links

- Home
- Temples
- Gallery
- Travel Guide
- Contact

## Popular Destinations

- Kedarnath
- Varanasi
- Ayodhya
- Puri
- Tirupati

## Connect

- Email
- Instagram
- Facebook
- X

The footer uses a deep sage background.

---

# 17. HTML Attributes Used

| Attribute | Purpose |
|---|---|
| `lang="en"` | Declares English document language |
| `charset="UTF-8"` | Unicode character support |
| `viewport` | Mobile responsiveness |
| `title` | Browser tab title |
| `href` | Links and stylesheet |
| `class` | Connects HTML elements to CSS |
| `id` | Section navigation targets |
| `src` | Image source |
| `alt` | Image accessibility description |
| `aria-label` | Accessibility label |
| `type="email"` | Email input |
| `type="date"` | Date input |
| `type="number"` | Visitor count |
| `min="1"` | Minimum visitor value |
| `rows="4"` | Textarea height |

---

# 18. CSS Techniques Used

## Layout

```css
display: flex;
display: grid;
flex-direction;
align-items;
justify-content;
gap;
grid-template-columns;
grid-template-rows;
```

## Spacing

```css
margin;
padding;
gap;
line-height;
letter-spacing;
```

## Typography

```css
font-family;
font-size;
font-weight;
color;
text-align;
text-transform;
```

## Images

```css
background-image;
background-size: cover;
background-position: center;
object-fit: cover;
```

## Visual effects

```css
box-shadow;
text-shadow;
linear-gradient;
backdrop-filter;
border-radius;
```

## Animation

```css
transition;
transform;
opacity;
@keyframes;
animation;
```

---

# 19. Responsive Design

The website has three main layout stages.

## Desktop

More than approximately 900px:

- Three-column temple grid
- Four-column Why Explore section
- Three-column Travel Guide
- Multi-column footer
- Full navigation

## Tablet

Up to approximately 900px:

- Two-column temple cards
- Two-column guide
- Two-column footer
- Introduction stacks
- Featured section stacks

## Mobile

Up to approximately 620px:

- One-column temple cards
- One-column guide
- One-column benefits
- Form fields stack
- Footer becomes one column
- Navigation becomes horizontally scrollable
- Gallery adapts to two columns
- Featured destination stacks vertically

---

# 20. Interaction Summary

| Element | Effect |
|---|---|
| Navigation | Gold underline animation |
| Buttons | Lift + colour transition |
| Temple cards | Lift + shadow + image zoom |
| Gallery | Image zoom + overlay |
| Explore links | Arrow movement |
| Footer links | Slight horizontal movement |
| Form inputs | Gold focus border + focus ring |
| Hero | Fade/rise entrance animation |

---

# 21. Important Notes

- The project is currently **front-end only**.
- The enquiry form does not have a backend.
- The “Explore more” links currently point toward the contact/journey section.
- Social links are placeholders.
- `hello@sacredindia.example` is a placeholder email.
- Temple images are loaded from remote Wikimedia Commons URLs.
- Google Fonts require an internet connection.
- For final deployment, image URLs should be checked and appropriately licensed.
- Practical temple timings, seasonal access and visitor rules should be verified before using this as a real travel service.

---

# 22. How to Run

1. Extract the ZIP file.
2. Keep `index.html` and `style.css` in the same folder.
3. Open `index.html` in a browser.
4. Make sure internet access is available for remote images and Google Fonts.

No server or JavaScript setup is required for the current version.

---

## Project Summary

**Sacred India** is a modern HTML5/CSS3 temple tourism webpage combining:

**Indian Heritage + Modern UI + Temple Photography + Travel Information + Responsive Design + CSS Interactions**

The design intentionally keeps the interface simple, aesthetic and readable while still demonstrating important HTML and CSS concepts such as semantic structure, Flexbox, CSS Grid, responsive media queries, hover states, transitions, animations, forms and image styling.
