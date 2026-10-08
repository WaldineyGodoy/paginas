
import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Calculator } from './components/Calculator';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { SimulationModal } from './components/SimulationModal';
import { useState } from 'react';

function App() {
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar onAssineAgora={() => setIsSimulationModalOpen(true)} />
      <main>
        <Hero />
        <HowItWorks />
        <Calculator />
        <Features />
        <FAQ />
      </main>
      <Footer onAssineAgora={() => setIsSimulationModalOpen(true)} />
      <WhatsAppWidget />
      <SimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
      />
    </div>
  );
}

export default App;
