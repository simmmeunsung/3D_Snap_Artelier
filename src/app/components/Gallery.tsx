'use client';
import dynamic from 'next/dynamic'

const Gallery = dynamic(() => import('./DynamicGallery'), { ssr: false })

export default Gallery