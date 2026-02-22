"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Brush,
  Crop,
  Download,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  Redo2,
  RotateCw,
  Type,
  Undo2,
  Square,
  Circle,
  MousePointer2,
  Sticker,
  Eraser,
  ZoomIn,
  ZoomOut,
  Trash2,
} from "lucide-react";

type FabricNS = typeof import("fabric");

type ExportFormat = "png" | "jpg" | "webp" | "avif";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function dataUrlFromSvg(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const STICKERS: { name: string; src: string }[] = [
  {
    name: "Star",
    src: dataUrlFromSvg(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='#3b82f6'/><stop offset='1' stop-color='#06b6d4'/>
        </linearGradient></defs>
        <path fill='url(#g)' d='M64 6l15.7 31.8L115 43l-25.5 24.8L95.4 103 64 86.6 32.6 103l5.9-35.2L13 43l35.3-5.2z'/>
      </svg>`
    ),
  },
  {
    name: "Heart",
    src: dataUrlFromSvg(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>
        <path fill='#60a5fa' d='M64 112S16 84 16 48c0-14.9 12.1-27 27-27 9.5 0 17.9 4.9 22.6 12.3C70.1 25.9 78.5 21 88 21c14.9 0 27 12.1 27 27 0 36-48 64-51 64z'/>
      </svg>`
    ),
  },
  {
    name: "Sparkle",
    src: dataUrlFromSvg(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>
        <path fill='#22d3ee' d='M64 8l10 34 34 10-34 10-10 34-10-34-34-10 34-10z'/>
        <circle cx='98' cy='94' r='10' fill='#3b82f6'/>
        <circle cx='30' cy='30' r='8' fill='#60a5fa'/>
      </svg>`
    ),
  },


];

async function fabricImageFromURL(f: any, url: string, opts: any = {}) {
  // Fabric v5 uses callback: Image.fromURL(url, cb, opts)
  // Fabric v6 uses promise: FabricImage.fromURL(url, opts)
  const ImageCtor = f?.FabricImage ?? f?.Image;
  const fn = ImageCtor?.fromURL;
  if (!fn) throw new Error("Fabric fromURL not available");

  // Heuristic: callback-style functions usually have >= 2 params
  if (typeof fn === "function" && fn.length >= 2) {
    return await new Promise((resolve, reject) => {
      try {
        fn.call(ImageCtor, url, (img: any) => resolve(img), opts);
      } catch (e) {
        reject(e);
      }
    });
  }

  const maybe = fn.call(ImageCtor, url, opts);
  if (maybe && typeof maybe.then === "function") return await maybe;
  return maybe;
}

function getFilterCtor(f: any, name: string) {
  // v5: Image.filters.*
  // v6: filters.*
  const ns = f?.filters ?? f?.Image?.filters ?? f?.FabricImage?.filters;
  return ns?.[name] ?? f?.[name] ?? null;
}


export default function PhotoEditor() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const bgImageRef = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingFileRef = useRef<File | null>(null);
  const [tool, setTool] = useState<
    "select" | "draw" | "crop" | "text" | "rect" | "circle" | "arrow" | "eraser" | "sticker"
  >("select");

  const [zoom, setZoom] = useState(100);
  const [strokeColor, setStrokeColor] = useState("#3b82f6");
  const [fillColor, setFillColor] = useState("#60a5fa33");
  const [strokeWidth, setStrokeWidth] = useState(6);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [blur, setBlur] = useState(0);

  const [resizeW, setResizeW] = useState(0);
  const [resizeH, setResizeH] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);

  const [textValue, setTextValue] = useState("Text");
  const [textSize, setTextSize] = useState(42);
  const [textColor, setTextColor] = useState("#ffffff");

  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [exportQuality, setExportQuality] = useState(90);

  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const saveTimer = useRef<any>(null);

  const aspect = useRef<number | null>(null);

  const canUndo = undoStack.current.length > 1;
  const canRedo = redoStack.current.length > 0;

  const sizeLabel = useMemo(() => {
    const c = canvasRef.current;
    if (!c) return "";
    return `${Math.round(c.getWidth())}×${Math.round(c.getHeight())}`;
  }, [ready, resizeW, resizeH]);

  function pushState() {
    const c = canvasRef.current;
    if (!c) return;
    const json = JSON.stringify(c.toDatalessJSON(["selectable", "evented"]));
    const last = undoStack.current[undoStack.current.length - 1];
    if (json === last) return;
    undoStack.current.push(json);
    // limit
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
  }

  function schedulePushState() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => pushState(), 200);
  }

  async function initFabric() {
    if (!canvasElRef.current) return;

    const mod = await import("fabric");
    const fabric = (mod as any).fabric ?? mod;
    fabricRef.current = fabric;

    const CanvasCtor = (fabric as any).Canvas;
    if (!CanvasCtor) throw new Error("Fabric Canvas not available");

    const c = new CanvasCtor(canvasElRef.current, {
      backgroundColor: "#0b1220",
      preserveObjectStacking: true,
      selection: true,
    });

    canvasRef.current = c;

    // Fit to container
    const fit = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      c.setWidth(w);
      c.setHeight(h);
      c.requestRenderAll();
    };

    fit();
    window.addEventListener("resize", fit);

    // History hooks
    c.on("object:added", schedulePushState);
    c.on("object:modified", schedulePushState);
    c.on("object:removed", schedulePushState);

    // initial state
    pushState();

    // Keyboard shortcuts
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        doUndo();
      }
      if ((mod && (e.key.toLowerCase() === "y")) || (mod && e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        doRedo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      }
      if (e.key === "Escape") {
        setTool("select");
      }
    };

    window.addEventListener("keydown", onKey);

    setReady(true);

    // If user selected a file before editor was ready, load it now
    if (pendingFileRef.current) {
      const pf = pendingFileRef.current;
      pendingFileRef.current = null;
      try {
        // fire and forget
        loadImage(pf);
      } catch {}
    }

    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("keydown", onKey);
      c.dispose();
    };
  }

  useEffect(() => {
    initFabric();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tool behaviors
  useEffect(() => {
    const c = canvasRef.current;
    const fabric = fabricRef.current as any;
    if (!c || !fabric) return;

    c.isDrawingMode = tool === "draw";
    if (tool === "draw") {
      c.freeDrawingBrush.width = strokeWidth;
      c.freeDrawingBrush.color = strokeColor;
    }

    // Crop mode: create/keep a crop rect
    if (tool === "crop") {
      let cropRect = c.getObjects().find((o: any) => o.__zpp_crop === true);
      if (!cropRect) {
        cropRect = new fabric.Rect({
          left: c.getWidth() * 0.15,
          top: c.getHeight() * 0.15,
          width: c.getWidth() * 0.7,
          height: c.getHeight() * 0.7,
          fill: "rgba(96,165,250,0.12)",
          stroke: "rgba(96,165,250,0.9)",
          strokeWidth: 2,
          cornerColor: "rgba(59,130,246,1)",
          cornerStyle: "circle",
          transparentCorners: false,
          hasRotatingPoint: false,
        });
        cropRect.__zpp_crop = true;
        c.add(cropRect);
      }
      c.setActiveObject(cropRect);
    } else {
      // if leaving crop mode keep rect but make it non-intrusive
      const cropRect = c.getObjects().find((o: any) => o.__zpp_crop === true);
      if (cropRect) {
        cropRect.set({ selectable: false, evented: false, opacity: 0.15 });
        c.discardActiveObject();
        c.requestRenderAll();
      }
    }

    // Eraser: very simple (remove clicked object)
    if (tool === "eraser") {
      const handler = (opt: any) => {
        if (!opt?.target) return;
        if (opt.target.__zpp_crop) return;
        c.remove(opt.target);
      };
      c.on("mouse:down", handler);
      return () => c.off("mouse:down", handler);
    }

    if (tool === "text") {
      const handler = (opt: any) => {
        const p = c.getPointer(opt.e);
        const t = new fabric.IText(textValue || "Text", {
          left: p.x,
          top: p.y,
          fill: textColor,
          fontSize: textSize,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        });
        c.add(t);
        c.setActiveObject(t);
        setTool("select");
      };
      c.on("mouse:down", handler);
      return () => c.off("mouse:down", handler);
    }

    if (tool === "rect") {
      const handler = (opt: any) => {
        const p = c.getPointer(opt.e);
        const r = new fabric.Rect({
          left: p.x,
          top: p.y,
          width: 220,
          height: 140,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
        });
        c.add(r);
        c.setActiveObject(r);
        setTool("select");
      };
      c.on("mouse:down", handler);
      return () => c.off("mouse:down", handler);
    }

    if (tool === "circle") {
      const handler = (opt: any) => {
        const p = c.getPointer(opt.e);
        const circ = new fabric.Circle({
          left: p.x,
          top: p.y,
          radius: 80,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
        });
        c.add(circ);
        c.setActiveObject(circ);
        setTool("select");
      };
      c.on("mouse:down", handler);
      return () => c.off("mouse:down", handler);
    }

    if (tool === "arrow") {
      const handler = (opt: any) => {
        const p = c.getPointer(opt.e);
        const x1 = p.x;
        const y1 = p.y;
        const x2 = p.x + 220;
        const y2 = p.y;

        const line = new fabric.Line([x1, y1, x2, y2], {
          stroke: strokeColor,
          strokeWidth,
          selectable: true,
        });

        const tri = new fabric.Triangle({
          left: x2,
          top: y2,
          originX: "center",
          originY: "center",
          angle: 90,
          width: 18 + strokeWidth,
          height: 18 + strokeWidth,
          fill: strokeColor,
        });

        const group = new fabric.Group([line, tri], { left: x1, top: y1 });
        c.add(group);
        c.setActiveObject(group);
        setTool("select");
      };
      c.on("mouse:down", handler);
      return () => c.off("mouse:down", handler);
    }
  }, [tool, strokeColor, fillColor, strokeWidth, textValue, textSize, textColor]);

  function deleteSelected() {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObjects();
    active.forEach((o: any) => {
      if (o.__zpp_crop) return;
      c.remove(o);
    });
    c.discardActiveObject();
    c.requestRenderAll();
  }

  function doUndo() {
    const c = canvasRef.current;
    if (!c) return;
    if (undoStack.current.length <= 1) return;
    const current = undoStack.current.pop();
    if (current) redoStack.current.push(current);
    const prev = undoStack.current[undoStack.current.length - 1];
    if (!prev) return;
    c.loadFromJSON(prev, () => {
      c.requestRenderAll();
    });
  }

  function doRedo() {
    const c = canvasRef.current;
    if (!c) return;
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push(next);
    c.loadFromJSON(next, () => {
      c.requestRenderAll();
    });
  }

  async function loadImage(file: File) {
    const c = canvasRef.current;
    const fabric = fabricRef.current as any;

    if (!c || !fabric) {
      // Not ready yet: queue
      pendingFileRef.current = file;
      return;
    }

    setError(null);

    const url = URL.createObjectURL(file);
    try {
      const img: any = await fabricImageFromURL(fabric, url, { crossOrigin: "anonymous" });

      // Clear everything but keep background
      c.getObjects().forEach((o: any) => c.remove(o));

      img.set({
        left: 0,
        top: 0,
        originX: "left",
        originY: "top",
        selectable: false,
        evented: false,
      });

      // Fit image into canvas area while preserving aspect
      const cw = c.getWidth();
      const ch = c.getHeight();
      const iw = img.width || 1;
      const ih = img.height || 1;
      const scale = Math.min(cw / iw, ch / ih);
      if (typeof img.scale === "function") img.scale(scale);
      else {
        img.scaleX = scale;
        img.scaleY = scale;
      }

      bgImageRef.current = img;
      c.add(img);
      c.sendToBack(img);
      c.requestRenderAll();

      setResizeW(Math.round(iw));
      setResizeH(Math.round(ih));
      aspect.current = iw / ih;

      pushState();
    } catch (e: any) {
      setError(e?.message || "Failed to load image");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function applyAdjustments() {
    const c = canvasRef.current;
    const fabric = fabricRef.current as any;
    const img = bgImageRef.current;
    if (!c || !fabric || !img) return;

    const filters: any[] = [];

    // Brightness/Contrast/Saturation
    if (brightness !== 0) { const C = getFilterCtor(fabric, 'Brightness'); if (C) filters.push(new C({ brightness: brightness / 100 })); }
    if (contrast !== 0) { const C = getFilterCtor(fabric, 'Contrast'); if (C) filters.push(new C({ contrast: contrast / 100 })); }
    if (saturation !== 0) { const C = getFilterCtor(fabric, 'Saturation'); if (C) filters.push(new C({ saturation: saturation / 100 })); }
    if (blur > 0) { const C = getFilterCtor(fabric, 'Blur'); if (C) filters.push(new C({ blur: clamp(blur / 100, 0, 1) })); }

    img.filters = filters;
    img.applyFilters();
    c.requestRenderAll();
    pushState();
  }

  function resetAdjustments() {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setBlur(0);

    const c = canvasRef.current;
    const img = bgImageRef.current;
    if (!c || !img) return;
    img.filters = [];
    img.applyFilters();
    c.requestRenderAll();
    pushState();
  }

  function applyCrop() {
    const c = canvasRef.current;
    const img = bgImageRef.current;
    if (!c || !img) return;
    const cropRect = c.getObjects().find((o: any) => o.__zpp_crop === true);
    if (!cropRect) return;

    // Fabric crop in image space is complex; simplest reliable approach:
    // render to dataURL cropped region in canvas coordinates.
    const rect = cropRect.getBoundingRect(true, true);

    const dpr = window.devicePixelRatio || 1;
    const tmp = document.createElement("canvas");
    tmp.width = Math.round(rect.width * dpr);
    tmp.height = Math.round(rect.height * dpr);
    const ctx = tmp.getContext("2d");
    if (!ctx) return;

    // Render full canvas to image
    const full = c.toDataURL({ format: "png", multiplier: dpr });
    const fullImg = new Image();
    fullImg.onload = () => {
      ctx.drawImage(
        fullImg,
        rect.left * dpr,
        rect.top * dpr,
        rect.width * dpr,
        rect.height * dpr,
        0,
        0,
        rect.width * dpr,
        rect.height * dpr
      );

      const outUrl = tmp.toDataURL("image/png");
      const f = fabricRef.current as any;
      if (!f) return;
      fabricImageFromURL(f, outUrl, { crossOrigin: 'anonymous' })
        .then((newImg: any) => {
        // Reset canvas objects and set new image as background
        c.getObjects().forEach((o: any) => c.remove(o));
        newImg.set({ left: 0, top: 0, originX: "left", originY: "top", selectable: false, evented: false });

        // Fit new image
        const cw = c.getWidth();
        const ch = c.getHeight();
        const iw = newImg.width || 1;
        const ih = newImg.height || 1;
        const scale = Math.min(cw / iw, ch / ih);
        newImg.scale(scale);

        bgImageRef.current = newImg;
        c.add(newImg);
        c.sendToBack(newImg);
        c.requestRenderAll();

        setTool("select");
        pushState();
      })
        .catch((e: any) => setError(e?.message || 'Crop failed'));
    };
    fullImg.src = full;
  }

  function applyResize() {
    const img = bgImageRef.current;
    const c = canvasRef.current;
    const fabric = fabricRef.current as any;
    if (!img || !c || !fabric) return;

    const src = c.toDataURL({ format: "png", multiplier: 1 });
    const w = clamp(Number(resizeW) || 0, 16, 10000);
    const h = clamp(Number(resizeH) || 0, 16, 10000);

    const tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    const ctx = tmp.getContext("2d");
    if (!ctx) return;
    const im = new Image();
    im.onload = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(im, 0, 0, w, h);
      const out = tmp.toDataURL("image/png");
      fabricImageFromURL(fabric, out, { crossOrigin: 'anonymous' })
        .then((newImg: any) => {
        c.getObjects().forEach((o: any) => c.remove(o));
        newImg.set({ left: 0, top: 0, originX: "left", originY: "top", selectable: false, evented: false });
        const cw = c.getWidth();
        const ch = c.getHeight();
        const iw = newImg.width || 1;
        const ih = newImg.height || 1;
        const scale = Math.min(cw / iw, ch / ih);
        newImg.scale(scale);
        bgImageRef.current = newImg;
        c.add(newImg);
        c.sendToBack(newImg);
        c.requestRenderAll();
        pushState();
      })
        .catch((e: any) => setError(e?.message || 'Resize failed'));
    };
    im.src = src;
  }

  function rotate90() {
    const c = canvasRef.current;
    if (!c) return;
    const img = bgImageRef.current;
    if (!img) return;
    img.rotate(((img.angle || 0) + 90) % 360);
    c.requestRenderAll();
    pushState();
  }

  function flipH() {
    const c = canvasRef.current;
    if (!c) return;
    const img = bgImageRef.current;
    if (!img) return;
    img.set("flipX", !img.flipX);
    c.requestRenderAll();
    pushState();
  }

  function flipV() {
    const c = canvasRef.current;
    if (!c) return;
    const img = bgImageRef.current;
    if (!img) return;
    img.set("flipY", !img.flipY);
    c.requestRenderAll();
    pushState();
  }

  function setZoomPct(pct: number) {
    const c = canvasRef.current;
    if (!c) return;
    const z = clamp(pct, 10, 300) / 100;
    setZoom(Math.round(z * 100));
    c.setZoom(z);
    c.requestRenderAll();
  }

  async function addSticker(src: string) {
    const c = canvasRef.current;
    const fabric = fabricRef.current as any;
    if (!c || !fabric) return;

    setError(null);

    try {
      const img: any = await fabricImageFromURL(fabric, src, { crossOrigin: "anonymous" });
      img.set({
        left: c.getWidth() * 0.5,
        top: c.getHeight() * 0.5,
        originX: "center",
        originY: "center",
        scaleX: 0.6,
        scaleY: 0.6,
      });
      c.add(img);
      c.setActiveObject(img);
      c.requestRenderAll();
      pushState();
    } catch (e: any) {
      setError(e?.message || "Failed to add sticker");
    }
  }

  async function exportImage() {
    const c = canvasRef.current;
    if (!c) return;

    const multiplier = 1; // keep snappy

    // Export full canvas
    const fmt = exportFormat;

    // AVIF via server
    if (fmt === "avif") {
      const dataUrl = c.toDataURL({ format: "png", multiplier });
      const res = await fetch("/api/editor/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, quality: exportQuality, effort: 4 }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.error || "AVIF export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zippixel-edit.avif";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return;
    }

    const mime = fmt === "jpg" ? "image/jpeg" : fmt === "webp" ? "image/webp" : "image/png";
    const quality = fmt === "jpg" || fmt === "webp" ? clamp(exportQuality / 100, 0.05, 1) : 1;

    const dataUrl = c.toDataURL({ format: fmt === "jpg" ? "jpeg" : fmt, quality, multiplier });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `zippixel-edit.${fmt === "jpg" ? "jpg" : fmt}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) loadImage(file);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <a href="/"> <ArrowLeft className="mr-2 h-4 w-4" /> Home</a>
            </Button>
            <div>
              <div className="text-lg font-semibold">Photo Editor</div>
              <div className="text-sm text-muted-foreground">Crop, resize, draw, add text/shapes/stickers, and export.</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={doUndo} disabled={!canUndo}>
              <Undo2 className="mr-2 h-4 w-4" /> Undo
            </Button>
            <Button variant="outline" onClick={doRedo} disabled={!canRedo}>
              <Redo2 className="mr-2 h-4 w-4" /> Redo
            </Button>
            <Button variant="outline" onClick={deleteSelected}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
            <Button onClick={exportImage}>
              <Download className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr_260px]">
          {/* Left tools */}
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-sm font-medium">Tools</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant={tool === "select" ? "default" : "outline"} onClick={() => setTool("select")}>
                <MousePointer2 className="mr-2 h-4 w-4" /> Select
              </Button>
              <Button variant={tool === "draw" ? "default" : "outline"} onClick={() => setTool("draw")}>
                <Brush className="mr-2 h-4 w-4" /> Draw
              </Button>
              <Button variant={tool === "crop" ? "default" : "outline"} onClick={() => setTool("crop")}>
                <Crop className="mr-2 h-4 w-4" /> Crop
              </Button>
              <Button variant={tool === "text" ? "default" : "outline"} onClick={() => setTool("text")}>
                <Type className="mr-2 h-4 w-4" /> Text
              </Button>
              <Button variant={tool === "rect" ? "default" : "outline"} onClick={() => setTool("rect")}>
                <Square className="mr-2 h-4 w-4" /> Rect
              </Button>
              <Button variant={tool === "circle" ? "default" : "outline"} onClick={() => setTool("circle")}>
                <Circle className="mr-2 h-4 w-4" /> Circle
              </Button>
              <Button variant={tool === "arrow" ? "default" : "outline"} onClick={() => setTool("arrow")}>
                <ImageIcon className="mr-2 h-4 w-4" /> Arrow
              </Button>
              <Button variant={tool === "eraser" ? "default" : "outline"} onClick={() => setTool("eraser")}>
                <Eraser className="mr-2 h-4 w-4" /> Erase
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="text-sm font-medium">Image</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={rotate90}>
                <RotateCw className="mr-2 h-4 w-4" /> Rotate
              </Button>
              <Button variant="outline" onClick={flipH}>
                <FlipHorizontal className="mr-2 h-4 w-4" /> Flip
              </Button>
              <Button variant="outline" onClick={flipV}>
                <FlipVertical className="mr-2 h-4 w-4" /> Flip V
              </Button>
              <Button variant={tool === "sticker" ? "default" : "outline"} onClick={() => setTool("sticker")}>
                <Sticker className="mr-2 h-4 w-4" /> Stickers
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="text-sm font-medium">Brush & Shape</div>
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Stroke</div>
                <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
                <div className="text-xs text-muted-foreground">Fill</div>
                <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Width</div>
                <Slider value={[strokeWidth]} min={1} max={40} step={1} onValueChange={(v) => setStrokeWidth(v[0] ?? 6)} />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="text-sm font-medium">Open</div>
            <label className="mt-2 block cursor-pointer rounded-xl border bg-background px-3 py-2 text-sm hover:bg-accent">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) loadImage(f);
                  // allow picking same file again
                  e.currentTarget.value = "";
                }}
              />
              Upload image
            </label>

            <p className="mt-2 text-xs text-muted-foreground">Tip: you can also drag & drop an image onto the canvas.</p>
          </div>

          {/* Canvas */}
          <div
            className="relative overflow-hidden rounded-2xl border bg-black/40"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <div ref={containerRef} className="h-[640px] w-full">
              <canvas ref={canvasElRef} className="h-full w-full" />
            </div>
            {error && (
              <div className="absolute left-4 top-4 z-10 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            {!ready && (
              <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">Loading editor…</div>
            )}
          </div>

          {/* Right panel */}
          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Controls</div>
              <div className="text-xs text-muted-foreground">{sizeLabel}</div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Zoom</div>
                  <div className="text-xs text-muted-foreground">{zoom}%</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setZoomPct(zoom - 10)}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Slider value={[zoom]} min={10} max={300} step={1} onValueChange={(v) => setZoomPct(v[0] ?? 100)} />
                  <Button variant="outline" size="icon" onClick={() => setZoomPct(zoom + 10)}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="adjust" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="adjust">Adjust</TabsTrigger>
                  <TabsTrigger value="resize">Resize</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>

                <TabsContent value="adjust" className="mt-4 space-y-4">
                  <div>
                    <div className="mb-1 text-xs text-muted-foreground">Brightness</div>
                    <Slider value={[brightness]} min={-50} max={50} step={1} onValueChange={(v) => setBrightness(v[0] ?? 0)} />
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-muted-foreground">Contrast</div>
                    <Slider value={[contrast]} min={-50} max={50} step={1} onValueChange={(v) => setContrast(v[0] ?? 0)} />
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-muted-foreground">Saturation</div>
                    <Slider value={[saturation]} min={-50} max={50} step={1} onValueChange={(v) => setSaturation(v[0] ?? 0)} />
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-muted-foreground">Blur</div>
                    <Slider value={[blur]} min={0} max={20} step={1} onValueChange={(v) => setBlur(v[0] ?? 0)} />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={applyAdjustments}>Apply</Button>
                    <Button className="flex-1" variant="outline" onClick={resetAdjustments}>Reset</Button>
                  </div>
                </TabsContent>

                <TabsContent value="resize" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Width</div>
                      <Input
                        value={resizeW || ""}
                        inputMode="numeric"
                        onChange={(e) => {
                          const v = Number(e.target.value) || 0;
                          setResizeW(v);
                          if (keepAspect && aspect.current) setResizeH(Math.round(v / aspect.current));
                        }}
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Height</div>
                      <Input
                        value={resizeH || ""}
                        inputMode="numeric"
                        onChange={(e) => {
                          const v = Number(e.target.value) || 0;
                          setResizeH(v);
                          if (keepAspect && aspect.current) setResizeW(Math.round(v * aspect.current));
                        }}
                      />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} />
                    Keep aspect ratio
                  </label>
                  <Button onClick={applyResize}>Apply resize</Button>

                  <Separator className="my-2" />

                  <div className="text-sm font-medium">Crop</div>
                  <p className="mt-1 text-xs text-muted-foreground">Select Crop tool, adjust the box, then apply.</p>
                  <Button variant="outline" onClick={applyCrop}>Apply crop</Button>

                  <Separator className="my-2" />

                  <div className="text-sm font-medium">Text</div>
                  <div className="mt-2 space-y-2">
                    <Input value={textValue} onChange={(e) => setTextValue(e.target.value)} />
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground">Size</div>
                      <Slider value={[textSize]} min={12} max={120} step={1} onValueChange={(v) => setTextSize(v[0] ?? 42)} />
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                    </div>
                    <p className="text-xs text-muted-foreground">Select Text tool and click on canvas to place.</p>
                  </div>

                  {tool === "sticker" && (
                    <>
                      <Separator className="my-2" />
                      <div className="text-sm font-medium">Stickers</div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {STICKERS.map((s) => (
                          <button
                            key={s.name}
                            onClick={() => addSticker(s.src)}
                            className="rounded-xl border bg-background p-2 hover:bg-accent"
                            title={s.name}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt={s.name} src={s.src} className="h-10 w-10" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="export" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Format</div>
                    <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="avif">AVIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">Quality</div>
                      <div className="text-xs text-muted-foreground">{exportQuality}</div>
                    </div>
                    <Slider value={[exportQuality]} min={40} max={100} step={1} onValueChange={(v) => setExportQuality(v[0] ?? 90)} />
                    <p className="mt-2 text-xs text-muted-foreground">AVIF uses server-side export for best compatibility.</p>
                  </div>

                  <Button onClick={exportImage}>
                    <Download className="mr-2 h-4 w-4" /> Save
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
