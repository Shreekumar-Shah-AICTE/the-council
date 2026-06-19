# 🎨 THE COUNCIL — Master Design Specification & Asset Pipeline

> **Design Theme:** Apple-Editorial Stark Hybrid (Light Mode)
> **Core Concept:** Deep contrast, high-end editorial typography, immersive whitespace, and dynamic visual motifs that feel like a premium print magazine meeting Apple's hardware design.

---

## 1. BRANDING & DESIGN DNA

The typical AI hackathon project is a dark, glowing blue/purple template. To break through the noise and capture the judges' visual attention instantly, **THE COUNCIL** is built on a high-contrast, stark white, editorial layout.

### Visual Pillars
1. **Immersive Whitespace:** Large, breathing layout containers. Empty space is not "empty"—it is an active design choice that communicates luxury and authority.
2. **Apple-Grade Precision:** Hairline borders, razor-sharp alignments, subtle drop shadows, and glassmorphism overlays that feel like macOS light mode.
3. **High-Contrast Editorial Typography:** A bold pairing of a literary serif for headings/motifs and a geometric sans-serif for numbers/interface elements.
4. **Text Motifs:** Injected styling patterns within sentences to break uniformity. Certain words change font family (to italic serif or monospace) and color to draw attention to insights, making the reading experience feel bespoke.
5. **Physicality:** The "Chamber" represents a real meeting room. Semicircular layouts, active glowing states, and smooth typographic streams give the AI agents physical presence.

---

## 2. THE LIGHT-MODE DESIGN TOKENS

Create or update your stylesheet (`frontend/src/app/globals.css`) with the following CSS variables:

