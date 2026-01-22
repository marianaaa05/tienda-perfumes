import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Networks() {
  return (
    <div id="networks" className="bg-[#ECE4DA] w-full py-14 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-marcellus mb-6 text-[#36302A]">
          Redes Sociales
        </h2>

        <p className="text-center text-base sm:text-lg font-pt-serif mb-10 text-[#36302A] max-w-2xl">
          Síguenos en nuestras redes sociales para estar al tanto de las últimas
          novedades y productos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/perfumeriaescuchatearoma"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-[#B9A590] rounded-xl px-5 py-4 text-[#36302A] font-pt-serif hover:bg-[#DED2C3] transition shadow-sm"
          >
            <Facebook size={32} color="#1877F2" />
            <span className="text-center md:text-left">
              Perfumería Escucha tu Aroma
            </span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/perfumeriaescuchatearoma"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-[#B9A590] rounded-xl px-5 py-4 text-[#36302A] font-pt-serif hover:bg-[#DED2C3] transition shadow-sm"
          >
            <Instagram size={32} color="#E4405F" />
            <span className="text-center md:text-left">
              Perfumería Escucha tu Aroma
            </span>
          </a>

          {/* Twitter */}
          <a
            href="https://twitter.com/PerfumeriaEscuchaTeAroma"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-[#B9A590] rounded-xl px-5 py-4 text-[#36302A] font-pt-serif hover:bg-[#DED2C3] transition shadow-sm"
          >
            <Twitter size={32} color="#1DA1F2" />
            <span className="text-center md:text-left">
              Perfumería Escucha tu Aroma
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
