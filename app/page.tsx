import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import MenuSection from "@/components/MenuSection";
import { InfoStrip, Specials, Testimonials, Reservation, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <InfoStrip />
      <About />
      <MenuSection />
      <Specials />
      <Testimonials />
      <Reservation />
      <Footer />
    </>
  );
}
