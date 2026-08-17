import './globals.css';
import HideOnAdmin from '../components/layout/HideOnAdmin'; 
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// 1. Add the Analytics Tracker import
import AnalyticsTracker from '../components/AnalyticsTracker'; 

export const metadata = {
  title: 'Vidhyora | Elite Tech & Leadership Education',
  description: 'Master your skills in AI and Technology.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">
        
        {/* 2. Inject the invisible tracker right at the top of the body */}
        <AnalyticsTracker />
        
        {/* Wrap the Navbar */}
        <HideOnAdmin>
          <Navbar />
        </HideOnAdmin>

        {/* This is where your page content renders */}
        <main>
          {children}
        </main>

        {/* Wrap the Footer */}
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>

      </body>
    </html>
  );
}