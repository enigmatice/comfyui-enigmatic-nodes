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
                "multiple_of": ("INT", {
                    "default": 8, "min": 1, "max": 64, "step": 1,
                    "tooltip": "Round both dimensions to a multiple of this. Use 8 for most models, 16 for stricter ones.",
                }),
            }
        }

    RETURN_TYPES = ("INT", "INT", "STRING")
    RETURN_NAMES = ("width", "height", "label")
    FUNCTION = "pick"
    CATEGORY = "utils"

    def pick(self, aspect_ratio, longest_side, multiple_of):
        w_ratio, h_ratio = ASPECT_RATIOS[aspect_ratio]
        m = max(1, multiple_of)

        if w_ratio >= h_ratio:
            # landscape or square: longest side is width
            width = longest_side
            height = math.floor(longest_side * h_ratio / w_ratio / m) * m
        else:
            # portrait: longest side is height
            height = longest_side
            width = math.floor(longest_side * w_ratio / h_ratio / m) * m

        label = f"{width} x {height}  ({aspect_ratio})"
        return (width, height, label)


NODE_CLASS_MAPPINGS = {"VideoResolutionPicker": VideoResolutionPicker}
NODE_DISPLAY_NAME_MAPPINGS = {"VideoResolutionPicker": "Video Resolution Picker"}
