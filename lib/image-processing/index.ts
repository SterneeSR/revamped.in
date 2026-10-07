export interface ImagePosition {
  x?: number;
  y?: number;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  font_size?: number;
  color?: string;
}

export interface ImageRequirement {
  width: number;
  height: number;
  minKB: number;
  maxKB: number;
  format: 'jpeg' | 'png';
  nameRequired: boolean;
  dateRequired: boolean;
  namePosition?: ImagePosition | null;
  datePosition?: ImagePosition | null;
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
  
  // Draw bottom white banner for Name & Date if required (standard Indian exam format like TNPSC/SSC)
  if ((requirement.nameRequired && name) || (requirement.dateRequired && date)) {
    const bannerHeight = Math.max(26, Math.round(requirement.height * 0.22));
    const bannerY = requirement.height - bannerHeight;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, bannerY, requirement.width, bannerHeight);

    // Optional subtle divider line
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bannerY);
    ctx.lineTo(requirement.width, bannerY);
    ctx.stroke();

    const fontSize = Math.max(9, Math.round(bannerHeight * 0.36));
    ctx.font = `600 ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (requirement.nameRequired && name && requirement.dateRequired && date) {
      // Both name and date
      ctx.fillText(name.toUpperCase(), requirement.width / 2, bannerY + bannerHeight * 0.32);
      ctx.font = `500 ${Math.max(8, fontSize - 1)}px Arial, sans-serif`;
      ctx.fillText(date, requirement.width / 2, bannerY + bannerHeight * 0.72);
    } else if (requirement.nameRequired && name) {
      ctx.fillText(name.toUpperCase(), requirement.width / 2, bannerY + bannerHeight * 0.5);
    } else if (requirement.dateRequired && date) {
      ctx.fillText(date, requirement.width / 2, bannerY + bannerHeight * 0.5);
    }
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
  
  // Binary search quality for optimal file size matching target range
  let low = 0.05;
  let high = 0.98;
  let bestBlob: Blob | null = null;
  let minDiff = Infinity;

  for (let i = 0; i < 15; i++) {
    const midQuality = (low + high) / 2;
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), format, midQuality);
    });

    if (!blob) break;

    const size = blob.size;
    
    // Check if within bounds
    if (size >= targetMin && size <= targetMax) {
      return blob;
    }

    // Keep track of closest blob to target range
    const diff = size < targetMin ? targetMin - size : size - targetMax;
    if (diff < minDiff) {
      minDiff = diff;
      bestBlob = blob;
    }

    if (size > targetMax) {
      high = midQuality;
    } else {
      low = midQuality;
    }
  }

  // If even at highest quality mid is still smaller than targetMin, return highest quality
  if (bestBlob) {
    return bestBlob;
  }

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), format, 0.9);
  });
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