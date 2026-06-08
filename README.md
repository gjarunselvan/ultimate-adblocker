# 🛡️ Ultimate AdBlocker

> A military-grade, zero-tolerance Google Chrome Extension designed to absolutely obliterate popups, popunders, invisible click-traps, and evasive ad scripts.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version: 1.0](https://img.shields.io/badge/Version-1.0-brightgreen.svg)
![Platform: Chrome](https://img.shields.io/badge/Platform-Chrome-yellow.svg)

---

## 🚀 The Problem
Modern streaming and torrent websites employ extremely malicious and evasive ad techniques that easily bypass standard ad blockers. They use:
- **IFrame Proxies:** Spawning hidden iframes to launch popups without triggering the main window's popup blocker.
- **Fake System Prompts:** Injecting HTML designed to perfectly mimic native browser alerts ("Please Confirm You Are Not A Robot") to trick you into clicking.
- **Cursor-Following Traps:** Attaching invisible 5x5 pixel anchor tags directly to your mouse cursor.
- **Simulated Clicks:** Hijacking your clicks on legitimate buttons and programmatically firing invisible links.

## ⚔️ The Solution
**Ultimate AdBlocker** was custom-engineered to hunt down and destroy these specific tactics. It doesn't just block URLs—it dynamically rewrites the browser engine to revoke the website's privileges.

### Core Features

* **☢️ Absolute Window.Open Nuke**  
  Uses advanced Javascript property locking (`Object.defineProperty`) to physically freeze the `window.open`, `alert`, and `confirm` functions. The website is mathematically incapable of opening a popup.

* **👻 Invisible Click-Trap Interceptor**  
  Runs a global event listener at the absolute lowest capture phase. If you click a massive transparent overlay or an invisible element attached to your mouse, the extension intercepts the click, neutralizes the event, and deletes the trap from the DOM.

* **🤖 Scam Phrase Destroyer**  
  Constantly scans the active text on your screen. If it reads phrases like *"Confirm you are not a robot"*, *"Your computer is infected"*, or *"Click allow"*, it instantly climbs the DOM tree and violently deletes the HTML container.

* **🧟 IFrame Neutralizer**  
  Intercepts the `Node.prototype.appendChild` function to catch dynamically spawned iframes *before* they render, actively stripping their `contentWindow` of all popup capabilities. Any iframe not belonging to a trusted video player is purged.

* **▶️ YouTube UI Safe**  
  Aggressively blocks YouTube video ads (auto-muting, 16x fast-forwarding, and auto-clicking the "Skip" button instantly) while deliberately leaving the YouTube comment sections, sidebars, and video player controls completely intact.

---

## 🛠️ Installation

1. Clone or download this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button.
5. Select the folder containing the extension files.
6. The extension is now active! 

## ⚙️ Usage

The extension features a clean popup interface where you can toggle the AdBlocker ON or OFF globally. You can also adjust the intensity:
- **Light:** Standard ad blocking (removes banners and standard popups).
- **Severe:** Activates the nuclear page context overrides, click interceptors, and iframe sweepers. (Recommended for extreme environments).

---

*Built with absolute zero-tolerance for popups.*
