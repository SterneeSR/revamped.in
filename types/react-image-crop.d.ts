declare module 'react-image-crop' {
  import { ComponentType, CSSProperties, RefObject } from 'react';

  export interface Crop {
    x: number;
    y: number;
    width: number;
    height: number;
    unit?: 'px' | '%';
  }

  export interface ReactCropProps {
    src: string;
    crop?: Crop;
    onChange?: (crop: Crop, percentCrop: Crop) => void;
    onComplete?: (crop: Crop, percentCrop: Crop) => void;
    aspect?: number;
    minSize?: [number, number];
    maxSize?: [number, number];
    zoom?: number;
    zoomSpeed?: number;
    rotation?: number;
    crosshair?: boolean;
    circularCrop?: boolean;
    keepSelection?: boolean;
    disabled?: boolean;
    ruleOfThirds?: boolean;
    style?: CSSProperties;
    imageStyle?: CSSProperties;
    children?: React.ReactNode;
    classes?: {
      container?: string;
      cropArea?: string;
      cropSelection?: string;
      handle?: string;
    };
  }

  export interface ReactCropHandle {
    refCrop: () => void;
  }

  const ReactCrop: ComponentType<ReactCropProps>;
  export default ReactCrop;
}