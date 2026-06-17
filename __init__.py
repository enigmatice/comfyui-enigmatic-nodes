import torch
import numpy as np
import scipy.ndimage

print("[mask_small_region_filter] Loading...")


class MaskRemoveSmallRegions:
    """
    Removes small disconnected white regions from a mask batch.
    Only keeps connected components whose pixel area is >= min_area.
    Useful for cleaning noise dots from alpha mattes before using the
    mask as a crop region, preventing stray pixels from throwing off
    the bounding box.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "mask": ("MASK",),
                "min_area": ("INT", {
                    "default": 500,
                    "min": 1,
                    "max": 500000,
                    "step": 10,
                    "tooltip": "Minimum pixel area to keep. Regions smaller than this are removed."
                }),
                "threshold": ("FLOAT", {
                    "default": 0.5,
                    "min": 0.01,
                    "max": 1.0,
                    "step": 0.01,
                    "tooltip": "Value above which a pixel counts as white. Use ~0.5 for clean mattes."
                }),
            }
        }

    RETURN_TYPES = ("MASK",)
    RETURN_NAMES = ("mask",)
    FUNCTION = "filter_regions"
    CATEGORY = "masking"
    DESCRIPTION = (
        "Removes small disconnected white blobs from a mask or mask batch. "
        "Any connected region with fewer pixels than min_area is zeroed out. "
        "The main large region is kept exactly as-is."
    )

    def filter_regions(self, mask: torch.Tensor, min_area: int, threshold: float):
        if mask.ndim == 2:
            mask = mask.unsqueeze(0)

        B, H, W = mask.shape
        out = []

        for i in range(B):
            frame = mask[i].cpu().numpy()
            binary = (frame >= threshold).astype(np.uint8)

            labeled, n_components = scipy.ndimage.label(binary)

            cleaned = np.zeros((H, W), dtype=np.float32)
            for comp_id in range(1, n_components + 1):
                region = labeled == comp_id
                if region.sum() >= min_area:
                    cleaned[region] = frame[region]

            out.append(torch.from_numpy(cleaned))

        return (torch.stack(out),)


NODE_CLASS_MAPPINGS = {
    "MaskRemoveSmallRegions": MaskRemoveSmallRegions,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "MaskRemoveSmallRegions": "Mask Remove Small Regions",
}

print("[mask_small_region_filter] Registered: MaskRemoveSmallRegions")
