/**
 * Xpixel Solar Panel Conditioner - B2B Partnership Page
 */

import { useState, useEffect } from 'react';
import { B2BInquiryForm } from '@/components/b2b/B2BInquiryForm';
import { CartBadge } from '@/components/cart/CartDrawer';
import { Sun, Moon, ArrowLeft } from 'lucide-react';

export function B2BPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <CartBadge />
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-card hover:bg-muted transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <B2BInquiryForm />
      </main>
    </div>
  );
}
