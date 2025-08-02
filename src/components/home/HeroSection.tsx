export function HeroSection() {
  return (
    <div className="mb-8 animate-fade-in-down mt-8">
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-800 mb-2 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">ムリな日</span>
        <span className="text-gray-800">カレンダー</span>
      </h1>
      <div className="flex items-center justify-center gap-2 text-gray-600">
        <div className="h-px bg-gray-300 w-12 sm:w-16"></div>
        <p className="text-xs sm:text-sm font-medium uppercase tracking-wide">Since 2025</p>
        <div className="h-px bg-gray-300 w-12 sm:w-16"></div>
      </div>
    </div>
  );
}
