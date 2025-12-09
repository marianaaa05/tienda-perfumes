import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Networks() {
  return (
    <>
      <div id="networks">
        <div className="bg-[#ECE4DA] w-full flex flex-col items-center pb-14">
          <h2 className="text-center text-4xl font-marcellus mt-12 mb-8 text-[#36302A]">
            Redes Sociales
          </h2>
          <h1 className="text-xl font-pt-serif mb-8 text-[#36302A]">
            Siguenos en nuestras redes sociales para estar al tanto de las
            últimas novedades y productos.
          </h1>
          <div className="flex flex-col md:flex-row gap-4 text-[#36302A] font-pt-serif">
            <div className="flex flex-col w-full items-center">
              <label className="text-[#36302A] font-marcellus mb-1">
                Facebook
              </label>
              <a
                href="https://www.facebook.com/perfumeriaescuchatearoma"
                target="_blank"
                rel="noreferrer"
                className="border border-[#B9A590] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#574C3F]"
              >
                <Facebook size={30} color="#1877F2" />
                Perfumería Escucha tu Aroma
              </a>
            </div>

            <div className="flex flex-col w-full items-center">
              <label className="text-[#36302A] font-marcellus mb-1">
                Instagram
              </label>
              <a
                href="https://www.instagram.com/perfumeriaescuchatearoma"
                target="_blank"
                rel="noreferrer"
                className="border border-[#B9A590] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#574C3F]"
              >
                <Instagram size={30} color="#E4405F" />
                Perfumería Escucha tu Aroma
              </a>
            </div>

            <div className="flex flex-col w-full items-center">
              <label className="text-[#36302A] font-marcellus mb-1">
                Twitter
              </label>
              <a
                href="https://twitter.com/PerfumeriaEscuchaTeAroma"
                target="_blank"
                rel="noreferrer"
                className="border border-[#B9A590] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#574C3F]"
              >
                <Twitter size={30} color="#1DA1F2" />
                Perfumería Escucha tu Aroma
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
