import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import JewelryLoadingScreen from '../components/ui/JewelryLoadingScreen';
import JewelryBackground from '../components/ui/JewelryBackground';

export default function StorefrontLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <JewelryLoadingScreen />
      <JewelryBackground />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#4B1528',
            color: '#FFF9FB',
            borderRadius: '999px',
            padding: '10px 18px',
            fontSize: '14px',
          },
        }}
      />
      <AnnouncementBar />
      <Navbar onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet context={{ openCart: () => setCartOpen(true) }} />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
