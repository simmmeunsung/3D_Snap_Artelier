'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import '../gallery.css';


interface LightPosition {
  x: number;
  y: number;
  z: number;
}

interface LightProperties {
  position: LightPosition;
  intensity: number;
  angle: number;
  color: string;  // HTML 색상 값 (#RRGGBB)
}

interface GalleryProps {
  modelUrls: string[];
  backgroundUrl: string;
  brightness?: number;
}

export default function DynamicGallery({ 
  modelUrls, 
  backgroundUrl,
  brightness = 1.0
}: GalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const spotLight1Ref = useRef<THREE.SpotLight | null>(null);
  const spotLight2Ref = useRef<THREE.SpotLight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 조명 속성 상태 관리
  const [spotLight1Props, setSpotLight1Props] = useState<LightProperties>({
    position: { x: 2, y: 3, z: 2 },
    intensity: 0.5,
    angle: 30,  // 각도를 degree로 저장
    color: '#ffffff'
  });

  const [spotLight2Props, setSpotLight2Props] = useState<LightProperties>({
    position: { x: -2, y: 1, z: -2 },
    intensity: 0.3,
    angle: 22.5,  // 각도를 degree로 저장
    color: '#ffffff'
  });

  // 조명 업데이트 함수
  const updateSpotLight1 = () => {
    if (spotLight1Ref.current) {
      const light = spotLight1Ref.current;
      light.position.set(
        spotLight1Props.position.x,
        spotLight1Props.position.y,
        spotLight1Props.position.z
      );
      light.intensity = spotLight1Props.intensity;
      light.angle = (spotLight1Props.angle * Math.PI) / 180;  // degree를 radian으로 변환
      light.color.set(spotLight1Props.color);
    }
  };

  const updateSpotLight2 = () => {
    if (spotLight2Ref.current) {
      const light = spotLight2Ref.current;
      light.position.set(
        spotLight2Props.position.x,
        spotLight2Props.position.y,
        spotLight2Props.position.z
      );
      light.intensity = spotLight2Props.intensity;
      light.angle = (spotLight2Props.angle * Math.PI) / 180;  // degree를 radian으로 변환
      light.color.set(spotLight2Props.color);
    }
  };

  // Scene 상태를 JSON으로 저장하는 함수
  const saveSceneState = () => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const objects = scene.children
      .filter(child => !(child instanceof THREE.Light))
      .map(obj => ({
        position: obj.position.toArray(),
        rotation: obj.rotation.toArray(),
        scale: obj.scale.toArray()
      }));

    const sceneState = {
      objects,
      background: backgroundUrl,
      lights: {
        spotLight1: spotLight1Props,
        spotLight2: spotLight2Props
      }
    };

    const blob = new Blob([JSON.stringify(sceneState)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene-state.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Scene을 이미지로 저장하는 함수
  const saveSceneAsImage = (format: 'png' | 'jpg' = 'png') => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    rendererRef.current.render(sceneRef.current, cameraRef.current);

    try {
      const quality = format === 'jpg' ? 0.95 : 1.0;
      const imageData = rendererRef.current.domElement.toDataURL(`image/${format}`, quality);
      
      const date = new Date();
      const timestamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
      
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `scene_${timestamp}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  // 현재 모델을 GLB 파일로 저장하는 함수
  const saveModelAsGLB = () => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const exporter = new GLTFExporter();

    const modelToExport = scene.children.find(
      child => !(child instanceof THREE.Light) && !(child instanceof THREE.Camera)
    );

    if (!modelToExport) {
      console.error('No model found to export');
      return;
    }

    exporter.parse(
      modelToExport,
      function (result) {
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'model.glb';
          link.click();
          URL.revokeObjectURL(url);
        }
      },
      function (error) {
        console.error('An error occurred while exporting the model:', error);
      },
      { binary: true }
    );
  };

  useEffect(() => {
    if (!containerRef.current || modelUrls.length === 0) return;

    // Scene 설정
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current = camera;

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true 
    });
    renderer.setSize(500, 500);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = brightness;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Controls 설정
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0.5, 1, -1.5);
    scene.add(directionalLight);

    // SpotLight 설정
    const spotLight1 = new THREE.SpotLight(
      spotLight1Props.color,
      spotLight1Props.intensity
    );
    spotLight1.position.set(
      spotLight1Props.position.x,
      spotLight1Props.position.y,
      spotLight1Props.position.z
    );
    spotLight1.angle = (spotLight1Props.angle * Math.PI) / 180;
    spotLight1.penumbra = 0.1;
    spotLight1.decay = 1.5;
    spotLight1.distance = 30;
    scene.add(spotLight1);
    spotLight1Ref.current = spotLight1;

    const spotLight2 = new THREE.SpotLight(
      spotLight2Props.color,
      spotLight2Props.intensity
    );
    spotLight2.position.set(
      spotLight2Props.position.x,
      spotLight2Props.position.y,
      spotLight2Props.position.z
    );
    spotLight2.angle = (spotLight2Props.angle * Math.PI) / 180;
    spotLight2.penumbra = 0.2;
    spotLight2.decay = 1.5;
    spotLight2.distance = 30;
    scene.add(spotLight2);
    spotLight2Ref.current = spotLight2;

    // 배경 이미지 텍스처 로드
    const textureLoader = new THREE.TextureLoader();
    if (backgroundUrl) {
      textureLoader.load(backgroundUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
      });
    }

    // GLB 모델 로드
    setIsLoading(true);
    const loader = new GLTFLoader();
    const loadPromises = modelUrls.map(url =>
      new Promise<GLTF>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      })
    );

    Promise.all(loadPromises)
      .then(gltfs => {
        gltfs.forEach(gltf => {
          scene.add(gltf.scene);
        });

        const box = new THREE.Box3();
        gltfs.forEach(gltf => {
          box.expandByObject(gltf.scene);
        });

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        camera.position.z = maxDim * 2;
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();
      })
      .catch(error => {
        console.error('Error loading models:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 애니메이션 루프
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // 클린업
    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [modelUrls, backgroundUrl, brightness]);

  // 조명 속성 변경시 업데이트
  useEffect(() => {
    updateSpotLight1();
  }, [spotLight1Props]);

  useEffect(() => {
    updateSpotLight2();
  }, [spotLight2Props]);

  return (
    <div  className="gallery-container">
      <div className = "gallery-viewport">
      <div
        ref={containerRef} 
        className="w-[500px] h-[500px] bg-white rounded-lg overflow-hidden -mt-20"
        style={{ 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.81), 0 2px 4px -1px rgba(0, 0, 0, 0)' 
        }} 
      />
      </div>
      
      {/* 조명 컨트롤 패널 */}
      <div className="control-panel">
        {/* SpotLight 1 Controls */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">SpotLight 1 Controls</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Position Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">X Position</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={spotLight1Props.position.x}
                  onChange={(e) => setSpotLight1Props(prev => ({
                    ...prev,
                    position: {
                      ...prev.position,
                      x: parseFloat(e.target.value)
                    }
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight1Props.position.x.toFixed(1)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Y Position</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={spotLight1Props.position.y}
                  onChange={(e) => setSpotLight1Props(prev => ({
                    ...prev,
                    position: {
                      ...prev.position,
                      y: parseFloat(e.target.value)
                    }
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight1Props.position.y.toFixed(1)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Z Position</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={spotLight1Props.position.z}
                  onChange={(e) => setSpotLight1Props(prev => ({
                    ...prev,
                    position: {
                      ...prev.position,
                      z: parseFloat(e.target.value)
                    }
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight1Props.position.z.toFixed(1)}</div>
              </div>
            </div>

            {/* Light Properties */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Angle (degrees)</label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={spotLight1Props.angle}
                  onChange={(e) => setSpotLight1Props(prev => ({
                    ...prev,
                    angle: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight1Props.angle}°</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Intensity</label>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.1"
                  value={spotLight1Props.intensity}
                  onChange={(e) => setSpotLight1Props(prev => ({
                    ...prev,
                    intensity: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight1Props.intensity.toFixed(1)}</div>
              </div>
            </div>

            {/* Color Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={spotLight1Props.color}
                onChange={(e) => setSpotLight1Props(prev => ({
                  ...prev,
                  color: e.target.value
                }))}
                className="w-full h-10 rounded-md mt-1"
              />
              <div className="text-sm text-center text-gray-600 mt-1">{spotLight1Props.color}</div>
            </div>
          </div>
        </div>

        {/* SpotLight 2 Controls */}
        <div>
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">SpotLight 2 Controls</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Position Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">X Position</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={spotLight2Props.position.x}
                  onChange={(e) => setSpotLight2Props(prev => ({
                    ...prev,
                    position: {
                      ...prev.position,
                      x: parseFloat(e.target.value)
                    }
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight2Props.position.x.toFixed(1)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Y Position</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={spotLight2Props.position.y}
                  onChange={(e) => setSpotLight2Props(prev => ({
                    ...prev,
                    position: {
                      ...prev.position,
                      y: parseFloat(e.target.value)
                    }
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight2Props.position.y.toFixed(1)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Z Position</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={spotLight2Props.position.z}
                  onChange={(e) => setSpotLight2Props(prev => ({
                    ...prev,
                    position: {
                      ...prev.position,
                      z: parseFloat(e.target.value)
                    }
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight2Props.position.z.toFixed(1)}</div>
              </div>
            </div>

            {/* Light Properties */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Angle (degrees)</label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={spotLight2Props.angle}
                  onChange={(e) => setSpotLight2Props(prev => ({
                    ...prev,
                    angle: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight2Props.angle}°</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Intensity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={spotLight2Props.intensity}
                  onChange={(e) => setSpotLight2Props(prev => ({
                    ...prev,
                    intensity: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-sm text-center text-gray-600">{spotLight2Props.intensity.toFixed(1)}</div>
              </div>
            </div>

            {/* Color Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input
                type="color"
                value={spotLight2Props.color}
                onChange={(e) => setSpotLight2Props(prev => ({
                  ...prev,
                  color: e.target.value
                }))}
                className="w-full h-10 rounded-md mt-1"
              />
              <div className="text-sm text-center text-gray-600 mt-1">{spotLight2Props.color}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼들 */}
<div className="flex gap-4 mt-6">
  <button
    onClick={saveModelAsGLB}
    className="save-btn glb-btn"
    disabled={isLoading}
  >
    Save Model (GLB)
  </button>

  <button
    onClick={saveSceneState}
    className="save-btn scene-btn"
    disabled={isLoading}
  >
    Save Scene State
  </button>

  <button
    onClick={() => saveSceneAsImage('png')}
    className="save-btn png-btn"
    disabled={isLoading}
  >
    Save as PNG
  </button>

  <button
    onClick={() => saveSceneAsImage('jpg')}
    className="save-btn jpg-btn"
    disabled={isLoading}
  >
    Save as JPG
  </button>
</div>
    </div>
)}