import torch


class MaskHoldUntilStable:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "mask": ("MASK",),
                "min_area": ("INT", {
                    "default": 500, "min": 1, "max": 500000, "step": 10,
                    "tooltip": "Minimum mask area for the START anchor. "
                               "Raise this to wait for a larger masked region before locking. "
                               "In peak mode this is a noise floor; the largest frame above it is used.",
                }),
                "min_area_end": ("INT", {
                    "default": 500, "min": 1, "max": 500000, "step": 10,
                    "tooltip": "Minimum mask area for the END anchor. "
                               "Keep this low to hold until the masked region has nearly disappeared. "
                               "Independent of min_area so start and end can be tuned separately.",
                }),
                "peak_mode": ("BOOLEAN", {
                    "default": False,
                    "label_on": "Peak (largest frame)",
                    "label_off": "First stable frame",
                    "tooltip": "Off: lock start to the first frame that crosses min_area. "
                               "On: lock start to the frame with the biggest mask in the whole batch.",
                }),
                "hold_start": ("BOOLEAN", {
                    "default": True,
                    "label_on": "Hold start",
                    "label_off": "Start: pass through",
                    "tooltip": "Backfill all frames before the anchor with the anchor mask.",
                }),
                "hold_end": ("BOOLEAN", {
                    "default": True,
                    "label_on": "Hold end",
                    "label_off": "End: pass through",
                    "tooltip": "Forward-fill all frames after the last stable frame with that frame's mask.",
                }),
            }
        }

    RETURN_TYPES = ("MASK",)
    RETURN_NAMES = ("mask",)
    FUNCTION = "hold"
    CATEGORY = "enigmatic"

    def hold(self, mask, min_area, min_area_end, peak_mode, hold_start, hold_end):
        if mask.ndim == 2:
            mask = mask.unsqueeze(0)

        B = mask.shape[0]
        areas = [mask[i].sum().item() for i in range(B)]

        if peak_mode:
            # Use the frame with the largest mask area (above min_area)
            best_area = -1
            anchor_start = None
            for i, a in enumerate(areas):
                if a >= min_area and a > best_area:
                    best_area = a
                    anchor_start = i
        else:
            # Use the first frame that crosses min_area
            anchor_start = None
            for i, a in enumerate(areas):
                if a >= min_area:
                    anchor_start = i
                    break

        # No qualifying frame found — return unchanged
        if anchor_start is None:
            return (mask,)

        # Find last stable frame using independent end threshold (backward scan)
        anchor_end = None
        for i in range(B - 1, -1, -1):
            if areas[i] >= min_area_end:
                anchor_end = i
                break

        out = mask.clone()

        # Backfill beginning: copy anchor_start mask to all frames before it
        if hold_start and anchor_start > 0:
            out[:anchor_start] = mask[anchor_start].unsqueeze(0).expand(anchor_start, -1, -1)

        # Forward-fill end: copy anchor_end mask to all frames after it
        if hold_end and anchor_end is not None and anchor_end < B - 1:
            tail = B - anchor_end - 1
            out[anchor_end + 1:] = mask[anchor_end].unsqueeze(0).expand(tail, -1, -1)

        return (out,)


NODE_CLASS_MAPPINGS = {"MaskHoldUntilStable": MaskHoldUntilStable}
NODE_DISPLAY_NAME_MAPPINGS = {"MaskHoldUntilStable": "Mask Hold Until Stable"}
