import JSZip from 'jszip';
import { MediaItem } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export async function extractFilesFromItems(dataTransferItemList: DataTransferItemList): Promise<{ file: File; path: string }[]> {
  const results: { file: File; path: string }[] = [];
  const entries: FileSystemEntry[] = [];

  for (let i = 0; i < dataTransferItemList.length; i++) {
    const item = dataTransferItemList[i];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
      if (entry) {
        entries.push(entry);
      } else {
        const f = item.getAsFile();
        if (f) results.push({ file: f, path: f.name });
      }
    }
  }

  async function traverseEntry(entry: FileSystemEntry, currentPath: string) {
    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      await new Promise<void>((resolve) => {
        fileEntry.file((file) => {
          results.push({ file, path: `${currentPath}${file.name}` });
          resolve();
        }, () => resolve());
      });
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      const reader = dirEntry.createReader();
      const readEntries = (): Promise<FileSystemEntry[]> => {
        return new Promise((resolve) => {
          reader.readEntries((entries) => resolve(entries), () => resolve([]));
        });
      };

      let entriesList: FileSystemEntry[] = [];
      let batch: FileSystemEntry[] = [];
      do {
        batch = await readEntries();
        entriesList = entriesList.concat(batch);
      } while (batch.length > 0);

      for (const child of entriesList) {
        await traverseEntry(child, `${currentPath}${dirEntry.name}/`);
      }
    }
  }

  for (const entry of entries) {
    await traverseEntry(entry, '');
  }

  return results;
}

export async function createZipBundle(
  items: MediaItem[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.compressedBlob) {
      // Determine file extension and name
      const ext = item.compressedFormat || (item.type === 'image' ? 'webp' : 'webm');
      let baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
      const finalFileName = `${baseName}_boiscales.${ext}`;
      
      const targetPath = item.folderPath ? `${item.folderPath}/${finalFileName}` : finalFileName;
      zip.file(targetPath, item.compressedBlob);
    }
    if (onProgress) {
      onProgress(Math.round(((i + 1) / items.length) * 50));
    }
  }

  return await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(50 + Math.round(metadata.percent * 0.5));
    }
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// Generate realistic synthetic high-res test image for instant demo
export async function createSampleImage(title: string, theme: 'nature' | 'cyber' | 'portrait'): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;

  // Draw rich high frequency texture gradient
  const grad = ctx.createLinearGradient(0, 0, 1920, 1080);
  if (theme === 'nature') {
    grad.addColorStop(0, '#0d3b66');
    grad.addColorStop(0.5, '#00b4d8');
    grad.addColorStop(1, '#90e0ef');
  } else if (theme === 'cyber') {
    grad.addColorStop(0, '#10002b');
    grad.addColorStop(0.5, '#5a189a');
    grad.addColorStop(1, '#ff007f');
  } else {
    grad.addColorStop(0, '#1a1423');
    grad.addColorStop(0.5, '#3d314a');
    grad.addColorStop(1, '#f1c0e8');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1920, 1080);

  // Add complex high-frequency details (leaves/bokeh/waves) to test real compression
  for (let i = 0; i < 400; i++) {
    ctx.beginPath();
    const x = Math.random() * 1920;
    const y = Math.random() * 1080;
    const radius = Math.random() * 50 + 5;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, ${Math.random() * 0.3 + 0.05})`;
    ctx.fill();
  }

  // Draw grid & geometric pattern for sharp edge preservation testing
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1920; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1080);
    ctx.stroke();
  }
  for (let y = 0; y < 1080; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1920, y);
    ctx.stroke();
  }

  // Draw typographic centerpiece
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Plus Jakarta Sans, sans-serif';
  ctx.fillText(title, 100, 200);

  ctx.fillStyle = '#a5b4fc';
  ctx.font = '24px JetBrains Mono, monospace';
  ctx.fillText(`BOISCALES RAW SAMPLE • 1920x1080 • 24-BIT RGB • ${new Date().toLocaleDateString()}`, 100, 260);

  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
  return new File([blob], `${title.toLowerCase().replace(/\s+/g, '_')}_raw.png`, { type: 'image/png' });
}
