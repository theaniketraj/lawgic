import Link from "next/link";

interface CtaCardProps {
  title: string;
  description: string;
  buttonText?: string;
  href?: string;
  backgroundClass?: string;
}

export function CtaCard({
  title,
  description,
  buttonText = "Start Consulting Now",
  href = "/chat",
  backgroundClass = "bg-primary-500",
}: Readonly<CtaCardProps>) {
  return (
    <div
      className={`relative rounded-3xl p-10 md:p-14 overflow-hidden text-center group ${backgroundClass}`}
    >
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-r from-white/10 to-white/5 blur-[100px] opacity-60 transition-opacity group-hover:opacity-80"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-white/90 text-lg mb-8 leading-relaxed">
          {description}
        </p>

        <Link
          href={href}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 hover:bg-gray-50 rounded-full font-semibold transition-transform hover:scale-105 shadow-xl"
        >
          {buttonText} <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
}
