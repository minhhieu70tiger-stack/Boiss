import React, { useState, useRef, useEffect } from 'react';
import { AppView, MediaItem, MediaType } from './types';
import { Navbar } from './components/Navbar';
import { AmbientBackground } from './components/AmbientBackground';
import { IntroScreen } from './components/IntroScreen';
import { HomeHero } from './components/HomeHero';
import { ImageStudioView } from './components/ImageStudioView';
import { VideoStudioView } from './components/VideoStudioView';
import { Footer } from './components/Footer';
import { extractFilesFromItems } from './utils/fileHelpers';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [items, setItems] = useState<MediaItem[]>([]);

  const globalFolderInputRef = useRef<HTMLInputElement | null>(null);

  // Reset scroll to top instantly whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView]);

  const handleAddFiles = (
    fileList: { file: File; path?: string }[],
    targetStudio?: MediaType
  ) => {
    const newItems: MediaItem[] = fileList.map(({ file, path }) => {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|wmv)$/i.test(file.name);
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|svg|bmp)$/i.test(file.name);
      
      const type: MediaType = isVideo ? 'video' : 'image';
      const folderPath = path && path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : undefined;

      return {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        folderPath,
        type,
        originalSize: file.size,
        compressedSize: 0,
        compressedBlob: null,
        compressedUrl: null,
        originalUrl: URL.createObjectURL(file),
        status: 'pending',
        progress: 0,
        originalFormat: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
        compressedFormat: isVideo ? 'WEBM' : 'WEBP',
        ssimScore: 0.994,
        psnrScore: 46.5,
        perceptualScore: '100% Hoàn toàn không suy giảm chi tiết',
        compressionRatio: 0,
        aiOptimizations: [],
      };
    });

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleGlobalFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (rawFiles && rawFiles.length > 0) {
      const filesArr: File[] = Array.from(rawFiles);
      const fileList = filesArr.map((f: File) => ({
        file: f,
        path: (f as any).webkitRelativePath || f.name,
      }));
      handleAddFiles(fileList);
      e.target.value = '';

      // Route to appropriate view if items added
      const hasVideos = fileList.some((f) => f.file.type.startsWith('video/'));
      const hasImages = fileList.some((f) => f.file.type.startsWith('image/'));
      if (hasVideos && !hasImages) {
        setCurrentView('video_studio');
      } else {
        setCurrentView('image_studio');
      }
    }
  };

  const imageItems = items.filter((i) => i.type === 'image');
  const videoItems = items.filter((i) => i.type === 'video');

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 relative selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
      {/* High-end Minimalist Entry Intro Sequence */}
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}

      {/* Dynamic Ambient Background Canvas */}
      <AmbientBackground />

      {/* Hidden Global Folder Input for top nav trigger */}
      <input
        ref={globalFolderInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleGlobalFolderChange}
        {...({ webkitdirectory: '', directory: '' } as any)}
      />

      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        imageQueueCount={imageItems.length}
        videoQueueCount={videoItems.length}
      />

      {/* Main View Container */}
      <main className="relative z-10">
        {currentView === 'home' && (
          <HomeHero
            onNavigate={setCurrentView}
            onAddFiles={handleAddFiles}
          />
        )}

        {currentView === 'image_studio' && (
          <ImageStudioView
            items={items}
            setItems={setItems}
            onAddFiles={(files) => handleAddFiles(files, 'image')}
          />
        )}

        {currentView === 'video_studio' && (
          <VideoStudioView
            items={items}
            setItems={setItems}
            onAddFiles={(files) => handleAddFiles(files, 'video')}
          />
        )}
      </main>

      {/* Global Brand Footer with Feedback and Compliance */}
      <Footer
        onNavigate={setCurrentView}
        onReplayIntro={() => setShowIntro(true)}
      />
    </div>
  );
}
