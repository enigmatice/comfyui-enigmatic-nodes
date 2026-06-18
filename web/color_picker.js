import { app } from "/scripts/app.js";

// ─── Themes ───────────────────────────────────────────────────────────────────

const THEMES = [
    // ── Muted / deep ─────────────────────────────────────────────────────────
    { name: "Ocean",    header: "#1e4d73", body: "#0d2035", groupColor: "#285f90" },
    { name: "Forest",   header: "#1e5234", body: "#0d2418", groupColor: "#256640" },
    { name: "Dusk",     header: "#421e6b", body: "#200d33", groupColor: "#532585" },
    { name: "Ember",    header: "#6b300e", body: "#301607", groupColor: "#863c14" },
    { name: "Rosewood", header: "#6b1e38", body: "#300d1a", groupColor: "#862545" },
    { name: "Slate",    header: "#2c404f", body: "#141d23", groupColor: "#374f62" },
    { name: "Sage",     header: "#2c5040", body: "#14231c", groupColor: "#37634f" },
    { name: "Amber",    header: "#5c3d0e", body: "#2a1c07", groupColor: "#734c14" },
    { name: "Midnight", header: "#1c1c3e", body: "#0d0d1e", groupColor: "#25254e" },
    { name: "Mauve",    header: "#4c2840", body: "#23121e", groupColor: "#5f3250" },
    { name: "Storm",    header: "#2c3d52", body: "#131a22", groupColor: "#374c66" },
    { name: "Rust",     header: "#5c2a1c", body: "#2a120d", groupColor: "#733426" },
    // ── Vibrant ───────────────────────────────────────────────────────────────
    { name: "Cobalt",   header: "#1a5fb5", body: "#0c2a52", groupColor: "#2271d4" },
    { name: "Jade",     header: "#107360", body: "#063028", groupColor: "#158f78" },
    { name: "Violet",   header: "#6d21b8", body: "#2f0e52", groupColor: "#8328e0" },
    { name: "Crimson",  header: "#991520", body: "#40090e", groupColor: "#be1a28" },
    { name: "Teal",     header: "#0d7a8a", body: "#05363e", groupColor: "#1096a8" },
    { name: "Coral",    header: "#c03d12", body: "#521a08", groupColor: "#e04c18" },
    { name: "Plum",     header: "#7e1a90", body: "#360a3e", groupColor: "#9c20b2" },
    { name: "Royal",    header: "#1e44b8", body: "#0d1e52", groupColor: "#2455e0" },
    { name: "Pine",     header: "#16693c", body: "#0a2e1a", groupColor: "#1c824b" },
    { name: "Indigo",   header: "#3a2ea8", body: "#181450", groupColor: "#4839d0" },
    { name: "Garnet",   header: "#8b1a2f", body: "#3d0b15", groupColor: "#ae203b" },
    { name: "Copper",   header: "#a04a14", body: "#461f08", groupColor: "#c45c1a" },
];

// ─── Redraw ───────────────────────────────────────────────────────────────────

function redraw() {
    try { app.canvas.setDirtyCanvas(true, true); } catch (_) {}
    try { app.graph.change(); } catch (_) {}
    requestAnimationFrame(() => {
        try { app.canvas.setDirtyCanvas(true, true); } catch (_) {}
    });
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function toHex(color) {
    if (!color) return "#353550";
    if (/^#[0-9a-f]{6}$/i.test(color)) return color;
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = color;  ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return "#" + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, "0")).join("");
}

