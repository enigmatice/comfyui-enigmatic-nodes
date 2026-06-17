print("[comfyui-enigmatic-nodes] Loading...")

from .nodes.mask_remove_small_regions import (
    NODE_CLASS_MAPPINGS as _MASK_CLASSES,
    NODE_DISPLAY_NAME_MAPPINGS as _MASK_NAMES,
)
from .nodes.ntsc_rs_effect import (
    NODE_CLASS_MAPPINGS as _NTSC_CLASSES,
    NODE_DISPLAY_NAME_MAPPINGS as _NTSC_NAMES,
)

NODE_CLASS_MAPPINGS = {**_MASK_CLASSES, **_NTSC_CLASSES}
NODE_DISPLAY_NAME_MAPPINGS = {**_MASK_NAMES, **_NTSC_NAMES}

print(f"[comfyui-enigmatic-nodes] Registered: {list(NODE_CLASS_MAPPINGS.keys())}")
