import Navbar from "./(public)/navbar";
import Homepage from "./(public)/homepage";
import Store from "./(public)/store";
import About from "./(public)/about";
import Networks from "./(public)/networks";
import Contact from "./(public)/contact";
import Footer from "./(public)/footer";

export default function Home() {
  return (
   <>
     
      <Navbar />
      <main className="scroll-smooth">
        <Homepage />
        <section id="store">
          <Store />
        </section>

        <section id="about">
          <About />
        </section>

        <section id="contact">
          <Contact />
        </section>

        <section id="networks">
          <Networks />
        </section>
        
      </main>
      <Footer />
    </>
  );
}

