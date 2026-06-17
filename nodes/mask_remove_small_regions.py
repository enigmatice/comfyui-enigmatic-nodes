import torch
import numpy as np
import scipy.ndimage


class MaskRemoveSmallRegions:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "mask": ("MASK",),
                "min_area": ("INT", {"default": 500, "min": 1, "max": 500000, "step": 10}),
                "threshold": ("FLOAT", {"default": 0.5, "min": 0.01, "max": 1.0, "step": 0.01}),
            }
        }

    RETURN_TYPES = ("MASK",)
    RETURN_NAMES = ("mask",)
    FUNCTION = "filter_regions"
    CATEGORY = "masking"

    def filter_regions(self, mask, min_area, threshold):
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


NODE_CLASS_MAPPINGS = {"MaskRemoveSmallRegions": MaskRemoveSmallRegions}
NODE_DISPLAY_NAME_MAPPINGS = {"MaskRemoveSmallRegions": "Mask Remove Small Regions"}
