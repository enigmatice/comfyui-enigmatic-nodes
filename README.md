# ComfyUI Enigmatic Nodes

A growing collection of ComfyUI custom nodes and UI tools by enigmatice.

---

## Nodes

### Mask Remove Small Regions
Cleans up a mask by erasing any disconnected white blob smaller than `min_area` pixels. Useful for removing stray noise dots that cause crop nodes to jump to unexpected positions.
**Category:** `masking`

---

### Mask Hold Until Stable
Takes a batch of masks (e.g. from a face-detection node over a video) and outputs a single held crop — locked to either the first frame whose mask exceeds a size threshold, or the peak (largest) frame in the batch. Eliminates jitter when using animated crops on talking-head footage.
**Category:** `masking`

---

### NTSC-RS Effect
Applies authentic NTSC/VHS analog video degradation to images or video frames using [ntsc-rs](https://github.com/ntsc-rs/ntsc-rs). Simulates composite signal artifacts: chroma smear, ringing, snow, head-switching glitches, tracking noise, VHS tape-speed modes, and more. The binary downloads automatically on first use. **Windows only.**
**Category:** `image/effects`

---

### Video Resolution Picker
Outputs a width and height calculated from a chosen aspect ratio (1:1, 16:9, 9:16) and a longest-side value, snapped to a step size for model compatibility. Eliminates manual math when wiring resolution inputs for video generation nodes.
**Category:** `image`

---

## UI Extensions

### Theme Engine
A floating **🎨 Theme** button on the canvas opens a gallery of 40+ color themes (Cyberpunk, Nord, Dracula, Dungeon, Cotton Candy, and many more). Each theme recolors the ComfyUI interface and canvas nodes. A separate **Fonts** tab lets you override the active theme's font independently. Themes and font choices persist across sessions.

---

### Node Color Picker
A floating toolbar that appears whenever nodes or groups are selected. The color swatch button opens a palette of coordinated themes to recolor just your selected nodes, a group, or both at once. Alignment buttons (left, right, top, bottom, center, distribute) let you snap selected nodes and groups into place without leaving the canvas.

---

## Installation

### Via ComfyUI Manager
Search for **Enigmatic Nodes**.

### Manual
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/enigmatice/comfyui-enigmatic-nodes
```
Restart ComfyUI.

---

## License

MIT
