import React from 'react';
import { WebsiteContent } from '../../types/index.ts';
import { StarterPersonalTemplate } from './StarterPersonal.tsx';
import { ProfessionalPortfolioTemplate } from './ProfessionalPortfolio.tsx';
import { PremiumBusinessTemplate } from './PremiumBusiness.tsx';

interface Props {
  templateId: string;
  content: WebsiteContent;
  isLive?: boolean;
}

export const TemplateRenderer: React.FC<Props> = ({ templateId, content, isLive = false }) => {
  switch (templateId) {
    case 'pro_portfolio':
    case 'professional':
      return <ProfessionalPortfolioTemplate content={content} isLive={isLive} />;
    case 'premium_business':
    case 'premium':
      return <PremiumBusinessTemplate content={content} isLive={isLive} />;
    case 'starter_personal':
    case 'starter':
    default:
      return <StarterPersonalTemplate content={content} isLive={isLive} />;
  }
};
