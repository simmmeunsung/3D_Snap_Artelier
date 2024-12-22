'use client';

export default function Page1() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl bg-white/90 p-8 rounded-xl shadow-lg mx-4">
        <h1 className="text-4xl font-bold mb-10 text-center">3D-Snap Artelier</h1>
        <div className="w-full space-y-8">
          <section className="p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              : Craft your perfect scene
            </h2>
             {/* 둥둥 떠다니는 애니메이션을 적용한 h2 */}
            <h2 className="text-2xl font-semibold mb-6 text-center floating">
              ↓원하는 3D 모델과 배경의 이미지를 업로드해보세요↓
            </h2>
          </section>
        </div>
      </main>
    </div>
  );
}