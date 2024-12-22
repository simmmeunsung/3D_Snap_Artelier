/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  reactStrictMode: true,
};

// `output: 'export'` 및 `basePath`/`assetPrefix` 설정을 추가한 부분
module.exports = {
  ...nextConfig,
  output: 'export',  // 정적 사이트로 내보내기
  trailingSlash: true,  // URL 끝에 슬래시 추가
  basePath: '/3D-Snap-Artelier',  // 저장소 이름을 넣어줘
  assetPrefix: '/3D-Snap-Artelier',  // 저장소 이름을 넣어줘
};
