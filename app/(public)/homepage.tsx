import Image from "next/image";
import homepag from "@/public/perfumeria.png";

export default function Homepage() {
  return (
    <section className="w-full bg-[#ECE4DA] py-8 px-4">
      <div className="relative mx-auto w-full max-w-6xl aspect-[5/4]">
        <Image
          src={homepag}
          alt="Imagen principal de la perfumería"
          fill
          priority
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1024px) 90vw,
                 1200px"
          className="object-contain rounded-xl"
        />
      </div>
    </section>
  );
}
