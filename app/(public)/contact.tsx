export default function Contact() {
  return (
    <div id="contact" className="bg-[#ECE4DA] w-full flex flex-col items-center">
      <h2 className="text-center text-4xl font-marcellus mt-12 mb-4 text-[#36302A]">
        Contacto
      </h2>

      <p className="text-lg font-pt-serif mb-8 text-[#36302A] text-center px-4">
        Comunícate con nosotros a través de nuestro correo electrónico
      </p>

      <form
        action="mailto:mar9814@gmail.com"
        method="POST"
        encType="text/plain"
        className="bg-[#ECE4DA] text-[#36302A] shadow-md rounded-xl p-8 mb-12 w-full max-w-lg space-y-6"
      >
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="font-marcellus mb-1">
            Nombre <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="Su nombre"
            required
            className="border border-[#B9A590] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#574C3F]"
          />
        </div>

        {/* Correo */}
        <div className="flex flex-col">
          <label className="font-marcellus mb-1">
            Correo electrónico <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="Correo"
            required
            className="border border-[#B9A590] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#574C3F]"
          />
        </div>

        {/* Mensaje */}
        <div className="flex flex-col">
          <label className="font-marcellus mb-1">
            Mensaje <span className="text-red-600">*</span>
          </label>
          <textarea
            name="Mensaje"
            rows={5}
            required
            className="border border-[#B9A590] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#574C3F]"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="bg-[#574C3F] text-white px-6 py-3 rounded-full font-marcellus hover:bg-[#36302A] transition w-full"
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}