```css
:root {
    /* Backgrounds - Stark & Premium */
    --bg-page: #FFFFFF;              /* Pure white base */
    --bg-surface: #F9F9FB;           /* Off-white cards & sections */
    --bg-elevated: #F2F2F7;          /* Input fields, hover states */
    --bg-glass: rgba(255, 255, 255, 0.75); /* Clean glassmorphism backdrop */

    /* Typography & Hierarchy */
    --text-primary: #000000;         /* Jet black for high-contrast reading */
    --text-secondary: #515154;       /* Deep charcoal for body text */
    --text-muted: #86868B;           /* Apple-grey for labels & metadata */
    --text-hint: #AEAEB2;            /* Light grey for placeholders */

    /* Accent & Borders */
    --accent: #000000;               /* Monochromatic primary focus */
    --border-hairline: rgba(0, 0, 0, 0.08); /* Crisp separator lines */
    --border-hover: rgba(0, 0, 0, 0.18);    /* Darker border on focus/hover */
    --shadow-premium: 0 10px 40px -10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
    --shadow-focus: 0 0 0 4px rgba(0, 0, 0, 0.05);

    /* Advisor Subtle Motifs (Deep, sophisticated tones for light mode) */
    --skeptic: #B25E00;              /* Rich Amber-Ochre */
    --strategist: #5E35B1;          /* Imperial Deep Violet */
    --numbers: #00796B;             /* Emerald Teal */
    --devils-advocate: #C62828;     /* Crimson Red */
    --chair: #1A237E;               /* Deep Royal Navy */

    /* Stakes Colors */
    --stakes-low: #00796B;
    --stakes-medium: #E65100;
    --stakes-high: #D84315;
    --stakes-critical: #C62828;

    /* Fonts */
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-sans: 'Inter', -apple-system, sans-serif;
    --font-mono: 'Geist Mono', Courier, monospace;
    --font-display: 'Outfit', -apple-system, sans-serif;

    /* Transitions & Physics */
    --transition-fast: 150ms cubic-bezier(0.25, 0.1, 0.25, 1);
    --transition-smooth: 300ms cubic-bezier(0.25, 1, 0.5, 1);
    --transition-spring: 450ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 3. THE TEXT MOTIF SYSTEM

Instead of uniform paragraph text, we implement three "motifs" that are randomly or structurally assigned to specific words, phrases, or agent arguments. This gives the interface an artistic, editorial layout.

### Motif 1: The Literary Contrast (`.motif-literary`)
* **Styling:** Switches the font to Cormorant Garamond, applies italic styling, and uses a slightly lower font weight.
* **Usage:** Used for reflective phrases, quotes, or deep insights.
* **Example:** "The Skeptic raised a *critical objection* to the vesting timeline..."
* **CSS:**
```css
.motif-literary {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: 500;
    color: var(--text-primary);
}
```

### Motif 2: The Technical Precision (`.motif-precise`)
* **Styling:** Switches the font to Geist Mono, reduces the size slightly, increases letter-spacing, and sets the background to a very faint gray capsule.
* **Usage:** Used for figures, percentages, dates, or formulaic elements.
* **Example:** "At `0.4% equity`, you are taking on high leverage."
* **CSS:**
```css
.motif-precise {
    font-family: var(--font-mono);
    font-size: 0.85em;
    letter-spacing: -0.02em;
    background: rgba(0, 0, 0, 0.04);
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    font-weight: 600;
}
```

### Motif 3: The Advisor Persona Accent (`.motif-advisor`)
* **Styling:** Colors the text with the advisor's signature color, increases weight to bold, and applies a tiny, subtle underlines or accent marks.
* **Usage:** Used when referring to an advisor's specific stance or when an advisor makes their primary claim.
* **Example:** "**THE DEVIL'S ADVOCATE** challenges the consensus..."
* **CSS:**
```css
.motif-advisor-skeptic { color: var(--skeptic); font-weight: 700; }
.motif-advisor-strategist { color: var(--strategist); font-weight: 700; }
.motif-advisor-numbers { color: var(--numbers); font-weight: 700; }
.motif-advisor-devils { color: var(--devils-advocate); font-weight: 700; }
.motif-advisor-chair { color: var(--chair); font-weight: 700; }
```

---

## 4. IMAGES & VISUAL ASSET PROMPTS (ChatGPT Image 2.0)

These prompts utilize the **Spectacle-based (Emotion/Visceral)** prompting technique to unlock the full potential of the model.

### Asset 1: Hero Section Feature Image (Subject + Text Behind Object)
* **Design Concept:** An extremely premium, stark-white conceptual art piece. The subject is an elegant, polished chrome chair (representing the user's decision seat) floating in a vast, minimalist white architectural gallery. Behind it, partially obscured by the chair's structure (creating a deep 3D layer effect), are the massive, bold, editorial serif words "**THE COUNCIL**".
* **Prompt:**
```text
I want you to design a high-concept visual masterpiece that will serve as the hero section for a premium web platform called 'THE COUNCIL'. 

The image must be a sheer visual explosion of raw architectural beauty and editorial layout. The background is a vast, sun-drenched, stark-white concrete gallery with massive scale, towering walls, and clean, razor-sharp architectural shadows cast by a single high-noon light source. 

In the center of this space, floating slightly off the ground, is a polished chrome, sculptural, ultra-minimalist throne. The chrome surface has deep, perfect reflections of the white walls and sky, looking liquid and metallic. 

Directly behind the chrome throne, intersecting it, is the massive, bold, editorial serif text "THE COUNCIL" in a deep matte-black font. The text is partially hidden and obscured behind the chrome lines of the throne, creating an intense, mesmerizing "text-behind-object" 3D depth effect. 

The image must be so incredibly stunning, magnetic, and boundary-breaking that it instantly triggers the following visceral emotions in the viewer:
1. Subconscious grip that hacks the visual cortex and disrupts conventional layouts.
2. Goosebumps, absolute awe, and an instant dopamine rush.
3. Complete inability to look away—a pupil-dilating fixation that paralyzes the viewer.
4. A heart-pounding sense of dangerous authority, supreme confidence, and high fashion.

Shatter the rules. Make the lighting dramatic, the composition centered, the environment pristine and empty. Deliver a premium, high-contrast, artistic masterpiece.
```

### Asset 2: Main Platform Logo (Transparent Background)
* **Design Concept:** A minimalist, luxury-brand style icon representing five intersecting arches or pillars in a crescent shape. Monochromatic, high-end, vector style, transparent background.
* **Prompt:**
```text
Design a luxury-brand, minimalist emblem to serve as the official logo for 'THE COUNCIL'. 

