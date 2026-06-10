# Ephemera — The Silent Network

An immersive, local-first anonymous micro-publishing platform built for expression without validation. There are no followers, likes, comments, notifications, or shares. Every thought is written on a digital sheet of paper using a simulated mechanical typewriter, and organically decays, blurs, and disintegrates into silence over 24 hours.

Designed as a premium, zero-dependency addition to a developer portfolio, **Ephemera** showcases advanced vanilla DOM scripting, real-time audio synthesis, and reactive procedural styling.

---

## 🖤 Core Philosophies

1. **Anti-Validation**: Zero metrics. No counters, thumbs-up, or threads. Thoughts stand alone, in equal silence.
2. **Ephemeral Lifespan**: Nothing typed is permanent. Every thought is subject to a 24-hour decay window.
3. **Immersive Skeuomorphism**: Typewriter sound design, paper rip profiles, and vintage monochrome screen filters ground the experience in the tactile physical world.

---

## 🛠️ Technical Highlights

### 1. Zero-Asset Audio Synthesis (Web Audio API)
Instead of loading external `.mp3` or `.wav` sound files (which slow down load times and create CORS or caching issues), Ephemera synthesizes all mechanical sounds programmatically in real-time:
* **Standard Key click**: Combines a fast frequency-swept oscillator (dropping from 630Hz to 70Hz in 35ms to mimic the metal key strike) with a narrow bandpass-filtered noise burst (representing key rattle/spring recoil).
* **Spacebar Thud**: Synthesizes a lower, deeper resonance using a triangle oscillator at 150Hz decaying to 40Hz, coupled with lowpass-filtered white noise.
* **Margin Bell (Ding!)**: Triggers when submitting or when typing near the 280-character limit. Created using three overlapping sine-wave oscillators with an LFO-driven pitch wobble to emulate metallic resonance.
* **Crackle Ambience**: Generates continuous background rain/record-crackle on the fly by filtering white noise into pink noise approximation parameters and injecting sparse high-amplitude impulse spikes.

### 2. Procedural CSS Ink Decay
Thoughts decay dynamically based on their age. The rendering loop calculates the elapsed time and maps it to inline CSS filters:
$$\text{Remaining Fraction} = \max\left(0, 1 - \frac{\text{Age (Hours)}}{24}\right)$$
* **Ink Fade**: Opacity scales from `1.0` down to `0.08`.
* **Ink Bleed (Blur)**: Apply CSS `filter: blur(Xpx)` where blur scales up to `2.2px` as the ink "evaporates" off the sheet.
* **Paper Disintegration**: Letters drift loose on the paper using dynamic `letter-spacing` expansions.
* **Torn Edge Card Layout**: Cards use an complex CSS vector `clip-path: polygon(...)` to render natural-looking, randomized torn paper sheets at the bottom.

### 3. Portfolio Time Warp Sandbox
A prominent debugger panel is included for portfolio reviewers. Rather than waiting 24 hours to observe the decay states:
* Slide the **Decay Simulator** from `0` to `24` hours.
* This warps the rendering clock forward in real-time, allowing the user to observe the gradual fading, blurring, and ultimate deletion of active posts.

---

## 📂 File Architecture

* [index.html](file:///c:/Users/leona/OneDrive/Documents/ephemera/index.html) — Semantic HTML5 markup, CRT scanline grids, and interface panels.
* [style.css](file:///c:/Users/leona/OneDrive/Documents/ephemera/style.css) — HSL monochrome styling variables, typewriter skeuomorphic styling, and paper animations.
* [audio.js](file:///c:/Users/leona/OneDrive/Documents/ephemera/audio.js) — Pure DSP mechanical sound generation using the Web Audio API.
* [app.js](file:///c:/Users/leona/OneDrive/Documents/ephemera/app.js) — Application lifecycle manager, LocalStorage persistence, render loop, and time simulation hooks.

---

## 🚀 How to Run Locally

Since this is a lightweight, frontend-only application, it has **no build steps or external dependencies**.

1. Double-click the `index.html` file to run it in any modern browser, or serve it using a local developer server (e.g. VS Code Live Server or python http module):
   ```bash
   python -m http.server 8000
   ```
2. Open `http://localhost:8000` in your web browser.
3. Click anywhere to activate the audio system.
4. Type in the input sheet to experience the typing sound synthesis, and use the sandbox slider to test the decay.
