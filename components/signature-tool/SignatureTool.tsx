'use client';

import { useState, useCallback, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import {
  processImage,
  type ImageRequirement,
  type ProcessedImageResult,
  type CropData,
  getDefaultCrop,
  loadImage,
} from '@/lib/image-processing';

interface SignatureToolProps {
  requirement: ImageRequirement;
  examName: string;
  appName: string;
  officialSourceUrl?: string | null;
  verifiedAt?: string | null;
  additionalInstructions?: string | null;
}

export function SignatureTool({
  requirement,
  examName,
  appName,
  officialSourceUrl,
  verifiedAt,
  additionalInstructions,
}: SignatureToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<CropData | null>(null);
  const [cropPercent, setCropPercent] = useState<CropData | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPG or PNG).');
        return;
      }

      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('File size must be under 20 MB.');
        return;
      }

      setError(null);
      setFile(selectedFile);

      try {
        const loaded = await loadImage(selectedFile);
        setImage(loaded);
        const defaultCrop = getDefaultCrop(loaded, requirement.width, requirement.height);
        setCrop(defaultCrop);
        setCropPercent({
          x: (defaultCrop.x / loaded.width) * 100,
          y: (defaultCrop.y / loaded.height) * 100,
          width: (defaultCrop.width / loaded.width) * 100,
          height: (defaultCrop.height / loaded.height) * 100,
        });

        const res = await processImage(loaded, defaultCrop, {
          ...requirement,
          format,
          nameRequired: false,
          dateRequired: false,
        });
        setResult(res);
      } catch {
        setError('Failed to parse uploaded signature image.');
      }
    },
    [requirement, format]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && fileInputRef.current) {
      const event = {
        target: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  const handleCropComplete = useCallback(
    async (_crop: CropData, percentCrop: CropData) => {
      setCropPercent(percentCrop);
      if (image) {
        const absoluteCrop = {
          x: (percentCrop.x / 100) * image.width,
          y: (percentCrop.y / 100) * image.height,
          width: (percentCrop.width / 100) * image.width,
          height: (percentCrop.height / 100) * image.height,
        };
        setCrop(absoluteCrop);

        try {
          const res = await processImage(image, absoluteCrop, {
            ...requirement,
            format,
            nameRequired: false,
            dateRequired: false,
          });
          setResult(res);
        } catch {
          // auto crop error
        }
      }
    },
    [image, requirement, format]
  );

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${examName.toLowerCase().replace(/\s+/g, '-')}-${appName.toLowerCase().replace(/\s+/g, '-')}-signature.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setImage(null);
    setCrop(null);
    setCropPercent(null);
    setZoom(1);
    setRotate(0);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. REQUIREMENT BAR */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 md:p-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
          <div className="flex items-center gap-3 pr-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 leading-tight">Signature Requirements</div>
              <div className="text-[11px] text-neutral-500 truncate mt-0.5">{appName}</div>
            </div>
          </div>

          <div className="sm:pl-4 flex items-center gap-2.5 pt-2 sm:pt-0">
            <div className="text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-neutral-400 font-semibold">Dimensions</div>
              <div className="text-xs font-bold text-neutral-900 font-mono">{requirement.width} × {requirement.height} px</div>
            </div>
          </div>

          <div className="sm:pl-4 flex items-center gap-2.5 pt-2 sm:pt-0">
            <div className="text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-neutral-400 font-semibold">File size</div>
              <div className="text-xs font-bold text-neutral-900 font-mono">{requirement.minKB} – {requirement.maxKB} KB</div>
            </div>
          </div>

          <div className="sm:pl-4 flex items-center gap-2.5 pt-2 sm:pt-0">
            <div className="text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-neutral-400 font-semibold">Format</div>
              <div className="text-xs font-bold text-neutral-900 uppercase">{requirement.format}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload & Adjust */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Upload Signature</h3>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-200 hover:border-neutral-900 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-50/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="sig-file-upload"
              />
              <div className="w-10 h-10 mx-auto rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-neutral-900">Drag & drop signature here</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">or click to browse</p>
              <p className="text-[10px] text-neutral-400 mt-2 font-mono">JPG, PNG (Max 20 MB)</p>
            </div>
          </div>

          {/* Adjust Controls */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Crop & Align</h3>
              </div>
              {image && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-neutral-400 hover:text-neutral-900 font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            <div>
              <div className="flex justify-between text-xs text-neutral-600 mb-1.5 font-medium">
                <span>Zoom</span>
                <span className="font-mono text-neutral-900">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <div className="text-xs text-neutral-600 mb-1.5 font-medium">Rotate</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotate((r) => (r - 90) % 360)}
                  className="flex-1 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium hover:border-neutral-900 text-neutral-700"
                >
                  ↺ -90°
                </button>
                <button
                  type="button"
                  onClick={() => setRotate((r) => (r + 90) % 360)}
                  className="flex-1 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium hover:border-neutral-900 text-neutral-700"
                >
                  ↻ +90°
                </button>
                <button
                  type="button"
                  onClick={() => { setRotate(0); setZoom(1); }}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium hover:border-neutral-900 text-neutral-700"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Interactive Crop Canvas */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Interactive Signature Crop
            </h3>
            <span className="text-xs font-mono text-neutral-500">
              Aspect Ratio: {requirement.width} × {requirement.height} px
            </span>
          </div>

          <div className="relative min-h-[300px] md:min-h-[360px] bg-neutral-100 border border-neutral-200 rounded-xl overflow-hidden flex items-center justify-center p-4">
            {image && cropPercent && file ? (
              <div className="max-w-full max-h-[400px]">
                <ReactCrop
                  crop={cropPercent}
                  onChange={(c, pc) => setCropPercent(pc)}
                  onComplete={handleCropComplete}
                  aspect={requirement.width / requirement.height}
                  keepSelection
                >
                  <img
                    ref={imgRef}
                    src={URL.createObjectURL(file)}
                    alt="Signature crop input"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '360px',
                      transform: `scale(${zoom}) rotate(${rotate}deg)`,
                      transition: 'transform 100ms ease-out',
                    }}
                  />
                </ReactCrop>
              </div>
            ) : (
              <div className="text-center p-8 text-neutral-400">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-neutral-200/60 flex items-center justify-center text-neutral-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-neutral-700">No signature uploaded</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Upload a scanned signature or phone photo on plain white paper.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-600 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200 font-mono">
            <span>{requirement.width} × {requirement.height} px</span>
            <span>{result ? `${result.fileSizeKB} KB` : '– KB'}</span>
            <span className="uppercase font-semibold">{format}</span>
          </div>

          {additionalInstructions && (
            <p className="text-xs text-neutral-500 bg-neutral-50/70 p-3 rounded-lg border border-neutral-200">
              <strong>Official Note:</strong> {additionalInstructions}
            </p>
          )}
        </div>
      </div>

      {/* 3. VALIDATION & DOWNLOAD */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Validate & Download</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-2">
                <span className={`text-sm ${result?.validation.dimensions ? 'text-teal-600' : 'text-neutral-400'}`}>✓</span>
                <div>
                  <div className="text-[10px] text-neutral-500 font-medium">Dimensions</div>
                  <div className="text-xs font-bold text-neutral-900 font-mono">{requirement.width} × {requirement.height} px</div>
                  <div className="text-[9px] text-teal-600 font-medium">Matches spec</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-2">
                <span className={`text-sm ${result?.validation.fileSize ? 'text-teal-600' : 'text-amber-500'}`}>
                  {result?.validation.fileSize ? '✓' : '•'}
                </span>
                <div>
                  <div className="text-[10px] text-neutral-500 font-medium">File size</div>
                  <div className="text-xs font-bold text-neutral-900 font-mono">
                    {result ? `${result.fileSizeKB} KB` : `${requirement.minKB}–${requirement.maxKB} KB`}
                  </div>
                  <div className="text-[9px] text-teal-600 font-medium">
                    {result?.validation.fileSize ? 'Within range' : 'Pending upload'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-start gap-2">
                <span className={`text-sm ${result?.validation.format ? 'text-teal-600' : 'text-neutral-400'}`}>✓</span>
                <div>
                  <div className="text-[10px] text-neutral-500 font-medium">Format</div>
                  <div className="text-xs font-bold text-neutral-900 uppercase font-mono">{format}</div>
                  <div className="text-[9px] text-teal-600 font-medium">Valid output</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!result || !result.validation.overall}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-neutral-950 text-white font-bold text-sm shadow-md hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Signature</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}