"""
NTSC-RS Effect node — applies NTSC/VHS analog video effects powered by ntsc-rs.

On first use this node downloads ntsc-rs-cli.exe (and its GStreamer DLLs) from
the latest GitHub release and caches them in the `bin/` subdirectory next to
this file. Requires Windows and an internet connection on first run.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import urllib.request
import zipfile
from io import BytesIO
from pathlib import Path

import numpy as np
import torch
from PIL import Image as PILImage

BINARY_DIR = Path(__file__).parent / "bin"
CLI_EXE = BINARY_DIR / "ntsc-rs-cli.exe"

GITHUB_API = "https://api.github.com/repos/ntsc-rs/ntsc-rs/releases/latest"

# --------------------------------------------------------------------- #
#  Enum value tables (matches ntsc-rs standard.rs order, 0-indexed)     #
# --------------------------------------------------------------------- #

USE_FIELD = {
    "Alternating": 0,
    "Upper": 1,
    "Lower": 2,
    "Both": 3,
    "InterleavedUpper": 4,
    "InterleavedLower": 5,
}

VHS_TAPE_SPEED = {
    "NONE": 0,
    "SP": 1,
    "LP": 2,
    "EP": 3,
}

CHROMA_LOWPASS = {
    "None": 0,
    "Light": 1,
    "Full": 2,
}

CHROMA_DEMODULATION = {
    "Box": 0,
    "Notch": 1,
    "OneLineComb": 2,
    "TwoLineComb": 3,
}

LUMA_LOWPASS = {
    "None": 0,
    "Box": 1,
    "Notch": 2,
}

FILTER_TYPE = {
    "ConstantK": 0,
    "Butterworth": 1,
}

# ------------------------------------------------------------------ #
#  Binary downloader                                                   #
# ------------------------------------------------------------------ #

def _ensure_binary() -> None:
    if CLI_EXE.exists():
        return

    if sys.platform != "win32":
        raise RuntimeError(
            "[NtscRs] ntsc-rs-cli.exe is only available on Windows. "
            "This node cannot run on the current platform."
        )

    BINARY_DIR.mkdir(parents=True, exist_ok=True)
    print("[NtscRs] ntsc-rs-cli.exe not found — downloading from GitHub releases...")

    req = urllib.request.Request(GITHUB_API, headers={"User-Agent": "ComfyUI-NtscRs/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        release = json.loads(resp.read())

    asset_url = next(
        (a["browser_download_url"] for a in release.get("assets", [])
         if "windows-standalone" in a["name"]),
        None,
    )
    if asset_url is None:
        raise RuntimeError(
            "[NtscRs] Could not find 'windows-standalone' asset in the latest release. "
            f"Release tag: {release.get('tag_name', 'unknown')}"
        )

    print(f"[NtscRs] Downloading {asset_url} ...")
    req = urllib.request.Request(asset_url, headers={"User-Agent": "ComfyUI-NtscRs/1.0"})
    with urllib.request.urlopen(req, timeout=300) as resp:
        data = resp.read()

    n_extracted = 0
    with zipfile.ZipFile(BytesIO(data)) as zf:
        for name in zf.namelist():
            basename = Path(name).name
            if not basename:
                continue
            if basename.lower().endswith((".exe", ".dll")):
                dest = BINARY_DIR / basename
                with zf.open(name) as src, open(dest, "wb") as dst:
                    dst.write(src.read())
                n_extracted += 1

    print(f"[NtscRs] Extracted {n_extracted} files to {BINARY_DIR}")

    if not CLI_EXE.exists():
        raise RuntimeError(
            f"[NtscRs] ntsc-rs-cli.exe was not found in the zip archive. "
            f"Files extracted to {BINARY_DIR}."
        )
    print(f"[NtscRs] Ready — {CLI_EXE}")
    print("[NtscRs] First run will be slower (~30s) while GStreamer builds its plugin registry.")


# ------------------------------------------------------------------ #
#  Settings JSON builder                                               #
# ------------------------------------------------------------------ #

def _build_settings_json(
    random_seed: int,
    use_field: str,
    luma_smear: float,
    composite_sharpening: float,
    chroma_lowpass_in: str,
    chroma_lowpass_out: str,
    chroma_demodulation: str,
    input_luma_filter: str,
    filter_type: str,
    snow_intensity: float,
    snow_anisotropy: float,
    chroma_phase_noise: float,
    chroma_phase_error: float,
    chroma_delay_h: float,
    chroma_delay_v: int,
    chroma_vert_blend: bool,
    head_switching: bool,
    head_switching_height: int,
    head_switching_offset: int,
    head_switching_horiz_shift: float,
    tracking_noise: bool,
    tracking_noise_height: int,
    tracking_noise_wave_intensity: float,
    ringing: bool,
    ringing_frequency: float,
    ringing_power: float,
    ringing_intensity: float,
    vhs_enabled: bool,
    vhs_tape_speed: str,
    vhs_chroma_loss: float,
    vhs_sharpen_enabled: bool,
    vhs_sharpen_intensity: float,
    vhs_edge_wave_enabled: bool,
    vhs_edge_wave_intensity: float,
    vhs_edge_wave_speed: float,
) -> str:
    s: dict = {
        "version": 1,
        # Core
        "random_seed": random_seed,
        "use_field": USE_FIELD[use_field],
        "filter_type": FILTER_TYPE[filter_type],
        "input_luma_filter": LUMA_LOWPASS[input_luma_filter],
        "chroma_lowpass_in": CHROMA_LOWPASS[chroma_lowpass_in],
        "chroma_demodulation": CHROMA_DEMODULATION[chroma_demodulation],
        "luma_smear": luma_smear,
        "composite_preemphasis": composite_sharpening,
        "video_scanline_phase_shift": 2,   # Degrees180 default
        "video_scanline_phase_shift_offset": 0,
        # Snow
        "snow_intensity": snow_intensity,
        "snow_anisotropy": snow_anisotropy,
        # Chroma
        "chroma_phase_noise_intensity": chroma_phase_noise,
        "chroma_phase_error": chroma_phase_error,
        "chroma_delay_horizontal": chroma_delay_h,
        "chroma_delay_vertical": chroma_delay_v,
        "vhs_chroma_vert_blend": chroma_vert_blend,
        "chroma_lowpass_out": CHROMA_LOWPASS[chroma_lowpass_out],
        # Head switching
        "head_switching": head_switching,
        "head_switching_height": head_switching_height,
        "head_switching_offset": head_switching_offset,
        "head_switching_horizontal_shift": head_switching_horiz_shift,
        "head_switching_start_mid_line": False,
        "head_switching_mid_line_position": 0.95,
        "head_switching_mid_line_jitter": 0.03,
        # Tracking noise
        "tracking_noise": tracking_noise,
        "tracking_noise_height": tracking_noise_height,
        "tracking_noise_wave_intensity": tracking_noise_wave_intensity,
        "tracking_noise_snow_intensity": 0.025,
        "tracking_noise_snow_anisotropy": 0.25,
        "tracking_noise_noise_intensity": 0.25,
        # Ringing
        "ringing": ringing,
        "ringing_frequency": ringing_frequency,
        "ringing_power": ringing_power,
        "ringing_scale": ringing_intensity,
        # Noise layers (disabled; users can enable via JSON override)
        "composite_noise": False,
        "composite_noise_intensity": 0.02,
        "composite_noise_frequency": 0.5,
        "composite_noise_detail": 1,
        "luma_noise": False,
        "luma_noise_intensity": 0.02,
        "luma_noise_frequency": 0.5,
        "luma_noise_detail": 1,
        "chroma_noise": False,
        "chroma_noise_intensity": 0.04,
        "chroma_noise_frequency": 0.05,
        "chroma_noise_detail": 1,
        # VHS
        "vhs_settings": vhs_enabled,
        "vhs_tape_speed": VHS_TAPE_SPEED[vhs_tape_speed],
        "vhs_chroma_loss": vhs_chroma_loss,
        "vhs_sharpen_enabled": vhs_sharpen_enabled,
        "vhs_sharpen": vhs_sharpen_intensity,
        "vhs_sharpen_frequency": 1.0,
        "vhs_edge_wave_enabled": vhs_edge_wave_enabled,
        "vhs_edge_wave": vhs_edge_wave_intensity,
        "vhs_edge_wave_speed": vhs_edge_wave_speed,
        "vhs_edge_wave_frequency": 0.05,
        "vhs_edge_wave_detail": 2,
        # Scale (passthrough)
        "scale_settings": False,
        "bandwidth_scale": 1.0,
        "vertical_scale": 1.0,
        "scale_with_video_size": False,
    }
    return json.dumps(s)


# ------------------------------------------------------------------ #
#  GStreamer environment helper                                         #
# ------------------------------------------------------------------ #

def _make_gst_env() -> dict:
    """Build an environment dict with GStreamer pointed at our bundled plugins."""
    env = os.environ.copy()
    bin_str = str(BINARY_DIR)
    env["GST_PLUGIN_PATH"] = bin_str
    env["GST_PLUGIN_PATH_1_0"] = bin_str
    # Local registry avoids APPDATA permission issues and stale system caches.
    reg = str(BINARY_DIR / "registry.bin")
    env["GST_REGISTRY"] = reg
    env["GST_REGISTRY_1_0"] = reg
    # Prevent scanning system-level plugin paths which may have version conflicts.
    env["GST_PLUGIN_SYSTEM_PATH"] = ""
    env["GST_PLUGIN_SYSTEM_PATH_1_0"] = ""
    # DLLs must be locatable; put bin/ first.
    env["PATH"] = bin_str + os.pathsep + env.get("PATH", "")
    return env


def _run_cli(cmd: list, timeout: int = 300) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd,
        cwd=str(BINARY_DIR),
        env=_make_gst_env(),
        capture_output=True,
        text=True,
        timeout=timeout,
    )


# ------------------------------------------------------------------ #
#  Processors                                                          #
# ------------------------------------------------------------------ #

def _read_png_sequence(tmpdir: Path, stem: str, expected: int) -> list[torch.Tensor]:
    """Read back a PNG sequence written by ntsc-rs (#### zero-padded, 0- or 1-indexed)."""
    import glob as _glob
    files = sorted(_glob.glob(str(tmpdir / f"{stem}_*.png")))
    if not files:
        raise RuntimeError(f"[NtscRs] No output PNGs found matching {stem}_*.png in {tmpdir}")
    frames = []
    for p in files[:expected]:
        arr = np.array(PILImage.open(p).convert("RGB")).astype(np.float32) / 255.0
        frames.append(torch.from_numpy(arr))
    return frames


def _write_settings_file(tmpdir: Path, settings_json: str) -> Path:
    """Write settings JSON to a temp file and return its path.

    Using --settings-path avoids Windows command-line argument quoting issues
    that silently mangle JSON passed via -j (curly braces, double quotes, colons
    all interact badly with Windows CreateProcess argument escaping).
    """
    p = tmpdir / "settings.json"
    p.write_text(settings_json, encoding="utf-8")
    return p


def _process_batch(frames: torch.Tensor, settings_json: str) -> torch.Tensor:
    """Process an entire batch (BHWC float32) in a single ntsc-rs-cli invocation."""
    import cv2

    np_frames = (frames.cpu().numpy() * 255.0).clip(0, 255).astype(np.uint8)
    B, H, W = np_frames.shape[:3]

    # MJPEG requires even dimensions.
    W_enc = W if W % 2 == 0 else W - 1
    H_enc = H if H % 2 == 0 else H - 1
    if W_enc != W or H_enc != H:
        np_frames = np_frames[:, :H_enc, :W_enc, :]

    with tempfile.TemporaryDirectory() as _tmp:
        tmpdir = Path(_tmp)
        avi_path = tmpdir / "input.avi"
        out_pattern = str(tmpdir / "out_####.png")
        settings_path = _write_settings_file(tmpdir, settings_json)

        # Write MJPEG AVI — quality 98 ~= visually lossless; any residual
        # compression artefacts are completely swamped by the NTSC effect.
        fourcc = cv2.VideoWriter_fourcc(*"MJPG")
        writer = cv2.VideoWriter(str(avi_path), fourcc, 30.0, (W_enc, H_enc))
        writer.set(cv2.VIDEOWRITER_PROP_QUALITY, 98)
        for f in np_frames:
            writer.write(cv2.cvtColor(f, cv2.COLOR_RGB2BGR))
        writer.release()

        if not avi_path.exists() or avi_path.stat().st_size == 0:
            raise RuntimeError("[NtscRs] cv2 failed to write input AVI (check cv2 installation).")

        cmd = [
            str(CLI_EXE),
            "-i", str(avi_path),
            "-o", out_pattern,
            "--codec", "png",
            "-p", str(settings_path),
            "-y",
        ]
        proc = _run_cli(cmd, timeout=600)

        if proc.returncode != 0:
            raise RuntimeError(
                f"[NtscRs] ntsc-rs-cli exited with code {proc.returncode}.\n"
                f"stderr: {(proc.stderr or '')[:2000]}"
            )

        out_frames = _read_png_sequence(tmpdir, "out", B)

    if not out_frames:
        raise RuntimeError("[NtscRs] ntsc-rs-cli produced no output frames.")
    if len(out_frames) < B:
        print(f"[NtscRs] Warning: expected {B} frames, got {len(out_frames)}")

    result = torch.stack(out_frames[:B])
    if W_enc != W or H_enc != H:
        padded = torch.zeros(B, H, W, result.shape[-1])
        padded[:, :H_enc, :W_enc, :] = result
        result = padded
    return result


def _process_single_frame(frame: torch.Tensor, settings_json: str) -> torch.Tensor:
    """Process one HWC float32 [0,1] frame. Used for single images."""
    np_img = (frame.cpu().numpy() * 255.0).clip(0, 255).astype(np.uint8)
    pil_img = PILImage.fromarray(np_img, mode="RGB")

    with tempfile.TemporaryDirectory() as _tmp:
        tmpdir = Path(_tmp)
        in_path = tmpdir / "in.png"
        out_path = tmpdir / "out.png"
        settings_path = _write_settings_file(tmpdir, settings_json)

        pil_img.save(str(in_path))

        cmd = [
            str(CLI_EXE),
            "-i", str(in_path),
            "-o", str(out_path),
            "--codec", "png",
            "--single-frame-time", "00:00.000",
            "-p", str(settings_path),
            "-y",
        ]
        proc = _run_cli(cmd, timeout=120)

        if proc.returncode != 0:
            raise RuntimeError(
                f"[NtscRs] ntsc-rs-cli exited with code {proc.returncode}.\n"
                f"stderr: {(proc.stderr or '')[:1000]}"
            )
        if not out_path.exists():
            raise RuntimeError(
                f"[NtscRs] ntsc-rs-cli did not produce output.\n"
                f"stderr: {(proc.stderr or '')[:1000]}"
            )

        out_np = np.array(PILImage.open(str(out_path)).convert("RGB")).astype(np.float32) / 255.0
        return torch.from_numpy(out_np)


# ------------------------------------------------------------------ #
#  ComfyUI node                                                        #
# ------------------------------------------------------------------ #

class NtscRsEffect:
    """Apply NTSC/VHS analog video effects to images using ntsc-rs."""

    CATEGORY = "image/effects"
    FUNCTION = "apply_effect"
    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                # ---- Core ----
                "random_seed": ("INT", {
                    "default": 0, "min": -2147483648, "max": 2147483647,
                    "tooltip": "Controls all randomised elements. Same seed produces same result.",
                }),
                "use_field": (list(USE_FIELD.keys()), {
                    "default": "InterleavedUpper",
                    "tooltip": "Which video field(s) to use for the effect.",
                }),
                "luma_smear": ("FLOAT", {
                    "default": 0.5, "min": 0.0, "max": 1.0, "step": 0.01,
                    "tooltip": "Smear (horizontal blur) applied to the luminance signal.",
                }),
                "composite_sharpening": ("FLOAT", {
                    "default": 1.0, "min": -1.0, "max": 2.0, "step": 0.01,
                    "tooltip": "Pre-emphasis on the composite signal. Higher = sharper edges.",
                }),
                # ---- Chroma ----
                "chroma_lowpass_in": (list(CHROMA_LOWPASS.keys()), {
                    "default": "Full",
                    "tooltip": "Input chroma low-pass filter strength.",
                }),
                "chroma_lowpass_out": (list(CHROMA_LOWPASS.keys()), {
                    "default": "Full",
                    "tooltip": "Output chroma low-pass filter strength.",
                }),
                "chroma_demodulation": (list(CHROMA_DEMODULATION.keys()), {
                    "default": "Notch",
                    "tooltip": "Chroma demodulation filter type.",
                }),
                "chroma_phase_noise": ("FLOAT", {
                    "default": 0.0, "min": 0.0, "max": 1.0, "step": 0.001,
                    "tooltip": "Amount of random phase noise on the chroma signal.",
                }),
                "chroma_phase_error": ("FLOAT", {
                    "default": 0.0, "min": 0.0, "max": 1.0, "step": 0.001,
                    "tooltip": "Constant chroma phase error (colour tint shift).",
                }),
                "chroma_delay_h": ("FLOAT", {
                    "default": 0.0, "min": -40.0, "max": 40.0, "step": 0.1,
                    "tooltip": "Horizontal chroma delay in samples (colour misalignment).",
                }),
                "chroma_delay_v": ("INT", {
                    "default": 0, "min": -20, "max": 20,
                    "tooltip": "Vertical chroma delay in lines.",
                }),
                "chroma_vert_blend": ("BOOLEAN", {
                    "default": True,
                    "tooltip": "Blend chroma vertically (VHS-style).",
                }),
                # ---- Snow ----
                "snow_intensity": ("FLOAT", {
                    "default": 0.0, "min": 0.0, "max": 1.0, "step": 0.001,
                    "tooltip": "Intensity of random speckle noise (snow). 0 = none.",
                }),
                "snow_anisotropy": ("FLOAT", {
                    "default": 0.5, "min": 0.0, "max": 1.0, "step": 0.01,
                    "tooltip": "Directionality of snow. 0 = isotropic, 1 = horizontal streaks.",
                }),
                # ---- Luma / filter ----
                "input_luma_filter": (list(LUMA_LOWPASS.keys()), {
                    "default": "Notch",
                    "tooltip": "Low-pass filter applied to the input luma channel.",
                }),
                "filter_type": (list(FILTER_TYPE.keys()), {
                    "default": "Butterworth",
                    "tooltip": "IIR filter shape used internally.",
                }),
                # ---- Head switching ----
                "head_switching": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Simulate VCR head-switching glitch at the bottom of the frame.",
                }),
                "head_switching_height": ("INT", {
                    "default": 8, "min": 0, "max": 24,
                    "tooltip": "Number of scan-lines affected by head switching.",
                }),
                "head_switching_offset": ("INT", {
                    "default": 3, "min": 0, "max": 24,
                    "tooltip": "Vertical offset of the head-switching band.",
                }),
                "head_switching_horiz_shift": ("FLOAT", {
                    "default": 72.0, "min": -100.0, "max": 100.0, "step": 0.5,
                    "tooltip": "Horizontal pixel shift of the head-switching band.",
                }),
                # ---- Tracking noise ----
                "tracking_noise": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Simulate VHS tracking noise band.",
                }),
                "tracking_noise_height": ("INT", {
                    "default": 12, "min": 0, "max": 120,
                    "tooltip": "Height of the tracking noise band in scan-lines.",
                }),
                "tracking_noise_wave_intensity": ("FLOAT", {
                    "default": 15.0, "min": -50.0, "max": 50.0, "step": 0.5,
                    "tooltip": "Horizontal wave displacement in the tracking noise band.",
                }),
                # ---- Ringing ----
                "ringing": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Simulate RF ringing artefacts around high-contrast edges.",
                }),
                "ringing_frequency": ("FLOAT", {
                    "default": 0.45, "min": 0.0, "max": 1.0, "step": 0.01,
                }),
                "ringing_power": ("FLOAT", {
                    "default": 4.0, "min": 1.0, "max": 10.0, "step": 0.1,
                }),
                "ringing_intensity": ("FLOAT", {
                    "default": 4.0, "min": 0.0, "max": 10.0, "step": 0.1,
                }),
                # ---- VHS ----
                "vhs_enabled": ("BOOLEAN", {
                    "default": False,
                    "label_on": "VHS On",
                    "label_off": "VHS Off",
                    "tooltip": "Enable VHS tape-speed simulation.",
                }),
                "vhs_tape_speed": (list(VHS_TAPE_SPEED.keys()), {
                    "default": "LP",
                    "tooltip": "VHS tape speed. NONE=bypass, SP=best quality, LP=standard, EP=worst.",
                }),
                "vhs_chroma_loss": ("FLOAT", {
                    "default": 0.000025, "min": 0.0, "max": 0.01, "step": 0.000001,
                    "tooltip": "Probability of a chroma dropout per pixel.",
                }),
                "vhs_sharpen_enabled": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Enable VHS high-frequency sharpening circuit.",
                }),
                "vhs_sharpen_intensity": ("FLOAT", {
                    "default": 0.25, "min": 0.0, "max": 5.0, "step": 0.05,
                }),
                "vhs_edge_wave_enabled": ("BOOLEAN", {
                    "default": False,
                    "tooltip": "Enable VHS edge-wave distortion.",
                }),
                "vhs_edge_wave_intensity": ("FLOAT", {
                    "default": 0.5, "min": 0.0, "max": 20.0, "step": 0.1,
                }),
                "vhs_edge_wave_speed": ("FLOAT", {
                    "default": 4.0, "min": 0.0, "max": 10.0, "step": 0.1,
                }),
            },
            "optional": {
                "settings_json_override": ("STRING", {
                    "default": "",
                    "multiline": True,
                    "tooltip": (
                        "Paste a full ntsc-rs JSON preset here to override ALL other parameters. "
                        "Must include \"version\": 1. Leave blank to use the controls above."
                    ),
                }),
            },
        }

    def apply_effect(
        self,
        image: torch.Tensor,
        random_seed: int,
        use_field: str,
        luma_smear: float,
        composite_sharpening: float,
        chroma_lowpass_in: str,
        chroma_lowpass_out: str,
        chroma_demodulation: str,
        chroma_phase_noise: float,
        chroma_phase_error: float,
        chroma_delay_h: float,
        chroma_delay_v: int,
        chroma_vert_blend: bool,
        snow_intensity: float,
        snow_anisotropy: float,
        input_luma_filter: str,
        filter_type: str,
        head_switching: bool,
        head_switching_height: int,
        head_switching_offset: int,
        head_switching_horiz_shift: float,
        tracking_noise: bool,
        tracking_noise_height: int,
        tracking_noise_wave_intensity: float,
        ringing: bool,
        ringing_frequency: float,
        ringing_power: float,
        ringing_intensity: float,
        vhs_enabled: bool,
        vhs_tape_speed: str,
        vhs_chroma_loss: float,
        vhs_sharpen_enabled: bool,
        vhs_sharpen_intensity: float,
        vhs_edge_wave_enabled: bool,
        vhs_edge_wave_intensity: float,
        vhs_edge_wave_speed: float,
        settings_json_override: str = "",
    ):
        _ensure_binary()

        if settings_json_override and settings_json_override.strip():
            settings_json = settings_json_override.strip()
        else:
            settings_json = _build_settings_json(
                random_seed=random_seed,
                use_field=use_field,
                luma_smear=luma_smear,
                composite_sharpening=composite_sharpening,
                chroma_lowpass_in=chroma_lowpass_in,
                chroma_lowpass_out=chroma_lowpass_out,
                chroma_demodulation=chroma_demodulation,
                input_luma_filter=input_luma_filter,
                filter_type=filter_type,
                snow_intensity=snow_intensity,
                snow_anisotropy=snow_anisotropy,
                chroma_phase_noise=chroma_phase_noise,
                chroma_phase_error=chroma_phase_error,
                chroma_delay_h=chroma_delay_h,
                chroma_delay_v=chroma_delay_v,
                chroma_vert_blend=chroma_vert_blend,
                head_switching=head_switching,
                head_switching_height=head_switching_height,
                head_switching_offset=head_switching_offset,
                head_switching_horiz_shift=head_switching_horiz_shift,
                tracking_noise=tracking_noise,
                tracking_noise_height=tracking_noise_height,
                tracking_noise_wave_intensity=tracking_noise_wave_intensity,
                ringing=ringing,
                ringing_frequency=ringing_frequency,
                ringing_power=ringing_power,
                ringing_intensity=ringing_intensity,
                vhs_enabled=vhs_enabled,
                vhs_tape_speed=vhs_tape_speed,
                vhs_chroma_loss=vhs_chroma_loss,
                vhs_sharpen_enabled=vhs_sharpen_enabled,
                vhs_sharpen_intensity=vhs_sharpen_intensity,
                vhs_edge_wave_enabled=vhs_edge_wave_enabled,
                vhs_edge_wave_intensity=vhs_edge_wave_intensity,
                vhs_edge_wave_speed=vhs_edge_wave_speed,
            )

        # Batch path: one CLI invocation for the whole video (fast).
        # Single-image path: per-frame (no video container needed).
        if image.shape[0] > 1:
            try:
                import cv2  # noqa: F401
                result = _process_batch(image, settings_json)
            except ImportError:
                print("[NtscRs] cv2 not available — falling back to per-frame processing")
                result = torch.stack(
                    [_process_single_frame(image[i], settings_json) for i in range(image.shape[0])]
                )
        else:
            result = _process_single_frame(image[0], settings_json).unsqueeze(0)

        return (result,)


# ------------------------------------------------------------------ #
#  Registration                                                        #
# ------------------------------------------------------------------ #

NODE_CLASS_MAPPINGS = {
    "NtscRsEffect": NtscRsEffect,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "NtscRsEffect": "NTSC-RS Effect",
}
