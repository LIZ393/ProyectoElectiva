const NoAutorizado = () => {
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-indigo-600 font-semibold">No autorizado</h3>
          <p className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            403
          </p>
          <p className="text-gray-600">
            Lo sentimos, no tienes permiso para acceder a esta página.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/login"
              className="block py-2 px-4 text-white font-medium bg-indigo-600 duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NoAutorizado;
