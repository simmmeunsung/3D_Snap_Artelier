import { useState } from 'react';
import { convertImageTo3D } from '@/lib/stableFast3D';

interface UploadProps {
  onImageUpload: (modelUrl: string, backgroundUrl: string) => void;
  onBackgroundUpload: (backgroundUrl: string) => void;
}

export default function Upload({ onImageUpload, onBackgroundUpload }: UploadProps) {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsModelLoading(true);

      const glbBlob = await convertImageTo3D(file, {
        textureResolution: '512',
        foregroundRatio: 0.85
      });

      const modelUrl = URL.createObjectURL(glbBlob);
      onImageUpload(modelUrl, backgroundUrl || '');
    } catch (error) {
      console.error('3D 변환 실패:', error);
      alert('파일의 크기가 너무 큽니다.');
    } finally {
      setIsModelLoading(false);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBackgroundLoading(true);

    const backgroundUrl = URL.createObjectURL(file);
    setBackgroundUrl(backgroundUrl);
    onBackgroundUpload(backgroundUrl);

    setIsBackgroundLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
      {/* 모델 이미지 업로드 */}
      <label className="file-input-wrapper">
        <span className="custom-file-input">
          {isModelLoading ? '모델 변환 중...' : '모델 이미지 선택하기'}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isModelLoading}
          style={{ visibility: 'hidden', position: 'absolute' }}
        />
      </label>

      {/* 배경 이미지 업로드 */}
      <label className="file-input-wrapper">
        <span className="custom-file-input">
          {isBackgroundLoading ? '배경 업로드 중...' : '배경 이미지 선택하기'}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleBackgroundUpload}
          disabled={isBackgroundLoading}
          style={{ visibility: 'hidden', position: 'absolute' }}
        />
      </label>
    </div>
  );
}
