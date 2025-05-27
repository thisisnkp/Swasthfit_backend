"use client";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-center p-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 mb-4">
        🚧 Coming Soon
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-6">
        We're working hard to bring you this feature. Stay tuned!
      </p>
      <div className="animate-pulse">
        <span className="inline-block w-6 h-6 bg-blue-600 rounded-full mx-1"></span>
        <span className="inline-block w-6 h-6 bg-blue-600 rounded-full mx-1"></span>
        <span className="inline-block w-6 h-6 bg-blue-600 rounded-full mx-1"></span>
      </div>
    </div>
  );
}
