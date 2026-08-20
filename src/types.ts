export type AppView = 'home' | 'image_studio' | 'video_studio';

export type MediaType = 'image' | 'video';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface MediaItem {
  id: string;
  file: File;
  name: string;
  folderPath?: string;
  type: MediaType;
  originalSize: number;
  compressedSize: number;
  compressedBlob: Blob | null;
  compressedUrl: string | null;
  originalUrl: string;
  status: ProcessingStatus;
  progress: number;
  errorMessage?: string;
  
  // Visual & Quality Metrics
  originalDimensions?: { width: number; height: number };
  compressedDimensions?: { width: number; height: number };
  originalFormat: string;
  compressedFormat: string;
  ssimScore: number; // Structural Similarity Index (0 to 1, e.g. 0.994)
  psnrScore: number; // Peak Signal-to-Noise Ratio (in dB, e.g. 46.5)
  perceptualScore: string; // e.g. "99.8% Chuẩn mắt nhìn"
  compressionRatio: number; // e.g. 74.5 (%)
  
  // Video specific
  duration?: number; // in seconds
  fps?: number;
  audioBitrate?: string;
  encodingDetails?: {
    codec: string;
    crf: number;
    preset: string;
    tune: string;
    motionComplexity: 'high' | 'medium' | 'low';
    sceneChangesCount?: number;
    twoPassApplied?: boolean;
  };
  
  // AI metadata
  aiOptimizations: string[];
  processedAt?: Date;
}

export type ImageMode = 'ai_auto' | 'lossless_balanced' | 'ultra_compress' | 'pixel_perfect' | 'custom';

export type EnhancePreset =
  | 'ai_smart_clarity'
  | 'deblur_restore'
  | 'portrait_micro_detail'
  | 'text_document_sharp'
  | 'super_resolution_2x'
  | 'super_resolution_4x'
  | 'custom';

export interface EnhanceSettings {
  enabled: boolean;
  preset: EnhancePreset;
  sharpness: number; // 0 to 200 (Default 120%)
  clarity: number; // 0 to 100 (Micro-contrast / CLAHE, Default 60%)
  deblurStrength: number; // 0 to 100 (Deblur & edge recovery, Default 50%)
  denoise: number; // 0 to 100 (Default 25%)
  vibrance: number; // -50 to 50 (Default 12%)
  upscaleFactor: 1 | 2 | 4; // 1x (Original), 2x HD, 4x Ultra-HD
}

export type ImageStudioTab = 'compress' | 'enhance' | 'both';

export interface ImageSettings {
  activeTab?: ImageStudioTab;
  mode: ImageMode;
  targetFormat: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  quality: number; // 0.1 to 1.0 (for custom or base)
  maxWidth: number; // 0 for original
  maxHeight: number; // 0 for original
  preserveExif: boolean;
  smartDither: boolean;
  smartSharpen: boolean;
  aiPerceptualCutoff: boolean;
  enhancement: EnhanceSettings;
}

export type VideoMode = 'ai_auto' | 'cinema_smooth' | 'web_fast' | 'social_discord' | 'custom';

export interface VideoSettings {
  mode: VideoMode;
  targetResolution: 'original' | '4k' | '2k' | '1080p' | '720p' | '480p';
  crfLevel: number; // 18 to 32
  frameRate: 'original' | '60' | '30' | '24';
  audioBitrate: 'original' | '192k' | '128k' | '64k' | 'mute';
  format: 'webm' | 'mp4';
  targetSizeMB?: number; // e.g. 8MB for Discord/Email
}

export interface CompressionSummaryStats {
  totalOriginalBytes: number;
  totalCompressedBytes: number;
  totalSavedBytes: number;
  averageSavingsPercent: number;
  totalFilesProcessed: number;
  averageSsim: number;
  averagePsnr: number;
}
