export default function ClientsPage() {
  return (
    <>
      <div id="clients" className="min-h-screen flex bg-[#F6F3EF] text-[#36302A]">
        <main className="flex-1 p-10">
          <h1 className="text-4xl font-marcellus mb-8">Gestión de clientes</h1>

          <section className="mt-12">
            <h2 className="text-2xl font-marcellus mb-4">Gestión de clientes</h2>
            <div className="bg-white shadow rounded-xl p-6">
              <p className="text-[#574C3F]">
                Aquí podrás agregar, editar o eliminar clientes.  
                (Esta sección puede conectarse a una base de datos más adelante.)
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}