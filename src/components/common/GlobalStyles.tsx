export function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes fade-in-down {
        0% {
          opacity: 0;
          transform: translateY(-20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fade-in-up {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      .animate-fade-in-down {
        animation: fade-in-down 0.8s ease-out;
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out;
      }
      .animate-fade-in {
        animation: fade-in 0.5s ease-out;
      }
      .animation-delay-500 {
        animation-delay: 0.5s;
        animation-fill-mode: backwards;
      }
      @keyframes pulse-slow {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }
    `}</style>
  );
}
