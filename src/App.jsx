import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programmes from './components/Programmes';
import Enrol from './components/Enrol';
import Leadership from './components/Leadership';
import BeyondCollege from './components/BeyondCollege';
import Testimonials from './components/Testimonials';
import Fees from './components/Fees';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import EnrollmentApp from './enrollment/App.tsx';

function isEnrollmentRoute() {
  return window.location.pathname.replace(/\/+$/, '') === '/enroll';
}

export default function App() {
  const enrollmentRoute = isEnrollmentRoute();
  const [enrollmentStylesReady, setEnrollmentStylesReady] = useState(!enrollmentRoute);

  useEffect(() => {
    if (enrollmentRoute) {
      // The enrolment form uses generic CSS class names such as .hero and
      // .card. Load its design only for this route, before mounting the form.
      import('./enrollment/styles.css').then(() => setEnrollmentStylesReady(true));
    }
  }, [enrollmentRoute]);

  if (enrollmentRoute) {
    if (!enrollmentStylesReady) {
      return <div aria-label="Loading enrolment page" style={{ minHeight: '100vh', background: '#f7f8fb' }} />;
    }
    return <EnrollmentApp />;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Programmes />
      <Enrol />
      <Leadership />
      <BeyondCollege />
      <Testimonials />
      <Fees />
      <FAQ />
      <CTA />
      <Contact />
      <Footer />
    </>
  );
}
