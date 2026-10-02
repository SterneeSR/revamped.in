'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { GeometricAccent } from '@/components/geometric/GeometricAccent';
import { processImage, type ImageRequirement, type ProcessedImageResult, type CropData, getDefaultCrop, loadImage } from '@/lib/image-processing';
import ReactCrop from 'react-image-crop';

interface PhotoToolProps {
  requirement: ImageRequirement;
  examName: string;
  appName: string;
}

const formatOptions = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
] as const;

export function PhotoTool({ requirement, examName, appName }: PhotoToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<CropData | null>(null);
  const [cropPercent, setCropPercent] = useState<CropData | null>(null);
  const [zoom, setZoom] = useState(1);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'crop' | 'result'>('upload');
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle file upload
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 20MB for upload)
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20 MB');
      return;
    }

    setError(null);
    setFile(selectedFile);
    
    try {
      const loadedImage = await loadImage(selectedFile);
      setImage(loadedImage);
      
      // Calculate default crop to fill target dimensions
      const defaultCrop = getDefaultCrop(loadedImage, requirement.width, requirement.height);
      setCrop(defaultCrop);
      
      // Convert to percent for react-image-crop
      setCropPercent({
        x: (defaultCrop.x / loadedImage.width) * 100,
        y: (defaultCrop.y / loadedImage.height) * 100,
        width: (defaultCrop.width / loadedImage.width) * 100,
        height: (defaultCrop.height / loadedImage.height) * 100,
      });
      
      setStep('crop');
      setResult(null);
    } catch {
      setError('Failed to load image. Please try another file.');
    }
  }, [requirement.width, requirement.height]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  }, [handleFileChange]);

  // Handle crop change
  const handleCropChange = useCallback((newCrop: CropData) => {
    setCropPercent(newCrop);
    if (image) {
      setCrop({
        x: (newCrop.x / 100) * image.width,
        y: (newCrop.y / 100) * image.height,
        width: (newCrop.width / 100) * image.width,
        height: (newCrop.height / 100) * image.height,
      });
    }
  }, [image]);

  // Handle crop complete
  const handleCropComplete = useCallback((newCrop: CropData, percentCrop: CropData) => {
    setCropPercent(percentCrop);
    if (image) {
      setCrop({
        x: (percentCrop.x / 100) * image.width,
        y: (percentCrop.y / 100) * image.height,
        width: (percentCrop.width / 100) * image.width,
        height: (percentCrop.height / 100) * image.height,
      });
    }
  }, [image]);

  // Process image
  const handleProcess = useCallback(async () => {
    if (!image || !crop) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const processed = await processImage(image, crop, {
        ...requirement,
        format,
      }, name || undefined, date || undefined);
      
      setResult(processed);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setProcessing(false);
    }
  }, [image, crop, requirement, format, name, date]);

  // Download result
  const handleDownload = useCallback(() => {
    if (!result) return;
    
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${examName.toLowerCase().replace(/\s+/g, '-')}-${appName.toLowerCase().replace(/\s+/g, '-')}-photo.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, examName, appName, format]);

  // Reset tool
  const handleReset = useCallback(() => {
    setFile(null);
    setImage(null);
    setCrop(null);
    setCropPercent(null);
    setZoom(1);
    setName('');
    setDate('');
    setResult(null);
    setError(null);
    setStep('upload');
    if (imgRef.current) {
      imgRef.current.src = '';
    }
  }, []);

  // Format date as DD/MM/YYYY
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (value.length >= 2) {
      formatted = value.slice(0, 2);
      if (value.length >= 4) {
        formatted += '/' + value.slice(2, 4);
        if (value.length >= 8) {
          formatted += '/' + value.slice(4, 8);
        }
      }
    } else {
      formatted = value;
    }
    setDate(formatted);
  }, []);

  if (step === 'upload') {
    return (
      <div className="card p-6 md:p-8">
        <div
          className="border-2 border-dashed border-charcoal-200 rounded-xl p-8 md:p-12 text-center hover:border-charcoal-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            id="photo-upload"
            aria-label="Upload photograph"
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-charcoal-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Upload Photograph</h3>
            <p className="text-charcoal-600 text-sm mb-4">
              Drag and drop or click to select<br />
              <span className="text-xs">JPG, PNG up to 20 MB</span>
            </p>
            <p className="text-xs text-charcoal-400">
              Your image is processed in your browser and never uploaded to our servers.
            </p>
          </label>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (step === 'crop') {
    return (
      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-charcoal-200 p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="zoom" className="text-sm font-medium text-charcoal-700">Zoom</label>
            <input
              id="zoom"
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-32 h-2 accent-charcoal-900"
              aria-label="Zoom level"
            />
            <span className="text-sm text-charcoal-500 w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-charcoal-700">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png')}
              className="input-field py-1.5 px-3 text-sm w-auto"
            >
              {formatOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cropper */}
        <div className="relative bg-charcoal-100 min-h-[400px] flex items-center justify-center p-4">
          {image && cropPercent && (
            <div className="max-w-full max-h-[60vh]">
              <ReactCrop
                src={imgRef.current?.src || URL.createObjectURL(file!)}
                crop={cropPercent}
                onChange={handleCropChange}
                onComplete={handleCropComplete}
                aspect={requirement.width / requirement.height}
                minSize={[50, 50]}
                zoom={zoom}
                ruleOfThirds
                circularCrop={false}
                keepSelection
              >
              <img
                ref={imgRef}
                src={URL.createObjectURL(file!)}
                alt="Photo preview for cropping"
                style={{ maxWidth: '100%', maxHeight: '60vh', transform: `scale(${zoom})` }}
              />
            </ReactCrop>
          </div>
          )}
        </div>

        {/* Name/Date Fields */}
        {(requirement.nameRequired || requirement.dateRequired) && (
          <div className="border-t border-charcoal-200 p-4 bg-charcoal-50">
            <h4 className="font-medium text-charcoal-900 mb-3">Required Overlays</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {requirement.nameRequired && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal-700 mb-1">
                    Name <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Full name as per application"
                    maxLength={100}
                    required
                  />
                </div>
              )}
              {requirement.dateRequired && (
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-charcoal-700 mb-1">
                    Date <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="date"
                    type="text"
                    value={date}
                    onChange={handleDateChange}
                    className="input-field"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    required
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 border-t border-charcoal-200 flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" onClick={handleReset}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </Button>
          <Button onClick={handleProcess} loading={processing} className="ml-auto">
            Process & Validate
          </Button>
        </div>

        {error && (
          <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Result step
  if (step === 'result' && result) {
    const { validation } = result;
    
    return (
      <div className="card overflow-hidden">
        {/* Result Preview */}
        <div className="bg-charcoal-100 p-4 flex items-center justify-center">
          <img
            src={result.dataUrl}
            alt="Processed photograph preview"
            className="max-w-full max-h-64 border border-charcoal-200 bg-white"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Validation Results */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-charcoal-900">Validation Results</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${validation.overall ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {validation.overall ? '✓ READY TO DOWNLOAD' : '✗ ISSUES FOUND'}
            </div>
          </div>

          <dl className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-charcoal-50 rounded-lg">
              <dt className="flex items-center gap-2 text-sm text-charcoal-700">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${validation.dimensions ? 'bg-green-500' : 'bg-red-500'}`}>
                  {validation.dimensions ? (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                </span>
                Dimensions
              </dt>
              <dd className="font-mono text-sm font-medium text-charcoal-900">
                {result.width} × {result.height} px
              </dd>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-charcoal-50 rounded-lg">
              <dt className="flex items-center gap-2 text-sm text-charcoal-700">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${validation.fileSize ? 'bg-green-500' : 'bg-red-500'}`}>
                  {validation.fileSize ? (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                </span>
                File Size
              </dt>
              <dd className={`font-mono text-sm font-medium ${validation.fileSize ? 'text-green-700' : 'text-red-700'}`}>
                {result.fileSizeKB} KB (required: {requirement.minKB}–{requirement.maxKB} KB)
              </dd>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-charcoal-50 rounded-lg">
              <dt className="flex items-center gap-2 text-sm text-charcoal-700">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center ${validation.format ? 'bg-green-500' : 'bg-red-500'}`}>
                  {validation.format ? (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                </span>
                Format
              </dt>
              <dd className="font-mono text-sm font-medium text-charcoal-900">
                {result.format}
              </dd>
            </div>
            
            {requirement.nameRequired && (
              <div className="flex items-center justify-between p-3 bg-charcoal-50 rounded-lg">
                <dt className="flex items-center gap-2 text-sm text-charcoal-700">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${validation.name ? 'bg-green-500' : 'bg-red-500'}`}>
                    {validation.name ? (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </span>
                  Name Overlay
                </dt>
                <dd className={`font-mono text-sm font-medium ${validation.name ? 'text-green-700' : 'text-red-700'}`}>
                  {validation.name ? 'Included' : 'Missing'}
                </dd>
              </div>
            )}
            
            {requirement.dateRequired && (
              <div className="flex items-center justify-between p-3 bg-charcoal-50 rounded-lg">
                <dt className="flex items-center gap-2 text-sm text-charcoal-700">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${validation.date ? 'bg-green-500' : 'bg-red-500'}`}>
                    {validation.date ? (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </span>
                  Date Overlay
                </dt>
                <dd className={`font-mono text-sm font-medium ${validation.date ? 'text-green-700' : 'text-red-700'}`}>
                  {validation.date ? 'Included' : 'Missing'}
                </dd>
              </div>
            )}
          </dl>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleDownload} disabled={!validation.overall} className="flex-1 sm:flex-none">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download {result.format}
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start Over
            </Button>
          </div>

          {!validation.overall && (
            <p className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">
              <strong>Unable to meet requirements:</strong> {validation.errors.join('. ')}
              {result.fileSizeKB > requirement.maxKB && ' Try retaking the photo with a plain background for better compression.'}
            </p>
          )}

          <p className="mt-4 text-xs text-charcoal-500 text-center">
            Matches the configured requirements. Always verify with the official notification before submitting.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

const fileInputRef = { current: null as HTMLInputElement | null };