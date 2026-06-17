# ComfyUI Mask Utils

A ComfyUI custom node for cleaning noisy alpha matte masks before using them as crop regions.

## Nodes

### Mask Remove Small Regions

Removes small disconnected white blobs from a mask or mask batch. Any connected region with fewer pixels than `min_area` is zeroed out. The main large region is kept exactly as-is.

Useful when your alpha matte has stray noise dots that cause crop nodes (like InpaintCropImproved) to jump to unexpected locations.

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

## Installation

### Via ComfyUI Manager
Search for **Mask Utils** in the Manager node list.

### Manual
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/enigmatice/comfyui-mask-utils mask_small_region_filter
```
Then restart ComfyUI.

## Requirements

- torch
- numpy
- scipy

All three are included in standard ComfyUI installations.

## License

MIT
