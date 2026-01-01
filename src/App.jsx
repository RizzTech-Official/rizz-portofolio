import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { useTheme } from './hooks/useTheme';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Public components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Team from './components/Team';
import Clients from './components/Clients';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Pricing from './components/Pricing';
import Process from './components/Process';
import Blog from './components/Blog';
import BackToTop from './components/BackToTop';

// Admin components
import AdminLayout from './admin/layouts/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import HeroPage from './admin/pages/HeroPage';
import AboutPage from './admin/pages/AboutPage';
import ProjectsPage from './admin/pages/ProjectsPage';
import CertificatesPage from './admin/pages/CertificatesPage';
import ServicesPage from './admin/pages/ServicesPage';
import ContactsPage from './admin/pages/ContactsPage';
import TestimonialsPage from './admin/pages/TestimonialsPage';
import TeamPage from './admin/pages/TeamPage';
import ClientsPage from './admin/pages/ClientsPage';
import FAQPage from './admin/pages/FAQPage';
import PricingPage from './admin/pages/PricingPage';
import BlogPage from './admin/pages/BlogPage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Public Home Page
function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero theme={theme} />
        <About />
        <Services />
        <Clients />
        <Projects />
        <Process />
        <Testimonials />
        <Team />
        <Pricing />
        <Certificates />
        <Blog />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="hero" element={<HeroPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="contacts" element={<ContactsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

