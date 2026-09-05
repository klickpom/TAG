import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Shop from "@/components/Shop";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Seo from "@/components/Seo";
import BrandIntro from "@/components/BrandIntro";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#faf6ef]">
      <BrandIntro />
      <Seo
        title="مصنع تاج | ساعات حائط وتحف ديكور من بسيون — شحن لكل مصر"
        description={SITE.description}
        path="/"
        jsonLd={[]}
      />
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Shop />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
