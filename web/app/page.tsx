import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <CTASection />
      <Footer />
    </main>
  );
}