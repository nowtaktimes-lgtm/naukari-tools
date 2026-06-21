"use client";

import React, { useState, useRef } from "react";
import { 
  FileArchive, 
  Upload, 
  Download, 
  CheckCircle, 
  Lock, 
  FileText,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  AlertCircle
} from "lucide-react";

type SizePreset = 100 | 200 | 500;
type FormatPreset = "pdf" | "jpg";

export default function DocumentCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Options
  const [sizePreset, setSizePreset] = useState<SizePreset>(100);
  const [outputFormat, setOutputFormat] = useState<FormatPreset>("pdf");

  // Results
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    // Validate if it is an image
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(uploadedFile.type)) {
      setErrorMsg("Unsupported format. Please upload a certificate photo (JPG/PNG).");
      return;
    }

    setErrorMsg(null);
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    setCompressedUrl(null);
  };

  // Perform Local Compression
  const handleCompress = async () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const { default: imageCompression } = await import("browser-image-compression");
      const { jsPDF } = await import("jspdf");
      // Step 1: Compress the image using browser-image-compression
      // Allocate some buffer (e.g. 10%) for PDF metadata wrapping if PDF output is selected
      const sizeBuffer = outputFormat === "pdf" ? 0.85 : 0.95;
      const targetBytes = sizePreset * 1024 * sizeBuffer;

      const options = {
        maxSizeMB: targetBytes / (1024 * 1024),
        maxWidthOrHeight: 1600, // standard resolution for high legibility
        useWebWorker: true,
        initialQuality: 0.85,
      };

      const compressedImageBlob = await imageCompression(file, options);

      // Step 2: Convert to final output format
      if (outputFormat === "jpg") {
        setCompressedUrl(URL.createObjectURL(compressedImageBlob));
        setCompressedSize(compressedImageBlob.size);
      } else {
        // PDF conversion with jsPDF
        const img = new Image();
        img.src = URL.createObjectURL(compressedImageBlob);
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Set PDF page orientation based on image aspect ratio
        const orientation = img.width > img.height ? "landscape" : "portrait";
        const doc = new jsPDF({
          orientation: orientation,
          unit: "mm",
          format: "a4"
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Convert image blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(compressedImageBlob);
        
        await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Draw image covering page
            doc.addImage(base64data, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
            resolve(true);
          };
        });

        // Output as blob
        const pdfBlob = doc.output("blob");

        // Verify if PDF exceeds limit, if yes run second pass compression
        if (pdfBlob.size > sizePreset * 1024) {
          const aggressiveOptions = {
            ...options,
            maxSizeMB: (targetBytes * 0.7) / (1024 * 1024),
            initialQuality: 0.5,
          };
          const aggressiveImageBlob = await imageCompression(file, aggressiveOptions);
          
          const aggressiveImg = new Image();
          aggressiveImg.src = URL.createObjectURL(aggressiveImageBlob);
          await new Promise((resolve) => {
            aggressiveImg.onload = resolve;
          });

          const aggressiveDoc = new jsPDF({
            orientation: orientation,
            unit: "mm",
            format: "a4"
          });
          
          const agReader = new FileReader();
          agReader.readAsDataURL(aggressiveImageBlob);
          await new Promise((resolve) => {
            agReader.onloadend = () => {
              const base64data = agReader.result as string;
              aggressiveDoc.addImage(base64data, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
              resolve(true);
            };
          });

          const finalPdfBlob = aggressiveDoc.output("blob");
          setCompressedUrl(URL.createObjectURL(finalPdfBlob));
          setCompressedSize(finalPdfBlob.size);
        } else {
          setCompressedUrl(URL.createObjectURL(pdfBlob));
          setCompressedSize(pdfBlob.size);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Compression error. Check file legibility or file size.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setPreviewUrl(null);
    setCompressedUrl(null);
    setCompressedSize(0);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-black/5 dark:border-white/5 pb-4 mb-6">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <FileArchive className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Certificate Compressor</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Compress marksheets/caste certificates locally</p>
        </div>
      </div>

      {/* Main body */}
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-black/10 dark:border-white/10 hover:border-emerald-500/40 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 bg-slate-100/30 dark:bg-zinc-950/20 cursor-pointer transition-colors min-h-[200px]"
        >
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
          />
          <Upload className="h-8 w-8 text-slate-400 dark:text-zinc-600" />
          <div className="text-center">
            <span className="text-xs font-semibold text-slate-800 dark:text-white">Upload Certificate (Marksheet Photo / Scan)</span>
            <p className="text-[10px] text-slate-550 dark:text-zinc-500 mt-1">Accepts PNG, JPG, JPEG. Compresses directly into compliant PDFs.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Options */}
            <div className="space-y-3.5 bg-slate-100/50 dark:bg-white/[0.01] border border-black/5 dark:border-white/5 rounded-2xl p-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-550 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Max Size Limit</label>
                <div className="flex space-x-1.5">
                  {([100, 200, 500] as SizePreset[]).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setSizePreset(preset);
                      }}
                      className={`flex-grow py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        sizePreset === preset
                          ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                          : "bg-slate-150 border-black/5 text-slate-600 hover:border-black/10 dark:bg-zinc-900 dark:border-white/5 dark:text-zinc-400 dark:hover:border-white/10"
                      }`}
                    >
                      {preset} KB
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-550 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Export Format</label>
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => {
                      setOutputFormat("pdf");
                    }}
                    className={`flex-grow py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                      outputFormat === "pdf"
                        ? "bg-emerald-600 border-emerald-400 text-white"
                        : "bg-slate-150 border-black/5 text-slate-600 dark:bg-zinc-900 dark:border-white/5 dark:text-zinc-400"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>PDF Format</span>
                  </button>
                  <button
                    onClick={() => {
                      setOutputFormat("jpg");
                    }}
                    className={`flex-grow py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1 transition-all ${
                      outputFormat === "jpg"
                        ? "bg-emerald-600 border-emerald-400 text-white"
                        : "bg-slate-150 border-black/5 text-slate-600 dark:bg-zinc-900 dark:border-white/5 dark:text-zinc-400"
                    }`}
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>JPG Format</span>
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-550 dark:text-zinc-500 leading-relaxed">
                Tip: Indian recruitment portals like UPSC/SSC strictly mandate uploading certificates as PDFs under 100KB or 200KB.
              </div>
            </div>

            {/* Preview panel */}
            <div className="flex flex-col justify-center items-center bg-slate-100/30 dark:bg-zinc-950/40 border border-black/5 dark:border-white/5 rounded-2xl p-4 min-h-[160px] relative">
              {compressedUrl ? (
                <div className="text-center space-y-2.5">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Compressed Successfully!</span>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-1">
                      Target: &lt;{sizePreset}KB | Output: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{(compressedSize / 1024).toFixed(1)} KB</span>
                    </p>
                  </div>
                  <button 
                    onClick={resetState}
                    className="text-[10px] text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 font-medium underline"
                  >
                    Upload another document
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium truncate max-w-[150px] mx-auto">
                    {file.name}
                  </div>
                  <div className="text-[10px] text-slate-550 dark:text-zinc-500 font-mono">
                    Original Size: {(file.size / 1024).toFixed(1)} KB
                  </div>
                  <button
                    onClick={resetState}
                    className="text-[10px] text-red-650 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Compress & Download Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="flex-grow inline-flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900/40 border border-emerald-400/20 px-4 py-3 text-xs font-semibold text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Compressing locally...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Compress Certificate</span>
                </>
              )}
            </button>

            {compressedUrl && (
              <a
                href={compressedUrl}
                download={`compressed_cert_${file.name.split(".")[0]}.${outputFormat}`}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-xs font-semibold text-white border border-indigo-400/20 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                <Download className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-xs mt-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Privacy lock disclaimer */}
      <div className="border-t border-black/5 dark:border-white/5 pt-3.5 mt-4 flex items-center justify-center space-x-1.5 text-[10px] text-slate-550 dark:text-zinc-500">
        <Lock className="h-3 w-3 text-slate-400 dark:text-zinc-600" />
        <span>Privacy Lock: Processing stays in your browser; your files never touch our servers.</span>
      </div>
    </div>
  );
}
