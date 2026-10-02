export interface ImageRequirement {
  width: number;
  height: number;
  minKB: number;
  maxKB: number;
  format: 'jpeg' | 'png';
  nameRequired: boolean;
  dateRequired: boolean;
  namePosition?: {
    x: number;
    y: number;
    align: 'left' | 'center' | 'right';
    fontSize: number;
    color: string;
  };
  datePosition?: {
    x: number;
    y: number;
    align: 'left' | 'center' | 'right';
    fontSize: number;
    color: string;
  };
}

export interface ProcessedImageResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  fileSizeKB: number;
  format: string;
  validation: ValidationResult;
}

export interface ValidationResult {
  dimensions: boolean;
  fileSize: boolean;
  format: boolean;
  name: boolean;
  date: boolean;
  overall: boolean;
  errors: string[];
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
  };
}

export function calculateAspectRatioFill(
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number
): { width: number; height: number; x: number; y: number } {
  const srcRatio = srcWidth / srcHeight;
  const targetRatio = targetWidth / targetHeight;
  
  let width, height, x, y;
  
  if (srcRatio > targetRatio) {
    // Source is wider - fit height, crop width
    height = targetHeight;
    width = srcWidth * (targetHeight / srcHeight);
    x = (targetWidth - width) / 2;
    y = 0;
  } else {
    // Source is taller - fit width, crop height
    width = targetWidth;
    height = srcHeight * (targetWidth / srcWidth);
    x = 0;
    y = (targetHeight - height) / 2;
  }
  
  return { width, height, x, y };
}

export async function processImage(
  image: HTMLImageElement,
  crop: CropData,
  requirement: ImageRequirement,
  name?: string,
  date?: string
): Promise<ProcessedImageResult> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set canvas to target dimensions
  canvas.width = requirement.width;
  canvas.height = requirement.height;
  
  // Fill with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, requirement.width, requirement.height);
  
  // Draw cropped and resized image
  ctx.drawImage(
    image,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, requirement.width, requirement.height
  );
  
  // Add name overlay if required
  if (requirement.nameRequired && name && requirement.namePosition) {
    const pos = requirement.namePosition;
    ctx.font = `${pos.fontSize}px Arial, sans-serif`;
    ctx.fillStyle = pos.color;
    ctx.textAlign = pos.align;
    ctx.textBaseline = 'top';
    
    let x = pos.x;
    if (pos.align === 'center') x = requirement.width / 2;
    else if (pos.align === 'right') x = requirement.width - pos.x;
    
    ctx.fillText(name, x, pos.y);
  }
  
  // Add date overlay if required
  if (requirement.dateRequired && date && requirement.datePosition) {
    const pos = requirement.datePosition;
    ctx.font = `${pos.fontSize}px Arial, sans-serif`;
    ctx.fillStyle = pos.color;
    ctx.textAlign = pos.align;
    ctx.textBaseline = 'top';
    
    let x = pos.x;
    if (pos.align === 'center') x = requirement.width / 2;
    else if (pos.align === 'right') x = requirement.width - pos.x;
    
    ctx.fillText(date, x, pos.y);
  }
  
  // Convert to blob with compression
  const blob = await compressToTargetSize(canvas, requirement);
  const dataUrl = canvas.toDataURL(`image/${requirement.format}`, 0.9);
  
  // Validate
  const validation = validateResult(blob, requirement, name, date);
  
  return {
    blob,
    dataUrl,
    width: requirement.width,
    height: requirement.height,
    fileSizeKB: Math.round(blob.size / 1024),
    format: requirement.format.toUpperCase(),
    validation,
  };
}

async function compressToTargetSize(
  canvas: HTMLCanvasElement,
  requirement: ImageRequirement
): Promise<Blob> {
  const targetMin = requirement.minKB * 1024;
  const targetMax = requirement.maxKB * 1024;
  const format = `image/${requirement.format}`;
  
  // Start with high quality
  let quality = 0.9;
  let blob: Blob;
  let attempts = 0;
  const maxAttempts = 20;
  
  do {
    blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), format, quality);
    });
    
    const size = blob.size;
    
    if (size >= targetMin && size <= targetMax) {
      return blob;
    }
    
    if (size > targetMax) {
      // Too large - reduce quality
      quality *= 0.85;
    } else if (size < targetMin) {
      // Too small - increase quality (but cap at 0.95)
      quality = Math.min(quality * 1.15, 0.95);
    }
    
    attempts++;
  } while (attempts < maxAttempts);
  
  // If we couldn't hit the target, return the closest
  return blob!;
}

function validateResult(
  blob: Blob,
  requirement: ImageRequirement,
  name?: string,
  date?: string
): ValidationResult {
  const errors: string[] = [];
  
  // File size validation
  const sizeKB = blob.size / 1024;
  const fileSizeValid = sizeKB >= requirement.minKB && sizeKB <= requirement.maxKB;
  if (!fileSizeValid) {
    errors.push(`File size ${Math.round(sizeKB)} KB is outside required range (${requirement.minKB}–${requirement.maxKB} KB)`);
  }
  
  // Format validation
  const formatValid = blob.type === `image/${requirement.format}`;
  if (!formatValid) {
    errors.push(`Format is ${blob.type}, expected image/${requirement.format}`);
  }
  
  // Name validation
  const nameValid = !requirement.nameRequired || Boolean(name && name.trim().length > 0);
  if (!nameValid) {
    errors.push('Name is required but not provided');
  }
  
  // Date validation
  const dateValid = !requirement.dateRequired || Boolean(date && date.trim().length > 0);
  if (!dateValid) {
    errors.push('Date is required but not provided');
  }
  
  // Dimensions are always valid since we enforce them
  const dimensionsValid = true;
  
  return {
    dimensions: dimensionsValid,
    fileSize: fileSizeValid,
    format: formatValid,
    name: nameValid,
    date: dateValid,
    overall: dimensionsValid && fileSizeValid && formatValid && nameValid && dateValid,
    errors,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function getDefaultCrop(image: HTMLImageElement, targetWidth: number, targetHeight: number): CropData {
  const { width, height, x, y } = calculateAspectRatioFill(
    image.width,
    image.height,
    targetWidth,
    targetHeight
  );
  
  // Convert back to source coordinates
  const scaleX = image.width / width;
  const scaleY = image.height / height;
  
  return {
    x: Math.round(-x * scaleX),
    y: Math.round(-y * scaleY),
    width: Math.round(targetWidth * scaleX),
    height: Math.round(targetHeight * scaleY),
  };
}