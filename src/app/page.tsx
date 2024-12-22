'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Page1 from './pages/page1';
import Page2 from './pages/page2';
import DotNavigation from './components/DotNavigation'; // DotNavigation 컴포넌트 import

function Page3(): ReactNode {
  return (
    <div className="full-page bg-yellow-100 page3"> {/* page3 클래스 추가 */}
      <div className="text-center px-8">  {/* 좌우 여백 추가 */}
        <h1 className="text-4xl font-bold mb-4">Concept</h1>
        <p className="text-lg">● 전문 크리에이터들의 작업 과정에서 가장 큰 도전 과제 중 하나는 완벽한 구도를 찾는 것입니다.<br></br> 2D 이미지의 한계를 넘어, 혁신적인 3D 변환 기술을 통해 작품의 잠재력을 최대한으로 끌어올릴 수 있는 획기적인 도구를 소개합니다.</p>
        <p className="text-lg"><br></br>● 이 도구는 디자이너, 사진작가, 영상 제작자들의 작업 시간을 획기적으로 단축시키며, 동시에 창의적 실험의 폭을 넓혀줍니다.<br></br> 상상 속 구도를 현실로 구현하는 과정이 이제 그 어느 때보다 빠르고 정확해집니다.
전통적인 2D 작업 방식의 한계를 뛰어넘어, 직관적인 3D 인터페이스를 통해 당신의 창의적 비전을 완벽하게 실현하세요.<br></br> 시각적 실험과 정교한 구도 설계가 만나는 곳, 바로 여기에서 새로운 창작의 지평이 열립니다.
</p>
      </div>
    </div>
  );
}



function Page4(): ReactNode {
  return (
    <div className="full-page bg-red-100 page4">
      <div className="text-center px-8 h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-4">CONTECT</h2>
        <p className="text-lg">ses1323k@naver.com</p>
        
        <div className="sns-icons">
          <a 
            href="https://www.instagram.com/gnuxnue/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sns-icon instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          
          <a 
            href="https://github.com/simmmeunsung" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sns-icon github"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  console.log(`1`);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 4;


  const handleScroll = () => {
    /*e.preventDefault();*/
    const container = document.querySelector('.scroll-container');
    if (!container) return             ;
   

    const pageHeight = window.innerHeight;
  
    const scrollY = container.scrollTop;
    const newPage = Math.round(scrollY / pageHeight);

  


    

    if (newPage !== currentPage && newPage >= 0 && newPage < totalPages) {
      
      setCurrentPage(newPage);
    }

  };



  const handleDotClick = (pageIndex: number) => {
    const container = document.querySelector('.scroll-container');
    if (!container) return;

    container.scrollTo({
      top: pageIndex * window.innerHeight,
      behavior: 'smooth'
    });
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      
      return () => container.removeEventListener('scroll', handleScroll);
    }
    
    
  }, [currentPage]);

  return (
    
    <div className="relative h-screen w-full overflow-hidden">
      <div className="scroll-container h-full overflow-y-auto snap-y snap-mandatory">
        <div className="snap-start h-screen w-full">
          <Page1 />
        </div>
        <div className="snap-start h-screen w-full">
          <Page2 />
        </div>
        <div className="snap-start h-screen w-full">
          <Page3 />
        </div>
        <div className="snap-start h-screen w-full">
          <Page4 />
        </div>
      </div>

       {/* DotNavigation 컴포넌트를 사용 */}
       <DotNavigation 
        totalPages={totalPages} 
        currentPage={currentPage} 
        handleDotClick={handleDotClick} 
      />
    </div>
  );
}