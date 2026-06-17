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
                               "Used for both the start and end of the batch.",
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

        # Find first stable frame (forward scan)
        anchor_start = None
        for i in range(B):
            if mask[i].sum().item() >= min_area:
                anchor_start = i
                break

        # No stable frame at all — return unchanged
        if anchor_start is None:
            return (mask,)

        # Find last stable frame (backward scan)
        anchor_end = None
        for i in range(B - 1, -1, -1):
            if mask[i].sum().item() >= min_area:
                anchor_end = i
                break

        out = mask.clone()

        # Backfill beginning: copy anchor_start mask to all frames before it
        if anchor_start > 0:
            out[:anchor_start] = mask[anchor_start].unsqueeze(0).expand(anchor_start, -1, -1)

        # Forward-fill end: copy anchor_end mask to all frames after it
        if anchor_end is not None and anchor_end < B - 1:
            tail = B - anchor_end - 1
            out[anchor_end + 1:] = mask[anchor_end].unsqueeze(0).expand(tail, -1, -1)

        return (out,)


NODE_CLASS_MAPPINGS = {"MaskHoldUntilStable": MaskHoldUntilStable}
NODE_DISPLAY_NAME_MAPPINGS = {"MaskHoldUntilStable": "Mask Hold Until Stable"}
