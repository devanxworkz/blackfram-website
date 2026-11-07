import { Route, Routes } from 'react-router-dom';
import { MarketingLayout } from './components/MarketingLayout';

import Landing from './pages/marketing/Landing';
import Features from './pages/marketing/Features';
import Pricing from './pages/marketing/Pricing';
import Contact from './pages/marketing/Contact';
import StaticPage from './pages/marketing/StaticPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingLayout><Landing /></MarketingLayout>} />
      <Route path="/features" element={<MarketingLayout><Features /></MarketingLayout>} />
      <Route path="/pricing" element={<MarketingLayout><Pricing /></MarketingLayout>} />
      <Route path="/about" element={<MarketingLayout><StaticPage /></MarketingLayout>} />
      <Route path="/contact" element={<MarketingLayout><Contact /></MarketingLayout>} />
      <Route path="/privacy" element={<MarketingLayout><StaticPage /></MarketingLayout>} />
      <Route path="/terms" element={<MarketingLayout><StaticPage /></MarketingLayout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
