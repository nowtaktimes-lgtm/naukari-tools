"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  RotateCw, 
  Trash2, 
  Sparkles,
  Download,
  Calendar,
  User,
  ShieldAlert
} from "lucide-react";
import examsData from "@/data/exams.json";
import { ExamSEODB } from "@/types/exam";

interface ClientImageResizerProps {
  defaultExamSlug?: string;
  defaultResizeMode?: "photo" | "signature";
}

export default function ClientImageResizer({ defaultExamSlug, defaultResizeMode = "photo" }: ClientImageResizerProps) {
  const exams: ExamSEODB[] = examsData as ExamSEODB[];

  // File states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Resize mode
  const [resizeMode, setResizeMode] = useState<"photo" | "signature">(defaultResizeMode);

  // Resize / Stamp parameters
  const [selectedExamSlug, setSelectedExamSlug] = useState(defaultExamSlug || exams[0]?.slug || "");
  const [targetWidth, setTargetWidth] = useState(275);
  const [targetHeight, setTargetHeight] = useState(354);
  const [maxKb, setMaxKb] = useState(50);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  
  // Stamp options
  const [addStamp, setAddStamp] = useState(false);
  const [stampName, setStampName] = useState("");
  const [stampDate, setStampDate] = useState("2026-06-15");

  // Custom Toast States
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update target dimensions when exam or mode changes
  const currentExam = exams.find((e) => e.slug === selectedExamSlug);
  useEffect(() => {
    if (currentExam) {
      if (resizeMode === "photo") {
        // Parse dimensions e.g. "275x354 px"
        const dims = currentExam.photoDimensions.replace(" px", "").split("x");
        if (dims.length === 2) {
          setTargetWidth(parseInt(dims[0]));
          setTargetHeight(parseInt(dims[1]));
        }
        setMaxKb(currentExam.photoMaxKb);
      } else {
        // Parse dimensions e.g. "140x60 px"
        const dims = currentExam.signatureDimensions.replace(" px", "").split("x");
        if (dims.length === 2) {
          setTargetWidth(parseInt(dims[0]));
          setTargetHeight(parseInt(dims[1]));
        }
        setMaxKb(currentExam.signatureMaxKb);
      }
    }
  }, [selectedExamSlug, currentExam, resizeMode]);

  // Show Custom Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      triggerToast(`Unsupported file: ${file.name}. Only JPG, JPEG, PNG and WEBP images are supported. Files like PDFs or DOCX are blocked.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessedFile(null);
    setProcessedUrl(null);
    setRotation(0);
  };

  // Perform processing and compression
  const processImage = async () => {
    if (!selectedFile || !previewUrl) return;
    setIsProcessing(true);

    try {
      const { default: imageCompression } = await import("browser-image-compression");
      // Step 1: Load image onto canvas to apply Rotation & Stamp overlay
      const image = new Image();
      image.src = previewUrl;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      // Calculate canvas size based on rotation
      const isHorizontalRotated = rotation === 90 || rotation === 270;
      const finalWidth = isHorizontalRotated ? targetHeight : targetWidth;
      const finalHeight = isHorizontalRotated ? targetWidth : targetHeight;

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      // Fill canvas background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, finalWidth, finalHeight);

      // Save context, translate to center, rotate, and draw
      ctx.save();
      ctx.translate(finalWidth / 2, finalHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(
        image, 
        -targetWidth / 2, 
        -targetHeight / 2, 
        targetWidth, 
        targetHeight
      );
      ctx.restore();

      // Step 2: Draw text stamp if toggled
      if (addStamp) {
        const stampHeight = Math.round(finalHeight * 0.18); // 18% of image height for stamp
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, finalHeight - stampHeight, finalWidth, stampHeight);

        // Border separating image and stamp
        ctx.strokeStyle = "#E5E7EB";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, finalHeight - stampHeight);
        ctx.lineTo(finalWidth, finalHeight - stampHeight);
        ctx.stroke();

        // Write Name
        ctx.fillStyle = "#000000";
        const fontSizeName = Math.max(10, Math.round(stampHeight * 0.35));
        ctx.font = `bold ${fontSizeName}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          (stampName || "CANDIDATE NAME").toUpperCase(),
          finalWidth / 2,
          finalHeight - stampHeight * 0.65
        );

        // Write Date
        const fontSizeDate = Math.max(9, Math.round(stampHeight * 0.28));
        ctx.font = `${fontSizeDate}px monospace`;
        ctx.fillText(
          `DOB/DOP: ${stampDate}`,
          finalWidth / 2,
          finalHeight - stampHeight * 0.25
        );
      }

      // Convert Canvas to Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => {
          resolve(b || new Blob());
        }, "image/jpeg", 0.95);
      });

      // Step 3: Run through browser-image-compression to meet max KB threshold
      const options = {
        maxSizeMB: maxKb / 1024, // Convert KB to MB limit
        maxWidthOrHeight: Math.max(finalWidth, finalHeight),
        useWebWorker: true,
        initialQuality: 0.9,
      };

      const compressedBlob = await imageCompression(new File([blob], "temp.jpg", { type: "image/jpeg" }), options);

      // Create final file
      const finalFile = new File([compressedBlob], `resized_${selectedFile.name.split(".")[0]}.jpg`, {
        type: "image/jpeg",
      });

      setProcessedFile(finalFile);
      setProcessedUrl(URL.createObjectURL(compressedBlob));
      
      if (finalFile.size > maxKb * 1024) {
        // If still larger, retry compression with lower quality
        const fallbackOptions = {
          ...options,
          initialQuality: 0.6,
        };
        const fallbackBlob = await imageCompression(new File([blob], "temp.jpg", { type: "image/jpeg" }), fallbackOptions);
        const fallbackFile = new File([fallbackBlob], `resized_${selectedFile.name.split(".")[0]}.jpg`, {
          type: "image/jpeg",
        });
        setProcessedFile(fallbackFile);
        setProcessedUrl(URL.createObjectURL(fallbackBlob));
      }

    } catch (err) {
      console.error(err);
      triggerToast("Error compressing image. Try uploading a smaller size or format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedFile(null);
    setProcessedUrl(null);
    setRotation(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -z-10" />

      {/* Slide-in Toast Warning */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 left-4 right-4 z-50 rounded-2xl bg-red-950/90 border border-red-500/40 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
          >
            <div className="flex items-start space-x-3 text-red-400">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Invalid Upload Blocked</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">{toastMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-black/5 dark:border-white/5 pb-4 mb-6">
        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-600 dark:text-purple-400">
          <RotateCw className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Photo Resizer & Stamp</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Client-side sizing & custom name stamps</p>
        </div>
      </div>

      {/* Main Body */}
      {!selectedFile ? (
        // Drop area
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-black/10 dark:border-white/10 hover:border-purple-500/40 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 bg-slate-100/30 dark:bg-zinc-950/20 cursor-pointer transition-colors min-h-[220px]"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="image/*"
            className="hidden" 
          />
          <Upload className="h-8 w-8 text-slate-400 dark:text-zinc-600" />
          <div className="text-center">
            <span className="text-xs font-semibold text-slate-800 dark:text-white">
              Drag or Click to upload candidate {resizeMode === "photo" ? "photo" : "signature"}
            </span>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1">Supports JPG, JPEG, PNG, WEBP. PDF/DOCX blocked.</p>
          </div>
        </div>
      ) : (
        // Preview controls & output
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Inputs & Parameters */}
            <div className="space-y-3 bg-slate-100/50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-2xl p-4">
              
              {/* Resize Mode Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Resize Mode</label>
                <div className="flex bg-slate-200/50 dark:bg-zinc-950 border border-black/5 dark:border-white/5 rounded-xl p-1 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setResizeMode("photo");
                      setAddStamp(false);
                    }}
                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 relative ${
                      resizeMode === "photo"
                        ? "bg-white dark:bg-zinc-900 text-indigo-650 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300"
                    }`}
                  >
                    Photo Sizer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResizeMode("signature");
                      setAddStamp(false);
                    }}
                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 relative ${
                      resizeMode === "signature"
                        ? "bg-white dark:bg-zinc-900 text-indigo-650 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300"
                    }`}
                  >
                    Signature Sizer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1">Target Exam Spec</label>
                <select
                  value={selectedExamSlug}
                  onChange={(e) => setSelectedExamSlug(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                >
                  {exams.map((e) => (
                    <option key={e.slug} value={e.slug}>
                      {e.examName} ({resizeMode === "photo" ? e.photoDimensions : e.signatureDimensions}, Max {resizeMode === "photo" ? e.photoMaxKb : e.signatureMaxKb}KB)
                    </option>
                  ))}
                  <option value="custom">Custom Dimensions</option>
                </select>
              </div>

              {selectedExamSlug === "custom" && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-500 dark:text-zinc-500">Width (px)</label>
                    <input 
                      type="number" 
                      value={targetWidth} 
                      onChange={(e) => setTargetWidth(parseInt(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 dark:text-zinc-500">Height (px)</label>
                    <input 
                      type="number" 
                      value={targetHeight} 
                      onChange={(e) => setTargetHeight(parseInt(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 dark:text-zinc-500">Max KB</label>
                    <input 
                      type="number" 
                      value={maxKb} 
                      onChange={(e) => setMaxKb(parseInt(e.target.value))}
                      className="w-full bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-xs text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Photo Stamp Option (Only for Photo mode) */}
              {resizeMode === "photo" && (
                <div className="border-t border-black/5 dark:border-white/5 pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">Add Name & Date Photo Stamp</span>
                    <input
                      type="checkbox"
                      checked={addStamp}
                      onChange={(e) => setAddStamp(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 accent-purple-500 cursor-pointer"
                    />
                  </div>

                {addStamp && (
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400 dark:text-zinc-600" />
                      <input
                        type="text"
                        value={stampName}
                        onChange={(e) => setStampName(e.target.value)}
                        placeholder="NAME OF CANDIDATE"
                        className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-700"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-zinc-600" />
                      <input
                        type="date"
                        value={stampDate}
                        onChange={(e) => setStampDate(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950/80 border border-black/10 dark:border-white/10 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

            {/* Visual Preview panel */}
            <div className="flex flex-col items-center justify-center bg-slate-100/30 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-2xl p-4 space-y-3 min-h-[200px]">
              {processedUrl ? (
                <div className="text-center space-y-2">
                  <div className="relative border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-black max-h-[140px] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={processedUrl} 
                      alt="Processed Output" 
                      className="object-contain max-h-[140px]"
                      width={300}
                      height={140}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                    Output Size: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{(processedFile!.size / 1024).toFixed(1)} KB</span> / Max {maxKb}KB
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="relative border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-black max-h-[140px] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={previewUrl || undefined} 
                      alt="Original Preview" 
                      className="object-contain max-h-[140px]"
                      style={{ transform: `rotate(${rotation}deg)` }}
                      width={300}
                      height={140}
                    />
                  </div>
                  <div className="text-[10px] text-slate-550 dark:text-zinc-500 font-mono">
                    Original Size: {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              )}

              {/* Rotator Buttons */}
              <div className="flex space-x-1.5">
                <button
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1.5 text-xs transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Rotate</span>
                </button>
                <button
                  onClick={clearState}
                  className="px-2.5 py-1.5 rounded-lg bg-red-950/10 dark:bg-red-950/20 border border-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-950/20 dark:hover:bg-red-950/40 flex items-center space-x-1 text-xs transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Compress & Download Actions */}
          <div className="flex space-x-3">
            <button
              onClick={processImage}
              disabled={isProcessing}
              className="flex-grow inline-flex items-center justify-center space-x-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/40 border border-purple-400/20 px-4 py-3 text-xs font-semibold text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              {isProcessing ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compressing locally...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Apply Size Spec & Stamps</span>
                </>
              )}
            </button>

            {processedUrl && (
              <a
                href={processedUrl}
                download={processedFile?.name || "resized_image.jpg"}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-xs font-semibold text-white border border-emerald-400/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <Download className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
