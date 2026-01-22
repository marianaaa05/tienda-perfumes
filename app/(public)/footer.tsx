export default function Footer() {
  return (
    // footer responsivo
    <>
      <footer className="bg-[#F6F3EC] text-[#574C3F] py-6 px-4 w-full">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-pt-serif text-sm sm:text-base">
            &copy; 2024 Escucha tu Aroma. Todos los derechos reservados.
          </p>

          <span className="font-pt-serif text-xs sm:text-sm opacity-70">
            Perfumería Natura & Yanbal
          </span>
        </div>
      </footer>
    </>
  );
}