The design must consist of five stylized, high-contrast black arches arranged in a sweeping, elegant crescent or semicircle, symbolizing five seats facing a central point. The lines must be razor-sharp, uniform, and represent ultimate balance, symmetry, and architectural grace. It must evoke the aesthetic of high-end editorial magazines like Vogue or architectural journals like El Croquis. 

The image must be isolated on a pure, solid, clean white background. Make it a vector logo icon, high contrast, containing only solid black geometry. No gradients, no shadows, no background clutter. It must look incredibly premium, iconic, and unforgettable.
```

### Asset 3: Custom Mouse Cursor Asset (Transparent Background)
* **Design Concept:** A sleek, sharp, double-headed pointer that resembles a minimalist, obsidian-like needle or geometric shard.
* **Prompt:**
```text
Design a sharp, ultra-minimalist custom mouse cursor icon. It must look like an elegant, double-pointed geometric needle crafted from dark, polished obsidian. The needle is long, extremely thin, and sharp, with a tiny, clean circular hollow at its center. 

The cursor must be shown pointing at a 45-degree angle. It must be isolated on a pure, solid, clean white background, completely flat, without any shadows or environmental reflections. The lines must be razor-sharp and high contrast. Make it look like a high-fashion, premium interface asset.
```

### Asset 4: The 5 Advisor Portraits (Editorial Headshots)
We generate 5 distinct, high-fashion, editorial portraits. They are highly styled, black-and-white headshots, each containing a single, intense pop of their respective advisor color in the background lighting or geometric patterns.

#### Portrait A: The Skeptic (Amber Accent)
```text
Create a high-fashion, editorial headshot portrait of an advisor named 'The Skeptic'. The subject is an elegant, sharp-eyed woman in her late 50s with distinguished silver hair, wearing a structured, bespoke charcoal tweed coat and adjusting thin, wire-framed spectacles. She looks directly into the camera with an intense, analytical, and highly protective gaze. 

The portrait is high-contrast black-and-white, but the background features a single, dramatic pop of color: soft, glowing amber-ochre geometric lines slicing through the darkness behind her. 

The image must trigger a sense of deep protection, wisdom, and absolute trust. A masterpiece in portrait psychology, capturing details like the texture of her coat, the reflections in her glasses, and the sharpness of her eyes. Pure editorial perfection.
```

#### Portrait B: The Strategist (Deep Violet Accent)
```text
Create a high-fashion, editorial headshot portrait of an advisor named 'The Strategist'. The subject is a visionary, chess-master style individual in their late 30s with a calculating, forward-looking gaze, looking slightly off-camera. They are wearing a structured cashmere turtleneck sweater in an architectural, deep indigo-purple. 

The portrait is a high-contrast monochrome image, but the background features a dramatic, soft, atmospheric glow of deep violet light framing their head. 

The image must evoke strategic genius, quiet confidence, and visionary foresight. Masterpiece in lighting, shadows, and facial expression. Cinematic and premium.
```

#### Portrait C: The Numbers (Teal/Emerald Accent)
```text
Create a high-fashion, editorial headshot portrait of an advisor named 'The Numbers'. The subject is an ultra-focused, calm mathematician or quantitative analyst in their early 30s, looking intently forward. They are wearing a sharp, minimalist black suit. 

The portrait is high-contrast black-and-white, but surrounding them are faint, glowing, holographic emerald-teal data lines and geometric rings floating in the air. 

The image must evoke precision, mathematical certainty, and calm calculation. Razor-sharp focus, detailed textures of the suit, and high-fidelity rendering of the holographic light.
```

#### Portrait D: The Devil's Advocate (Crimson Red Accent)
```text
Create a high-fashion, editorial headshot portrait of an advisor named 'The Devil's Advocate'. The subject is a charismatic, slightly rebellious, sharp-featured individual in their mid-30s. They are looking directly at the camera with an intriguing, boundary-breaking, knowing smile. They are wearing a high-end, structured blazer with a blood-red satin lapel. 

