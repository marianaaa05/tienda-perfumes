import Image from "next/image";
import homepag from "@/public/perfumeria.png";

export default function Homepage() {
  return (
    <>
      <div className="flex justify-center bg-[#ECE4DA] py-8">
        <Image
          src={homepag}
          alt="Logo de la tienda"
          width={1000}   // ancho 
          height={600}  // alto 
          className="object-contain h-140 w-auto"
        />
      </div>
    </>
  )
}