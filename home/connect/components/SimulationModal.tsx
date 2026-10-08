
import React from 'react';
import { X } from 'lucide-react';

interface SimulationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-blue/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full relative overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-heading font-bold text-brand-blue">Simulador de Economia</h3>
                        <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">B2W Energia</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-blue hover:bg-brand-orange hover:text-white transition-all shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto relative bg-white">
                    <iframe
                        src="https://crm.b2wenergia.com.br/simulacao"
                        width="100%"
                        height="600"
                        frameBorder="0"
                        className="w-full h-[600px]"
                        style={{ border: 'none', background: 'white' }}
                        allowTransparency={true}
                        allow="camera; microphone; geolocation"
                    />
                </div>
            </div>
        </div>
    );
};