The portrait is high-contrast black-and-white, but the background features a dramatic, intense, saturated crimson-red light casting a sharp silhouette. 

The image must trigger goosebumps and a sense of intellectual danger, provocative challenge, and supreme charisma. Legendary portrait quality.
```

#### Portrait E: The Chair (Deep Navy Accent)
```text
Create a high-fashion, editorial headshot portrait of an advisor named 'The Chair'. The subject is an authoritative, wise elder in their 60s with silver hair and a deeply composed, calm expression. They represent supreme balance, finality, and synthesis. They are wearing a structured, high-collar navy coat. 

The portrait is high-contrast black-and-white, with a soft, regal navy-blue halo light framing their profile, highlighting their wise features. 

The image must trigger a feeling of final authority, absolute balance, and deep peace. Masterpiece in composition, lighting, and textures.
```

---

## 5. INTERACTION DESIGN & MICRO-ANIMATIONS

1. **The Typer Message Queue (Frontend Principle 5):**
   * Do not dump streamed text immediately onto the screen. Maintain a React state buffer. 
   * A custom hook `useMessageQueue` will read chunks from the WebSocket, push them to a queue, and dequeue them at a smooth, constant typing speed (e.g., 20ms per character) using `requestAnimationFrame`.
   * This creates a cinematic, fluid typing effect that mimics a real person responding in real-time, even if the LLM streams in erratic bursts.

2. **Active Speaker Halo:**
   * When an agent is "speaking" (i.e., its message is currently typing out), its circular avatar on the Council Table glows softly with its signature color, and a subtle pulse animation is applied to its borders.

3. **Stakes Level Entry:**
   * When the stakes classifier returns the stakes score, the "Stakes Indicator" dial sweeps from 0 to the calculated score with a spring animation (`transition-spring`).

4. **Convergence Meter Dial:**
   * The consensus meter uses an SVG circular path that fills up according to the calculated convergence score (0.0 to 1.0) using CSS `stroke-dashoffset` transitions.

---

## 6. SERVICES INTEGRATION — MANUAL SETUP GUIDE

To implement the system architecture, Shree must configure the following accounts and credentials.

### Step 1: Band.ai Setup (The Core Agent Mesh)
1. Log in to your [Band Developer Console](https://app.band.ai).
2. Go to the **Agents** tab.
3. Register **5 Remote Agents** with the following names:
   * `The Skeptic`
   * `The Strategist`
   * `The Numbers`
   * `The Devil's Advocate`
   * `The Chair`
4. For each agent, Band will generate an **Agent ID (UUID)** and an **API Key**.
5. Create a file called `.env.local` at the project root and copy-paste these credentials (matching the keys in `.env.template`).

### Step 2: Featherless AI Setup (Agent LLM Provider)
1. Go to [Featherless.ai](https://featherless.ai) and log in.
2. Go to your dashboard and generate an **API Key**.
3. Copy this API key and paste it as `FEATHERLESS_API_KEY` in your `.env.local` file.
4. Verify models: The models `Qwen/Qwen3.5`, `meta-llama/Llama-4-Maverick-17B-128E-Instruct`, and `meta-llama/Llama-4-Scout-17B-16E-Instruct` will be queried directly via Featherless.

### Step 3: AI/ML API Setup (The Chair's LLM Provider)
1. Go to [aimlapi.com](https://aimlapi.com) and log in.
2. Go to your dashboard and copy your **API Key**.
3. Paste it as `AIMLAPI_KEY` in your `.env.local` file.
4. The Chair agent will use this to call `gpt-4o-mini` for final high-quality synthesis.

### Step 4: Brightdata Setup (Market Grounding Integration)
1. Go to [Brightdata.com](https://brightdata.com) and log in.
2. Under **Scraping APIs**, select the **Job Listings Dataset (v3)** or web scraper.
3. Generate an API Key/Token.
4. Paste it as `BRIGHTDATA_API_KEY` in your `.env.local` file.
5. If you do not have active credits, the backend will automatically fall back to our local curated market salary dataset without crashing.
