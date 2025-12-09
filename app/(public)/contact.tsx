export default function Contact() {
  return (
    <>
      <div id="contact">
        <div className="bg-[#ECE4DA] w-full flex flex-col items-center">
          <h2 className="text-center text-4xl font-marcellus mt-12 mb-8 text-[#36302A]">
            Contacto
          </h2>
          <h1 className="text-xl font-pt-serif mb-8 text-[#36302A]">
            Comunicate con nosotros a través del siguiente formulario
          </h1>
          <form className="bg-[#ECE4DA] text-[#36302A] shadow-md rounded-xl p-8 mb-8 w-full max-w-lg space-y-6">
            {/* Nombre y Apellido */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-[#36302A] font-marcellus mb-1">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  className="border border-[#B9A590] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#574C3F]"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-[#36302A] font-marcellus mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  className="border border-[#B9A590] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#574C3F]"
                />
              </div>
            </div>

            {/* Correo */}
            <div className="flex flex-col">
              <label className="text-[#36302A] font-marcellus mb-1">
                Correo electrónico <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                className="border border-[#B9A590] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#574C3F]"
              />
            </div>

            {/* Mensaje */}
            <div className="flex flex-col">
              <label className="text-[#36302A] font-marcellus mb-1">
                Mensaje <span className="text-red-600">*</span>
              </label>
              <textarea
                name="mensaje"
                rows={5}
                required
                className="border border-[#B9A590] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#574C3F]"
              ></textarea>
            </div>

            {/* Botón Enviar */}
            <button
              type="submit"
              className="bg-[#574C3F] text-white px-6 py-2 rounded-full font-marcellus hover:bg-[#36302A] transition-all duration-300 w-full"
            >
              Enviar mensaje
            </button>
            {/* notificacion de exito */}
            <div className="text-center text-xl font-pt-serif text-[#574C3F] mt-4">
              Gracias por contactarnos!
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
