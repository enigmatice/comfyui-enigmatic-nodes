import math


ASPECT_RATIOS = {
    "1:1":  (1, 1),
    "16:9": (16, 9),
    "9:16": (9, 16),
}


class VideoResolutionPicker:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "aspect_ratio": (list(ASPECT_RATIOS.keys()), {"default": "16:9"}),
                "longest_side": ("INT", {
                    "default": 1280, "min": 64, "max": 8192, "step": 8,
                    "tooltip": "The longer dimension. The shorter side is calculated automatically.",
                }),
            }
        }

    RETURN_TYPES = ("INT", "INT", "STRING")
    RETURN_NAMES = ("width", "height", "label")
    FUNCTION = "pick"
    CATEGORY = "enigmatic"

    def pick(self, aspect_ratio, longest_side):
        w_ratio, h_ratio = ASPECT_RATIOS[aspect_ratio]

        if w_ratio >= h_ratio:
            width = longest_side
            height = math.floor(longest_side * h_ratio / w_ratio / 8) * 8
        else:
            height = longest_side
            width = math.floor(longest_side * w_ratio / h_ratio / 8) * 8

        label = f"{width} x {height}  ({aspect_ratio})"
        return (width, height, label)


NODE_CLASS_MAPPINGS = {"VideoResolutionPicker": VideoResolutionPicker}
NODE_DISPLAY_NAME_MAPPINGS = {"VideoResolutionPicker": "Video Resolution Picker"}
