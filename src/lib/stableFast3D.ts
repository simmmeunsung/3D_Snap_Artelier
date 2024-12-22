// lib/imageConversion.ts
const STABILITY_API_URL = "https://api.stability.ai/v2beta/3d/stable-fast-3d";
const API_KEY = 'sk-SkU4SJkZYYsKGHGmCNYVvzhrjeu7ebVi6VNdnfOQ8CtrbZqo';

interface ConversionOptions {
  textureResolution: '512' | '1024' | '2048';
  foregroundRatio: number;
}

export async function convertImageTo3D(
  imageFile: File,
  options: ConversionOptions
) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('texture_resolution', options.textureResolution);
  formData.append('foreground_ratio', options.foregroundRatio.toString());

  const response = await fetch(STABILITY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  return await response.blob();
}