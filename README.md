# Ephemera — The Silent Network

👉 **Live Site:** [https://leoxirfzzzz.github.io/ephemera/](https://leoxirfzzzz.github.io/ephemera/)

An immersive, zero-dependency skeuomorphic web application built for anonymous micro-publishing. There are no followers, likes, comments, notifications, or shares. Every thought is written onto virtual typewriter paper and organically decays, blurs, and disintegrates into ash over 24 hours.

Designed as a premium, interactive portfolio piece, **Ephemera** showcases advanced vanilla DOM scripting, real-time math-based audio synthesis, and responsive skeuomorphic design.

---

## 🖤 Core Philosophies

1. **Anti-Validation:** No counters, thumbs-up, shares, or comment sections. Thoughts stand alone in equal silence.
2. **Ephemeral Permanence:** Every keystroke is a ripple. Thoughts fade away.
3. **Tactile Grounding:** Real-time typewriter sound design, mechanical feedback, and vintage mahogany desk styling create a tangible, focused environment.

---

## 🛠️ Technical Highlights

### 1. Zero-Asset Audio Synthesis (Web Audio API)
To eliminate external asset download bottlenecks and caching issues, Ephemera synthesizes all typewriter acoustics programmatically:
* **Standard Key click:** Combines a fast frequency-swept oscillator (sweeping from 630Hz to 70Hz in 35ms for the steel striker impact) with a bandpass-filtered noise burst (for spring recoil and mechanical rattle).
* **Spacebar Thud:** Synthesizes a deep woody resonance using a triangle oscillator at 150Hz decaying to 40Hz, coupled with lowpass-filtered white noise.
* **Margin Bell (Ding!):** Triggers automatically near carriage boundaries (68 characters). Created using three overlapping sine-wave oscillators with an LFO-driven pitch wobble to emulate vintage metallic bells.
* **Carriage Return Ratchet:** Synthesizes a sequence of gear-clicks (accelerating triangle oscillator sweeps) followed by a low-frequency platen clunk.
* **Atmospheric Ambience:** Generates continuous Rain (pink noise approximation parameters and impulse crackle pops), Hearth (lowpass-filtered warm crackle snaps), and Wind (slow filter-sweep whistling gusts).

### 2. Skeuomorphic Typewriter Mechanics
* **Dynamic Ribbon Spool Motion:** The left and right ribbon spools spin in opposite directions on every key strike (both physical typing and virtual clicking), mimicking the physical ink ribbon feeding mechanism.
* **Extended Return Lever:** An authentic, prominent carriage return lever arm that rotates sideways (`-45deg`) when submitting a message.
* **Dual-Legend Keycaps:** Circular keycaps show both unshifted keys and their shifted symbols (e.g. `! 1`, `@ 2`, `+ =`, `: ;`), matching the exact mechanical layouts.
* **Visual Shift Basket:** Pressing `SHIFT` on screen or holding the physical `Shift` key triggers a shift-state. The upper symbols scale up and brighten while the primary keys dim, simulating physical typewriter shift alignment.
* **Organic Ink Splatters:** Typing has an 8% chance to procedurally spray random-sized, organic ink droplets that dissolve over 7 seconds.

### 3. Procedural CSS Ink Decay
Thoughts decay dynamically based on their age:
$$\text{Remaining Fraction} = \max\left(0, 1 - \frac{\text{Age (Hours)}}{24}\right)$$
* **Ink Fade:** Card opacity scales from `1.0` to `0.08`.
* **Ink Bleed (Blur):** Applies a CSS `filter: blur(Xpx)` scaling up to `2.2px` as ink "evaporates" off the card.
* **Paper Disintegration:** Letters drift loose on the paper using dynamic `letter-spacing` expansions.
* **Deckled Edge Card Layout:** Thought cards use a CSS vector `clip-path: polygon(...)` to render natural-looking, randomized torn paper sheets at the bottom.

### 4. Global Keyboard Autofocus
* Catching physical key presses globally redirects focus back to the typewriter textarea instantly. Users can begin typing immediately upon landing without needing to manually click the paper first.
* Built-in `shiftKeyMap` and `shiftCharMap` translation arrays map shifted keys (like `!`) to unshifted targets (like `1`) to animate the key depression on the screen.

### 5. Universal Screen Compatibility
Built with a highly optimized, responsive CSS breakpoint system:
* **Desktop & Laptops:** Displays the full mahogany desk environment and 40px circular keys.
* **Tablets (max-width: 850px):** Adjusts container padding and logo sizes.
* **Mobile Devices (max-width: 600px):** Keycaps scale down to `28px` to fit QWERTY rows without horizontal overflow.
* **Micro Screens (max-width: 440px):** Keycaps scale to `22px` and automatically hide the secondary stacked shifted symbols, switching to single-legend keycaps for legibility.

---

## 📂 File Architecture

* [index.html](file:///c:/Users/leona/OneDrive/Documents/ephemera/index.html) — Semantic HTML5 structure, CRT scanline grids, and keyboard layouts.
* [style.css](file:///c:/Users/leona/OneDrive/Documents/ephemera/style.css) — Theme variables, skeuomorphic shapes, layout sheets, and responsive rules.
* [audio.js](file:///c:/Users/leona/OneDrive/Documents/ephemera/audio.js) — Pure DSP mechanical and ambient sound synthesis.
* [app.js](file:///c:/Users/leona/OneDrive/Documents/ephemera/app.js) — Application lifecycle manager, LocalStorage state, and keypress controllers.

---

## 🚀 How to Run Locally

Since this is a lightweight, frontend-only application, it has **no build steps or external dependencies**.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/LeoxIrfzzzz/ephemera.git
   ```
2. Double-click the `index.html` file to run it in any modern browser, or serve it using a local developer server:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.
4. Click anywhere to activate the sound system, start typing, and enjoy!

---

👉 **Live Site:** [https://leoxirfzzzz.github.io/ephemera/](https://leoxirfzzzz.github.io/ephemera/)
