import torch


class MaskHoldUntilStable:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "mask": ("MASK",),
                "min_area": ("INT", {
                    "default": 500, "min": 1, "max": 500000, "step": 10,
                    "tooltip": "Minimum pixel area that counts as a stable mask. "
                               "The first frame that meets this threshold becomes the anchor.",
                }),
            }
        }

    RETURN_TYPES = ("MASK",)
    RETURN_NAMES = ("mask",)
    FUNCTION = "hold"
    CATEGORY = "enigmatic"

    def hold(self, mask, min_area):
        if mask.ndim == 2:
            mask = mask.unsqueeze(0)

        B = mask.shape[0]

        # Find the first frame whose white pixel count >= min_area
        anchor_idx = None
        for i in range(B):
            if mask[i].sum().item() >= min_area:
                anchor_idx = i
                break

        # No stable frame found — return mask unchanged
        if anchor_idx is None:
            return (mask,)

        # Replace all frames before the anchor with the anchor frame
        if anchor_idx > 0:
            out = mask.clone()
            out[:anchor_idx] = mask[anchor_idx].unsqueeze(0).expand(anchor_idx, -1, -1)
            return (out,)

        return (mask,)


NODE_CLASS_MAPPINGS = {"MaskHoldUntilStable": MaskHoldUntilStable}
NODE_DISPLAY_NAME_MAPPINGS = {"MaskHoldUntilStable": "Mask Hold Until Stable"}
