import Link from "next/link";

interface HeroSectionProps {
  basePath: string;
}

export function HeroSection({ basePath }: HeroSectionProps) {
  return (
    <section
      className="relative isolate flex min-h-150 items-center justify-center overflow-hidden bg-[#51463d] bg-position-[62%_center] md:min-h-[min(72vh,780px)] md:bg-position-[center_38%]"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgb(24 21 18 / 48%), rgb(24 21 18 / 4%) 78%), linear-gradient(0deg, rgb(24 21 18 / 34%), transparent 55%), url('/editorial/hero.jpg')",
      }}
    >
      <div className="container mx-auto w-full px-5 pb-14 pt-24 sm:px-8 md:pb-20 lg:px-12">
        <div className="max-w-3xl text-center text-white">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.24em] text-white/85">
            A wardrobe for every version of you
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-5xl uppercase leading-[0.98] sm:text-6xl md:text-7xl">
            Your style. Your way.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/90 sm:text-base">
            Elevated essentials for every part of your day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#the-edit"
              className="inline-flex min-h-11 items-center justify-center bg-[#211c18] px-6 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3b332d] focus-visible:outline-white"
            >
              Shop the edit
            </Link>
            <Link
              href={`${basePath}/products`}
              className="inline-flex min-h-11 items-center justify-center border border-white/80 bg-white/5 px-6 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#211c18] focus-visible:outline-white"
            >
              Explore new drop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