function makeColorRow(label, initHex) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:8px;margin-bottom:10px;";
    const lbl   = Object.assign(document.createElement("label"), { textContent: label });
    lbl.style.cssText = "flex:1;font-size:13px;";
    const swatch = document.createElement("input");
    swatch.type = "color"; swatch.value = initHex;
    swatch.style.cssText = "width:36px;height:28px;padding:1px;border:1px solid #555;border-radius:3px;cursor:pointer;background:none;";
    const hex = document.createElement("input");
    hex.type = "text"; hex.value = initHex; hex.maxLength = 7; hex.placeholder = "#rrggbb";
    hex.style.cssText = "width:80px;background:#2a2a3a;border:1px solid #555;color:#ddd;padding:4px 6px;border-radius:4px;font-size:12px;font-family:monospace;";
    swatch.addEventListener("input", () => { hex.value = swatch.value; });
    hex.addEventListener("input",   () => { if (/^#[0-9a-f]{6}$/i.test(hex.value)) swatch.value = hex.value; });
    row.append(lbl, swatch, hex);
    return { row, get: () => swatch.value };
}

// ─── Dialog helpers ───────────────────────────────────────────────────────────

function closeDialog() {
    document.getElementById("enigmatic-color-dialog")?.remove();
    document.getElementById("enigmatic-color-backdrop")?.remove();
}

function openDialog(buildFn) {
    closeDialog();
    const backdrop = document.createElement("div");
    backdrop.id = "enigmatic-color-backdrop";
    backdrop.style.cssText = "position:fixed;inset:0;z-index:99998;";
    backdrop.onclick = closeDialog;

    const dialog = document.createElement("div");
    dialog.id = "enigmatic-color-dialog";
    dialog.onclick = e => e.stopPropagation();
    document.body.append(backdrop, dialog);

    buildFn(dialog);

    const onKey = e => { if (e.key === "Escape") { closeDialog(); document.removeEventListener("keydown", onKey); } };
    document.addEventListener("keydown", onKey);
}

// ─── Custom color dialog ──────────────────────────────────────────────────────

function showCustomColorDialog(title, fields, onApply, onReset) {
    openDialog(dialog => {
        dialog.style.cssText =
            "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
            "background:#1e1e2e;border:1px solid #444;border-radius:8px;" +
            "padding:18px 20px;z-index:99999;box-shadow:0 6px 32px rgba(0,0,0,0.6);" +
            "min-width:270px;font-family:sans-serif;color:#ccc;";

        const titleEl = Object.assign(document.createElement("div"), { textContent: title });
        titleEl.style.cssText = "font-weight:600;font-size:14px;margin-bottom:14px;color:#fff;";
        dialog.appendChild(titleEl);

        const rows = fields.map(({ label, value }) => {
            const { row, get } = makeColorRow(label, toHex(value));
            dialog.appendChild(row);
            return get;
        });

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex;gap:8px;margin-top:14px;align-items:center;";

        if (onReset) {
            const b = Object.assign(document.createElement("button"), { textContent: "Reset Default" });
            b.style.cssText = "padding:6px 12px;background:transparent;border:1px solid #555;color:#888;border-radius:4px;cursor:pointer;font-size:12px;";
            b.onclick = () => { onReset(); closeDialog(); redraw(); };
            btnRow.appendChild(b);
        }
        const spacer = document.createElement("div"); spacer.style.flex = "1";
        const cancelBtn = Object.assign(document.createElement("button"), { textContent: "Cancel" });
        cancelBtn.style.cssText = "padding:6px 14px;background:#333;border:1px solid #555;color:#ccc;border-radius:4px;cursor:pointer;font-size:13px;";
        cancelBtn.onclick = closeDialog;
        const applyBtn = Object.assign(document.createElement("button"), { textContent: "Apply" });
        applyBtn.style.cssText = "padding:6px 14px;background:#4a7ecc;border:none;color:#fff;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;";
        applyBtn.onclick = () => { onApply(rows.map(fn => fn())); closeDialog(); redraw(); };

        btnRow.append(spacer, cancelBtn, applyBtn);
        dialog.appendChild(btnRow);
    });
}

// ─── Theme picker dialog ──────────────────────────────────────────────────────

function showThemeDialog(nodes, group) {
    const hasNodes = nodes.length > 0;
    const hasGroup = !!group;
    if (!hasNodes && !hasGroup) return;

    // Default to "nodes" when nodes are selected so we don't accidentally recolor
    // a group just because it happens to contain the selected nodes.
    // The user can switch to "Nodes + Group" explicitly if they want both.
    let mode = hasNodes ? "nodes" : "group";

    openDialog(dialog => {
        dialog.style.cssText =
            "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
            "background:#16162a;border:1px solid #3a3a5a;border-radius:10px;" +
            "padding:20px;z-index:99999;box-shadow:0 8px 40px rgba(0,0,0,0.7);" +
            "width:500px;font-family:sans-serif;color:#ccc;";

        // ── Title ──
        const titleEl = Object.assign(document.createElement("div"), { textContent: "Color Themes" });
        titleEl.style.cssText = "font-weight:600;font-size:15px;color:#fff;margin-bottom:12px;";
        dialog.appendChild(titleEl);

        // ── Mode picker (only shown when both nodes and group are present) ──
        let modeButtons = {};
        if (hasNodes && hasGroup) {
            const modeRow = document.createElement("div");
            modeRow.style.cssText =
                "display:flex;gap:6px;margin-bottom:14px;background:#0e0e1e;" +
                "border:1px solid #2a2a4a;border-radius:8px;padding:4px;";

            const modeDefs = [
                ["nodes", `Nodes (${nodes.length})`],
                ["group", "Group"],
                ["both",  "Nodes + Group"],
            ];

            const activateMode = (m) => {
                mode = m;
                Object.entries(modeButtons).forEach(([k, btn]) => {
                    btn.style.background = k === m ? "#3a3acc" : "transparent";
                    btn.style.color      = k === m ? "#fff"    : "#888";
                });
                refreshGrid();
            };

            modeDefs.forEach(([m, label]) => {
                const btn = document.createElement("button");
                btn.textContent = label;
                btn.style.cssText =
                    "flex:1;padding:5px 8px;border:none;border-radius:5px;cursor:pointer;" +
                    "font-size:12px;font-weight:500;transition:background 0.12s,color 0.12s;" +
                    `background:${m === mode ? "#3a3acc" : "transparent"};` +
                    `color:${m === mode ? "#fff" : "#888"};`;
                btn.onclick = () => activateMode(m);
                modeRow.appendChild(btn);
                modeButtons[m] = btn;
            });
            dialog.appendChild(modeRow);
        }

        // ── Theme grid ──
        const grid = document.createElement("div");
        grid.style.cssText = "display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:16px;";
        dialog.appendChild(grid);

        function buildCard(theme) {
            const card = document.createElement("div");
            card.style.cssText =
                "display:flex;align-items:center;gap:8px;padding:7px 9px;" +
                "border-radius:7px;cursor:pointer;border:1px solid #2a2a4a;background:#1e1e3a;" +
                "transition:border-color 0.12s,background 0.12s;";
            card.addEventListener("mouseenter", () => { card.style.borderColor="#6060cc"; card.style.background="#252550"; });
            card.addEventListener("mouseleave", () => { card.style.borderColor="#2a2a4a"; card.style.background="#1e1e3a"; });

            // Preview swatch(es)
            const swatches = document.createElement("div");
            swatches.style.cssText = "display:flex;gap:2px;flex-shrink:0;";

            if (mode !== "group") {
                const nodePreview = document.createElement("div");
                nodePreview.style.cssText = "width:18px;height:30px;border-radius:3px;overflow:hidden;border:1px solid #3a3a5a;display:flex;flex-direction:column;";
                const hdrEl  = document.createElement("div"); hdrEl.style.cssText  = `background:${theme.header};height:9px;`;
                const bodyEl = document.createElement("div"); bodyEl.style.cssText = `background:${theme.body};flex:1;`;
                nodePreview.append(hdrEl, bodyEl);
                swatches.appendChild(nodePreview);
            }

            if (mode !== "nodes") {
                const gColor = mode === "both" ? theme.groupColor : theme.header;
                const groupSwatch = document.createElement("div");
                groupSwatch.style.cssText = `width:10px;height:30px;border-radius:3px;background:${gColor};border:1px solid #3a3a5a;flex-shrink:0;`;
                swatches.appendChild(groupSwatch);
            }

            const nameEl = Object.assign(document.createElement("div"), { textContent: theme.name });
            nameEl.style.cssText = "font-size:11px;color:#ccc;font-weight:500;";

            card.append(swatches, nameEl);
            card.addEventListener("click", () => {
                if (mode !== "group" && hasNodes) {
                    nodes.forEach(n => { n.color = theme.header; n.bgcolor = theme.body; });
                }
                if (mode !== "nodes" && hasGroup) {
                    group.color = mode === "both" ? theme.groupColor : theme.header;
                }
                closeDialog(); redraw();
            });
            return card;
        }

        function refreshGrid() {
            grid.innerHTML = "";
            THEMES.forEach(theme => grid.appendChild(buildCard(theme)));
        }
        refreshGrid();

        // ── Bottom row ──
        const hr = document.createElement("div");
        hr.style.cssText = "height:1px;background:#2a2a4a;margin-bottom:14px;";
        dialog.appendChild(hr);

        const bottom = document.createElement("div");
        bottom.style.cssText = "display:flex;align-items:center;gap:8px;";

        const customBtn = Object.assign(document.createElement("button"), { textContent: "Custom Colors…" });
        customBtn.style.cssText = "padding:6px 14px;background:transparent;border:1px solid #555;color:#aaa;border-radius:6px;cursor:pointer;font-size:12px;";
        customBtn.onclick = () => {
            closeDialog();
            if (mode !== "group" && hasNodes) {
                showCustomColorDialog(
                    nodes.length === 1 ? "Node Color" : `Node Color (${nodes.length} nodes)`,
                    [{ label: "Header", value: nodes[0].color }, { label: "Body", value: nodes[0].bgcolor }],
                    ([color, bgcolor]) => nodes.forEach(n => { n.color = color; n.bgcolor = bgcolor; }),
                    () => nodes.forEach(n => { delete n.color; delete n.bgcolor; })
                );
            } else if (hasGroup) {
                showCustomColorDialog("Group Color",
                    [{ label: "Color", value: group.color }],
                    ([color]) => { group.color = color; },
                    () => { delete group.color; }
                );
            }
        };

        const spacer = document.createElement("div"); spacer.style.flex = "1";
        const cancelBtn = Object.assign(document.createElement("button"), { textContent: "Cancel" });
        cancelBtn.style.cssText = "padding:6px 14px;background:#2a2a3a;border:1px solid #555;color:#ccc;border-radius:6px;cursor:pointer;font-size:13px;";
        cancelBtn.onclick = closeDialog;
        bottom.append(customBtn, spacer, cancelBtn);
        dialog.appendChild(bottom);
    });
}

// ─── Alignment ────────────────────────────────────────────────────────────────

// Works on any mix of nodes and groups — both expose .pos and .size via getters/setters.
function alignItems(mode, items) {
    if (!items || items.length < 2) return;

    const setPos = (item, x, y) => { item.pos = [x, y]; };

    switch (mode) {
        case "top": {
            const ref = Math.min(...items.map(i => i.pos[1]));
            items.forEach(i => setPos(i, i.pos[0], ref));
            break;
        }
        case "bottom": {
            const ref = Math.max(...items.map(i => i.pos[1] + i.size[1]));
            items.forEach(i => setPos(i, i.pos[0], ref - i.size[1]));
            break;
        }
        case "left": {
            const ref = Math.min(...items.map(i => i.pos[0]));
            items.forEach(i => setPos(i, ref, i.pos[1]));
            break;
        }
        case "right": {
            const ref = Math.max(...items.map(i => i.pos[0] + i.size[0]));
            items.forEach(i => setPos(i, ref - i.size[0], i.pos[1]));
            break;
        }
        case "centerH": {
            const cx = (Math.min(...items.map(i => i.pos[0])) + Math.max(...items.map(i => i.pos[0] + i.size[0]))) / 2;
            items.forEach(i => setPos(i, cx - i.size[0] / 2, i.pos[1]));
            break;
        }
        case "centerV": {
            const cy = (Math.min(...items.map(i => i.pos[1])) + Math.max(...items.map(i => i.pos[1] + i.size[1]))) / 2;
            items.forEach(i => setPos(i, i.pos[0], cy - i.size[1] / 2));
            break;
        }
    }
    redraw();
}

// ─── Selection helpers ────────────────────────────────────────────────────────

function getSelNodes() {
    const fromCanvas = Object.values(app.canvas?.selected_nodes ?? {});
    if (fromCanvas.length > 0) return fromCanvas;
    return (app.graph?._nodes ?? []).filter(n => n.is_selected);
}

// Returns all currently selected groups.
// Prefers selectedItems (supports multi-group rubber-band selection in newer LiteGraph),
// falls back to the single selected_group for backward compat with direct clicks.
function getSelGroups() {
    const LGraphGroup = window.LiteGraph?.LGraphGroup;
    const items = app.canvas?.selectedItems;
    if (items && LGraphGroup) {
        const groups = [...items].filter(i => i instanceof LGraphGroup);
        if (groups.length > 0) return groups;
    }
    const g = app.canvas?.selected_group;
    return g ? [g] : [];
}

// ─── Floating toolbar ─────────────────────────────────────────────────────────

let toolbar        = null;
let tbColorDot     = null;
let tbAlignSection = null;
let tbSep          = null;
// Snapshots captured at mousedown so they survive focus shifts
let snapNodes  = [];
let snapGroups = [];

function tbBtn(label, title, onClick) {
    const btn = document.createElement("button");
    btn.title = title; btn.innerHTML = label;
    btn.style.cssText =
        "background:transparent;border:none;color:#bbb;cursor:pointer;" +
        "padding:4px 9px;border-radius:6px;font-size:12px;" +
        "white-space:nowrap;transition:background 0.12s,color 0.12s;";
    btn.addEventListener("mouseenter", () => { btn.style.background="#2d2d4a"; btn.style.color="#fff"; });
    btn.addEventListener("mouseleave", () => { btn.style.background="transparent"; btn.style.color="#bbb"; });
    btn.addEventListener("mousedown", e => e.stopPropagation());
    btn.addEventListener("click",     e => { e.stopPropagation(); onClick(); });
    return btn;
}

function tbSepEl() {
    const s = document.createElement("div");
    s.style.cssText = "width:1px;height:16px;background:#3a3a5a;margin:0 3px;flex-shrink:0;";
    return s;
}

function buildToolbar() {
    toolbar = document.createElement("div");
    toolbar.id = "enigmatic-toolbar";
    toolbar.style.cssText =
        "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);" +
        "background:#16162a;border:1px solid #3a3a5a;border-radius:20px;" +
        "padding:5px 12px;display:none;align-items:center;gap:2px;" +
        "z-index:9000;box-shadow:0 4px 24px rgba(0,0,0,0.65);" +
        "font-family:sans-serif;user-select:none;pointer-events:all;";

    // Capture-phase mousedown: snapshot the selection the instant the toolbar is touched,
    // before any focus change can clear it on the canvas side.
    toolbar.addEventListener("mousedown", e => {
        e.stopPropagation();
        const freshNodes  = getSelNodes();
        const freshGroups = getSelGroups();
        if (freshNodes.length  > 0) snapNodes  = [...freshNodes];
        if (freshGroups.length > 0) snapGroups = [...freshGroups];
    }, true);

    // ── Color button ──
    const colorBtn = document.createElement("button");
    colorBtn.title = "Choose a color theme";
    colorBtn.style.cssText =
        "display:flex;align-items:center;gap:6px;background:transparent;border:none;" +
        "color:#bbb;cursor:pointer;padding:4px 9px;border-radius:6px;font-size:12px;" +
        "transition:background 0.12s,color 0.12s;";
    tbColorDot = document.createElement("span");
    tbColorDot.style.cssText =
        "display:inline-block;width:11px;height:11px;border-radius:50%;" +
        "background:#555;border:1px solid #888;flex-shrink:0;";
    colorBtn.append(tbColorDot, Object.assign(document.createElement("span"), { textContent: "Color" }));
    colorBtn.addEventListener("mouseenter", () => { colorBtn.style.background="#2d2d4a"; colorBtn.style.color="#fff"; });
    colorBtn.addEventListener("mouseleave", () => { colorBtn.style.background="transparent"; colorBtn.style.color="#bbb"; });
    colorBtn.addEventListener("mousedown", e => e.stopPropagation());
    colorBtn.addEventListener("click", e => {
        e.stopPropagation();
        const nodes  = snapNodes.length  > 0 ? snapNodes  : getSelNodes();
        const groups = snapGroups.length > 0 ? snapGroups : getSelGroups();
        // Pass only the first group to the theme dialog — coloring multiple groups at once
        // isn't needed here since each group has a single color field.
        showThemeDialog(nodes, groups[0] ?? null);
    });
    toolbar.appendChild(colorBtn);

    tbSep = tbSepEl();
    toolbar.appendChild(tbSep);

    // ── Align buttons ──
    tbAlignSection = document.createElement("div");
    tbAlignSection.style.cssText = "display:flex;align-items:center;gap:2px;";

    [
        ["⬆ Top",      "Align top edges",          "top"],
        ["⬇ Bottom",   "Align bottom edges",        "bottom"],
        ["⬅ Left",     "Align left edges",          "left"],
        ["➡ Right",    "Align right edges",         "right"],
        null,
        ["↔ Center H", "Center horizontally",       "centerH"],
        ["↕ Center V", "Center vertically",         "centerV"],
    ].forEach(def => {
        if (def === null) { tbAlignSection.appendChild(tbSepEl()); return; }
        const [label, title, mode] = def;
        tbAlignSection.appendChild(tbBtn(label, title, () => {
            const nodes  = snapNodes.length  > 0 ? snapNodes  : getSelNodes();
            const groups = snapGroups.length > 0 ? snapGroups : getSelGroups();
            alignItems(mode, [...nodes, ...groups]);
        }));
    });

    toolbar.appendChild(tbAlignSection);
    document.body.appendChild(toolbar);
}

function refreshToolbar() {
    if (!toolbar) return;
    const nodes  = getSelNodes();
    const groups = getSelGroups();

    // Keep snapshots current while nothing is being clicked
    if (nodes.length  > 0) snapNodes  = [...nodes];
    else if (groups.length === 0) snapNodes = [];
    snapGroups = [...groups];

    const hasAny    = nodes.length > 0 || groups.length > 0;
    const alignable = nodes.length + groups.length;
    const showAlign = alignable >= 2;

    toolbar.style.display              = hasAny    ? "flex"  : "none";
    if (tbSep)          tbSep.style.display          = showAlign ? "block" : "none";
    if (tbAlignSection) tbAlignSection.style.display  = showAlign ? "flex"  : "none";

    if (tbColorDot) {
        tbColorDot.style.background = nodes.length > 0
            ? toHex(nodes[0].color ?? "#353550")
            : groups.length > 0 ? toHex(groups[0].color ?? "#335577") : "#555";
    }
}

// ─── Extension ────────────────────────────────────────────────────────────────

app.registerExtension({
    name: "enigmatic.colorpicker",

    setup() {
        buildToolbar();
        document.addEventListener("mouseup", () => setTimeout(refreshToolbar, 60));
        document.addEventListener("keyup",   () => setTimeout(refreshToolbar, 60));

        const LGraphGroup = window.LiteGraph?.LGraphGroup;
        if (LGraphGroup) {
            const orig = LGraphGroup.prototype.getMenuOptions;
            LGraphGroup.prototype.getMenuOptions = function () {
                const items = orig ? orig.call(this) : [];
                const group = this;
                items.push(null, {
                    content: "Custom Color...",
                    callback: () => showCustomColorDialog(
                        "Group Color",
                        [{ label: "Color", value: group.color }],
                        ([color]) => { group.color = color; },
                        () => { delete group.color; }
                    ),
                });
                return items;
            };
        }
    },

    getNodeMenuOptions(node, options) {
        const sel = getSelNodes();
        options.push(null, {
            content: "Custom Color...",
            callback: () => showCustomColorDialog(
                "Node Color",
                [{ label: "Header", value: node.color }, { label: "Body", value: node.bgcolor }],
                ([color, bgcolor]) => { node.color = color; node.bgcolor = bgcolor; },
                () => { delete node.color; delete node.bgcolor; }
            ),
        });
        if (sel.length >= 2) {
            options.push(null, {
                content: "Align Selected Nodes",
                has_submenu: true,
                submenu: {
                    options: [
                        { content: "Align Top",           callback: () => alignItems("top",     sel) },
                        { content: "Align Bottom",        callback: () => alignItems("bottom",  sel) },
                        { content: "Align Left",          callback: () => alignItems("left",    sel) },
                        { content: "Align Right",         callback: () => alignItems("right",   sel) },
                        null,
                        { content: "Center Horizontally", callback: () => alignItems("centerH", sel) },
                        { content: "Center Vertically",   callback: () => alignItems("centerV", sel) },
                    ],
                },
            });
        }
        return options;
    },
});
