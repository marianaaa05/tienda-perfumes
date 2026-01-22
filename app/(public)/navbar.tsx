// "use client";
// import { useUser } from "@clerk/nextjs";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { Link } from "react-scroll";

// import {
//   SignInButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";

// export default function Navbar() {
//   const { user, isLoaded, isSignedIn } = useUser();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoaded) return;

//     if (isSignedIn && user?.publicMetadata?.role === "admin") {
//       router.push("/dashboard");
//     }
//   }, [isLoaded, isSignedIn, user, router]);


//   return (
//     <>
//       <header className="h-24 w-full bg-[#ECE4DA] px-6 flex items-center justify-between">
//         {/* logo */}
//         <div className="flex items-center gap-3">
//           <Image
//             src="/logo.png"
//             alt="Logo Perfumería"
//             width={92}
//             height={92}
//             className="object-cover"
//           />
//           <div className="flex flex-col leading-tight">
//             <h1 className="text-2xl font-marcellus text-[#36302A]">
//               Escucha tu aroma
//             </h1>
//             <h3 className="text-sm font-pt-serif text-[#574C3F]">
//               Perfumería
//             </h3>
//           </div>
//         </div>

//         {/* menú */}
//         <nav className="flex space-x-8 text-[#36302A] font-pt-serif items-center">
//           <Link to="store" smooth duration={600} offset={-100}
//             className="hover:text-[#B9A590] cursor-pointer">
//             Tienda
//           </Link>

//           <Link to="about" smooth duration={600} offset={-100}
//             className="hover:text-[#B9A590] cursor-pointer">
//             Sobre nosotros
//           </Link>

//           <Link to="contact" smooth duration={600} offset={-100}
//             className="hover:text-[#B9A590] cursor-pointer">
//             Contacto
//           </Link>

//           <Link to="networks" smooth duration={600} offset={-100}
//             className="hover:text-[#B9A590] cursor-pointer">
//             Redes Sociales
//           </Link>

//           {/* AUTENTICACIÓN CON CLERK */}
//           <div className="flex items-center gap-3">
//             <SignedOut>
//               <SignInButton mode="modal">
//                 <button className="bg-[#B9A590] text-white rounded-full font-medium text-sm px-4 py-2 hover:text-[#36302A] cursor-pointer">
//                   Iniciar sesión o registrarse
//                 </button>
//               </SignInButton>
//             </SignedOut>

//             <SignedIn>
//               <UserButton afterSignOutUrl="/" />
//             </SignedIn>
//           </div>
//         </nav>
//       </header>
//     </>
//   );
// }


"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Link } from "react-scroll";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user?.publicMetadata?.role === "admin") {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, user, router]);

  const menuItems = [
    { label: "Tienda", to: "store" },
    { label: "Sobre nosotros", to: "about" },
    { label: "Contacto", to: "contact" },
    { label: "Redes Sociales", to: "networks" },
  ];

  return (
    <header className="w-full bg-[#ECE4DA] px-6 py-4 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Logo Perfumería"
          width={70}
          height={70}
          className="object-cover"
        />
        <div>
          <h1 className="text-xl md:text-2xl font-marcellus text-[#36302A]">
            Escucha tu aroma
          </h1>
          <p className="text-xs md:text-sm font-pt-serif text-[#574C3F]">
            Perfumería
          </p>
        </div>
      </div>

      {/* Menú desktop */}
      <nav className="hidden md:flex items-center gap-8 font-pt-serif text-[#36302A]">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            smooth
            duration={600}
            offset={-100}
            className="cursor-pointer hover:text-[#B9A590]"
          >
            {item.label}
          </Link>
        ))}

        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-[#B9A590] text-white rounded-full px-4 py-2 text-sm hover:text-[#36302A]">
              Iniciar sesión
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>

      {/* Botón hamburguesa (mobile) */}
      <button
        className="md:hidden text-[#36302A]"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menú móvil */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-[#ECE4DA] flex flex-col items-center gap-6 py-6 z-50 md:hidden">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              smooth
              duration={600}
              offset={-100}
              onClick={() => setOpen(false)}
              className="font-pt-serif text-[#36302A] hover:text-[#B9A590]"
            >
              {item.label}
            </Link>
          ))}

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-[#B9A590] text-white rounded-full px-6 py-2 text-sm">
                Iniciar sesión
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      )}
    </header>
  );
}

