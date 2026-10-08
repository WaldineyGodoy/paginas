import React from 'react';

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}