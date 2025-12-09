import Image from "next/image";
import homepag from "@/public/perfumeria.jpg";

export default function Homepage() {
  return (
    <>
      <div className="flex justify-center bg-[#ECE4DA]">
        <Image
          src={homepag}
          alt="Logo de la tienda"
          width={1000}   // ancho 
          height={600}  // alto 
          className="object-contain h-140 w-auto"
        />
      </div>
      <div className="-mt-72 text-center">
      <h1 className="text-6xl font-marcellus text-white drop-shadow-lg">
        Escucha el aroma que hay en ti
      </h1>
    </div>
    </>
  )
}