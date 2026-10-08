
import React, { useEffect } from 'react';

export const WhatsAppWidget: React.FC = () => {
  useEffect(() => {
    // Evita duplicidade se o componente for remontado
    if (document.getElementById('whatsapp-widget-container')) return;

    (function() {
      // Configuration
      const config = {
        phoneNumber: "5531995367744",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png",
        tooltipText: "Falar com atendente",
        position: "right" // 'right' or 'left'
      };

      // Create Container
      const container = document.createElement('div');
      container.id = 'whatsapp-widget-container';
      container.style.position = 'fixed';
      container.style.bottom = '24px';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'flex-end';
      container.style.fontFamily = 'sans-serif';

      if (config.position === 'left') {
        container.style.left = '24px';
        container.style.alignItems = 'flex-start';
      } else {
        container.style.right = '24px';
      }

      // Create Styles
      const style = document.createElement('style');
      style.innerHTML = `
        .wa-widget-btn {
          width: 64px;
          height: 64px;
          cursor: pointer;
          border: none;
          background: transparent;
          outline: none;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .wa-widget-btn:hover {
          transform: scale(1.1);
        }
        .wa-widget-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
        }
        .wa-tooltip {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) translateX(10px);
          right: 75px;
          background: white;
          color: #333;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        .wa-widget-btn:hover .wa-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }
        .wa-tooltip::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%);
          border-width: 6px 0 6px 6px;
          border-style: solid;
          border-color: transparent transparent transparent white;
        }
      `;
      document.head.appendChild(style);

      // Create Button
      const button = document.createElement('a');
      button.className = 'wa-widget-btn';
      button.href = `https://wa.me/${config.phoneNumber}`;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';

      // Create Image
      const img = document.createElement('img');
      img.src = config.imageUrl;
      img.className = 'wa-widget-img';
      img.alt = 'Fale conosco pelo WhatsApp';

      // Create Tooltip
      const tooltip = document.createElement('span');
      tooltip.className = 'wa-tooltip';
      tooltip.innerText = config.tooltipText;

      // Assemble
      button.appendChild(tooltip);
      button.appendChild(img);
      container.appendChild(button);
      document.body.appendChild(container);

    })();
  }, []);

  return null;
};
