import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Prologue from "./components/Prologue";
import Menu from "./components/Menu";
import Stats from "./components/Stats";
import Quote from "./components/Quote";
import Features from "./components/Features";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import CartBubble from "./components/CartBubble";
import CartDrawer from "./components/CartDrawer";
import ScrollProgress from "./components/ScrollProgress";
import RevealController from "./components/RevealController";

export default function Home() {
  return (
    <>
      <RevealController />
      <Nav />
      <ScrollProgress />
      <main>
        <Hero />
        <Prologue />
        <Menu />
        <Stats />
        <Quote />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
      <CartBubble />
      <CartDrawer />
    </>
  );
}
