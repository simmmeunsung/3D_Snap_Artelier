'use client';

import { useState } from 'react';
import Upload from '../components/Upload';
import DynamicGallery from '../components/DynamicGallery'; // DynamicGallery import 추가

export default function Page2() {
  const [modelUrls, setModelUrls] = useState<string[]>([]);
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');

  const handleImageUpload = (modelUrl: string, backgroundUrl: string) => {
    setModelUrls(prev => [...prev, modelUrl]);
    setBackgroundUrl(backgroundUrl);
  };

  const handleBackgroundUpload = (backgroundUrl: string) => {
    setBackgroundUrl(backgroundUrl);
  };

  return (
    <div className="container page2-container min-h-screen">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg min-h-screen"> {/* min-h-screen 추가 */}
        <div className="w-full space-y-2"> {/* space-y-2를 space-y-20으로 변경 */}
          <section className="pt-2 rounded-xl">
           
            <Upload onImageUpload={handleImageUpload} onBackgroundUpload={handleBackgroundUpload} />
          </section>

          {modelUrls.length > 0 && (
            <section className="rounded-xl"> {/* 여러 마진 추가 */}
              <div className="mb-20"> {/* 추가 마진 */}
                <DynamicGallery 
                  modelUrls={modelUrls}
                  backgroundUrl={backgroundUrl}
                />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}