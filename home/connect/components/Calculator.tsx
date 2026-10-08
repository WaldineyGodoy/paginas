
import React, { useEffect, useState, useRef } from 'react';

export const Calculator: React.FC = () => {
  const [iframeSrc, setIframeSrc] = useState("https://crm.b2wenergia.com.br/simulacao");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Repassa os parâmetros da URL para o Iframe
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString()) {
      setIframeSrc(`https://crm.b2wenergia.com.br/simulacao?${urlParams.toString()}`);
    }

    // Listener para ajuste automático de altura via postMessage
    const handleMessage = (e: MessageEvent) => {
      if (e.origin === "https://crm.b2wenergia.com.br") {
        if (e.data.height && iframeRef.current) {
          iframeRef.current.style.height = e.data.height + 'px';
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <section id="simulador" className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-brand-blue font-heading font-bold text-3xl sm:text-4xl mb-4">
            Simule sua <span className="text-brand-orange">Economia Real</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra quanto você vai economizar todos os meses com a B2W Energia.
          </p>
        </div>

        <div style={{ width: '100%', minHeight: '600px', display: 'flex', justifyContent: 'center' }}>
          <iframe 
            ref={iframeRef}
            id="lead-capture-frame" 
            src={iframeSrc} 
            width="100%"
            height="700"
            frameBorder="0"
            style={{ 
              border: 'none', 
              maxWidth: '600px', 
              borderRadius: '8px', 
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }}
            allow="camera; microphone; geolocation"
            title="Simulação de Economia - B2W Energia"
          />
        </div>
      </div>
    </section>
  );
};
