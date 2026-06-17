# ComfyUI Enigmatic Nodes

A growing collection of ComfyUI custom nodes by enigmatice.

## Nodes

---

### Mask Remove Small Regions

Removes small disconnected white blobs from a mask or mask batch. Any connected region with fewer pixels than `min_area` is zeroed out. The main large region is kept exactly as-is.

Useful when your alpha matte has stray noise dots that cause crop nodes (like InpaintCropImproved) to jump to unexpected locations.

**Category:** `masking`

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| mask | MASK | — | Input mask or mask batch |
| min_area | INT | 500 | Minimum pixel area to keep. Regions smaller than this are removed. |
| threshold | FLOAT | 0.5 | Brightness cutoff — pixels above this value count as white. |

**Output**

| Output | Type | Description |
|---|---|---|
| mask | MASK | Cleaned mask with small regions removed |

**Tuning guide**

- Lower `min_area` → keeps more smaller regions (less aggressive)
- Raise `min_area` → removes more smaller regions (more aggressive)
- `threshold` controls what brightness counts as white — leave at 0.5 for clean mattes

---

### NTSC-RS Effect

Applies authentic NTSC/VHS analog video degradation to images or video frames. Powered by [ntsc-rs](https://github.com/ntsc-rs/ntsc-rs) — a high-quality Rust implementation of a composite video signal simulator.

On first use the node automatically downloads `ntsc-rs-cli.exe` and its GStreamer DLLs from the ntsc-rs GitHub releases. **Windows only.** Requires an internet connection on first run.

**Category:** `image/effects`

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| image | IMAGE | — | Input image or video batch |
| random_seed | INT | 0 | Seed for all randomised elements |
| use_field | combo | InterleavedUpper | Which video fields to simulate |
| luma_smear | FLOAT | 0.5 | Horizontal blur on the luminance signal |
| composite_sharpening | FLOAT | 1.0 | Pre-emphasis sharpening on the composite signal |
| chroma_lowpass_in | combo | Full | Input chroma low-pass filter strength |
| chroma_lowpass_out | combo | Full | Output chroma low-pass filter strength |
| chroma_demodulation | combo | Notch | Chroma demodulation filter type |
| chroma_phase_noise | FLOAT | 0.0 | Random phase noise on chroma |
| chroma_phase_error | FLOAT | 0.0 | Constant chroma hue shift |
| chroma_delay_h | FLOAT | 0.0 | Horizontal colour misalignment |
| chroma_delay_v | INT | 0 | Vertical colour misalignment |
| chroma_vert_blend | BOOLEAN | True | VHS-style vertical chroma blending |
| snow_intensity | FLOAT | 0.0 | Speckle noise intensity (0 = none) |
| snow_anisotropy | FLOAT | 0.5 | Snow shape: 0 = dots, 1 = horizontal streaks |
| input_luma_filter | combo | Notch | Low-pass filter on input luma |
| filter_type | combo | Butterworth | IIR filter shape |
| head_switching | BOOLEAN | False | VCR head-switching glitch at bottom of frame |
| head_switching_height | INT | 8 | Scan-lines affected by head switching |
| head_switching_offset | INT | 3 | Vertical offset of head-switching band |
| head_switching_horiz_shift | FLOAT | 72.0 | Horizontal shift of head-switching band |
| tracking_noise | BOOLEAN | False | VHS tracking noise band |
| tracking_noise_height | INT | 12 | Height of tracking noise band |
| tracking_noise_wave_intensity | FLOAT | 15.0 | Wave displacement in tracking band |
| ringing | BOOLEAN | False | RF ringing around high-contrast edges |
| ringing_frequency | FLOAT | 0.45 | Ringing frequency |
| ringing_power | FLOAT | 4.0 | Ringing roll-off power |
| ringing_intensity | FLOAT | 4.0 | Ringing amplitude |
| vhs_enabled | BOOLEAN | False | Enable VHS tape-speed simulation |
| vhs_tape_speed | combo | LP | Tape speed: SP (best) / LP / EP (worst) |
| vhs_chroma_loss | FLOAT | 0.000025 | Chroma dropout probability per pixel |
| vhs_sharpen_enabled | BOOLEAN | False | VHS high-frequency sharpening circuit |
| vhs_sharpen_intensity | FLOAT | 0.25 | Sharpening strength |
| vhs_edge_wave_enabled | BOOLEAN | False | VHS edge-wave distortion |
| vhs_edge_wave_intensity | FLOAT | 0.5 | Edge wave amplitude |
| vhs_edge_wave_speed | FLOAT | 4.0 | Edge wave speed |
| settings_json_override | STRING | "" | (Optional) Paste a full ntsc-rs JSON preset to override all sliders |

**Output**

| Output | Type | Description |
|---|---|---|
| image | IMAGE | Processed image with analog video effects applied |

**Notes**

- For batches (video), the node uses a single MJPEG AVI pipeline via `opencv-python` for speed. Falls back to per-frame PNG processing if cv2 is not available.
- The `settings_json_override` input accepts a raw ntsc-rs preset JSON (must include `"version": 1`). Export presets from the ntsc-rs desktop GUI and paste them here.
- Binaries are cached in `nodes/bin/` and never re-downloaded unless deleted.

---

## Installation

### Via ComfyUI Manager
Search for **Enigmatic Nodes** in the Manager node list.

### Manual
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/enigmatice/comfyui-enigmatic-nodes
```
Then restart ComfyUI.

## Requirements

- torch
- numpy
- scipy
- Pillow
- opencv-python

All are included in standard ComfyUI installations.

## License

MIT
