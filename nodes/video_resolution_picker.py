import math


ASPECT_RATIOS = {
    "1:1":  (1, 1),
    "16:9": (16, 9),
    "9:16": (9, 16),
}

BASE_SIZES = ["320", "480", "512", "576", "640", "720", "768", "1080", "1440"]


class VideoResolutionPicker:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "aspect_ratio": (list(ASPECT_RATIOS.keys()), {"default": "16:9"}),
                "base_size": (BASE_SIZES, {"default": "720"}),
                "multiple_of": ("INT", {
                    "default": 8, "min": 1, "max": 64, "step": 1,
                    "tooltip": "Round dimensions to a multiple of this. Use 8 for most models, 16 for stricter ones.",
                }),
            }
        }

    RETURN_TYPES = ("INT", "INT", "STRING")
    RETURN_NAMES = ("width", "height", "label")
    FUNCTION = "pick"
    CATEGORY = "utils"

    def pick(self, aspect_ratio, base_size, multiple_of):
        w_ratio, h_ratio = ASPECT_RATIOS[aspect_ratio]
        size = int(base_size)
        m = max(1, multiple_of)

        if w_ratio >= h_ratio:
            # landscape or square: base_size is the height (shorter side)
            height = size
            width = math.floor(size * w_ratio / h_ratio / m) * m
        else:
            # portrait: base_size is the width (shorter side)
            width = size
            height = math.floor(size * h_ratio / w_ratio / m) * m

        label = f"{width} x {height}  ({aspect_ratio})"
        return (width, height, label)


NODE_CLASS_MAPPINGS = {"VideoResolutionPicker": VideoResolutionPicker}
NODE_DISPLAY_NAME_MAPPINGS = {"VideoResolutionPicker": "Video Resolution Picker"}
