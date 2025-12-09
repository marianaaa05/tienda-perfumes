import Image from "next/image";

export default function About() {
  return (
    <>
      <div id="about">
        <div className="bg-[#ECE4DA] min-h-screen w-full flex flex-col items-center">
          <h2 className="text-center text-4xl font-marcellus mt-12 text-[#36302A]">
            Sobre nosotros
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-12 max-w-5xl px-6">
            <Image
              src="/about.jpg"
              alt="Perfumería"
              width={500}
              height={500}
              className="shadow-lg object-cover"
            />

            <div className="flex flex-col max-w-md text-left">
              <h1 className="text-3xl font-marcellus text-[#36302A] mb-4">
                Perfumería
              </h1>
              <h3 className="text-lg font-pt-serif text-[#574C3F] leading-relaxed">
                Somos una tienda dedicada a ofrecerte lo mejor en fragancias
                Natura y Yanbal, marcas líderes en perfumes que combinan
                innovación, elegancia y sostenibilidad. 
                <br /><br />
                Descubre aromas únicos diseñados para resaltar tu personalidad, con esencias naturales
                y notas irresistibles que te acompañarán todos los días. 
                <br /><br />
                Nos apasiona brindarte una experiencia de compra fácil, rápida y
                segura, con productos originales y asesoría personalizada para
                que encuentres el perfume perfecto para ti o para regalar.
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
