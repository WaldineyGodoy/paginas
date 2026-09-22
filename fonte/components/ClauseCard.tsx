
import React from 'react';
import { Gavel, ExternalLink } from 'lucide-react';
import { Clause } from '../types';
import { getIcon } from '../constants';

interface ClauseCardProps {
  clause: Clause;
}

const ClauseCard: React.FC<ClauseCardProps> = ({ clause }) => {
  return (
    <div className="clause-card group bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-xl transition-all duration-500">
      {/* Imagem Ilustrativa */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={clause.imageUrl} 
          alt={clause.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-lg">
            {getIcon(clause.icon)}
          </div>
          <h3 className="text-white font-bold text-lg">{clause.title}</h3>
        </div>
        <a 
          href={clause.imageUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="no-print absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-brand-orange transition-all"
          title="Ver imagem original"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-6">
          <span className="text-4xl font-black text-brand-blue leading-none">{clause.number}</span>
        </div>
        
        <div className="space-y-6 flex-grow">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-2">Resumo da Cláusula</h4>
            <p className="text-brand-gray text-sm leading-relaxed">
              {clause.description}
            </p>
          </div>
          
          <div className="bg-brand-orange/5 border-l-4 border-brand-orange p-4 rounded-r-2xl">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-2 flex items-center gap-1">
              <Gavel className="w-3 h-3" /> Valor Estratégico
            </h4>
            <p className="text-sm font-medium text-brand-dark/80 italic">
              "{clause.whyExists}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClauseCard;
