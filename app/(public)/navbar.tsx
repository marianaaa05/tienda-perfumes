"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Link } from "react-scroll";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user?.publicMetadata?.role === "admin") {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, user, router]);


  return (
    <>
      <header className="h-24 w-full bg-[#ECE4DA] px-6 flex items-center justify-between">
        {/* logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo Perfumería"
            width={92}
            height={92}
            className="object-cover"
          />
          <div className="flex flex-col leading-tight">
            <h1 className="text-2xl font-marcellus text-[#36302A]">
              Escucha tu aroma
            </h1>
            <h3 className="text-sm font-pt-serif text-[#574C3F]">
              Perfumería
            </h3>
          </div>
        </div>

        {/* menú */}
        <nav className="flex space-x-8 text-[#36302A] font-pt-serif items-center">
          <Link to="store" smooth duration={600} offset={-100}
            className="hover:text-[#B9A590] cursor-pointer">
            Tienda
          </Link>

          <Link to="about" smooth duration={600} offset={-100}
            className="hover:text-[#B9A590] cursor-pointer">
            Sobre nosotros
          </Link>

          <Link to="contact" smooth duration={600} offset={-100}
            className="hover:text-[#B9A590] cursor-pointer">
            Contacto
          </Link>

          <Link to="networks" smooth duration={600} offset={-100}
            className="hover:text-[#B9A590] cursor-pointer">
            Redes Sociales
          </Link>

          {/* AUTENTICACIÓN CON CLERK */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-[#B9A590] text-white rounded-full font-medium text-sm px-4 py-2 hover:text-[#36302A] cursor-pointer">
                  Iniciar sesión o registrarse
                </button>
              </SignInButton>

              {/* <SignUpButton mode="modal">
                <button className="bg-[#B9A590] text-white rounded-full font-medium text-sm px-4 py-2 cursor-pointer">
                  Crear cuenta
                </button>
              </SignUpButton> */}
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>
      </header>
    </>
  );
}
