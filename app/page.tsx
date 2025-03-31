import Hero from "@/components/Hero";
import About from "@/components/about";
import Albums from "@/components/albums";
import Extra from "@/components/extra";
import Footer from "@/components/footer";
import Video from "@/components/video";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Albums />
      <About />
      <Video />
      <Extra />
      <Footer />
    </>
  );
}
