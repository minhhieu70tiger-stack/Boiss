import React, { useRef, useState } from 'react';
import { UploadCloud, FileImage, FolderUp, Check } from 'lucide-react';
import { extractFilesFromItems } from '../utils/fileHelpers';
import { MediaType } from '../types';

interface DropzoneFolderProps {
  onFilesAdded: (files: { file: File; path?: string }[], targetStudio?: MediaType) => void;
  acceptType?: 'all' | 'image' | 'video';
  title?: string;
  subtitle?: string;
  isCompact?: boolean;
}

export const DropzoneFolder: React.FC<DropzoneFolderProps> = ({
  onFilesAdded,
  acceptType = 'all',
  title = 'Kéo thả thư mục hoặc file vào đây',
  subtitle = 'Hỗ trợ định dạng Ảnh (PNG, JPG, WebP, AVIF, SVG) và Video (MP4, WebM, MOV, MKV)',
  isCompact = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const extracted = await extractFilesFromItems(e.dataTransfer.items);
      if (extracted.length > 0) {
        onFilesAdded(extracted);
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const rawFiles: File[] = Array.from(e.dataTransfer.files);
      const fileList = rawFiles.map((f: File) => ({ file: f, path: f.name }));
      onFilesAdded(fileList);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (rawFiles && rawFiles.length > 0) {
      const filesArr: File[] = Array.from(rawFiles);
      const fileList = filesArr.map((f: File) => ({ file: f, path: f.name }));
      onFilesAdded(fileList);
      e.target.value = '';
    }
  };

  const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (rawFiles && rawFiles.length > 0) {
      const filesArr: File[] = Array.from(rawFiles);
      const fileList = filesArr.map((f: File) => ({
        file: f,
        path: (f as any).webkitRelativePath || f.name,
      }));
      onFilesAdded(fileList);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Hidden File & Folder Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={
          acceptType === 'image'
            ? 'image/*'
            : acceptType === 'video'
            ? 'video/*'
            : 'image/*,video/*'
        }
        className="hidden"
        onChange={handleFileInputChange}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFolderInputChange}
        {...({ webkitdirectory: '', directory: '' } as any)}
      />

      {/* Main Drag-Drop Target */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden ${
          isDragOver
            ? 'border-violet-500/50 bg-violet-950/10 scale-[1.005] shadow-2xl shadow-violet-500/10'
            : 'border-zinc-800 hover:border-violet-500/30 bg-[#0D0D0E] hover:bg-[#111112]'
        } ${isCompact ? 'p-6 py-8' : 'p-8 sm:p-12'}`}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Glow ambient background aura on drag */}
        {isDragOver && (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-violet-500/10 animate-pulse pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto gap-3">
          {/* Icon Badge */}
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center shadow-inner group">
            <UploadCloud className={`w-5 h-5 transition-transform duration-300 ${isDragOver ? 'scale-125 text-violet-400' : 'text-zinc-400 group-hover:scale-110'}`} />
          </div>

          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-light text-white">
              {title}
            </h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Action buttons */}
          <div
            className="flex items-center flex-wrap justify-center gap-3 pt-2 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-sm font-semibold tracking-wide shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer w-full min-[480px]:w-auto"
            >
              <FileImage className="w-4 h-4 shrink-0" />
              <span>Bấm Vào Đây Để Chọn Ảnh</span>
            </button>

            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 rounded-2xl text-sm font-medium tracking-wide transition-all hover:scale-[1.02] active:scale-95 cursor-pointer w-full min-[480px]:w-auto"
            >
              <FolderUp className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>Chọn Cả Thư Mục Ảnh</span>
            </button>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6 text-xs text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Chọn được nhiều ảnh cùng lúc
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> An toàn 100% trên máy của bạn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
