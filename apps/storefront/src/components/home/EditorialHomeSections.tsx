import Link from "next/link";
import type { ReactNode } from "react";

const moods = [
  {
    title: "The It Girl",
    detail: "An effortless kind of confidence.",
    image: "/editorial/mood-soft.jpg",
    position: "center 32%",
  },
  {
    title: "The Soft Girl",
    detail: "Soft layers, softer plans.",
    image: "/editorial/mood-off-duty.jpg",
    position: "center 35%",
  },
  {
    title: "The Off-Duty Girl",
    detail: "Comfort with a point of view.",
    image: "/editorial/mood-move.jpg",
    position: "center 28%",
  },
  {
    title: "The After-Dark Girl",
    detail: "A little drama after hours.",
    image: "/editorial/mood-after-hours.jpg",
    position: "center 30%",
  },
];

const colorStories = [
  {
    name: "Barbie / Blush",
    note: "Soft, never shy.",
    image: "/editorial/mood-soft.jpg",
    tint: "#e7b8b3",
  },
  {
    name: "Cloud blue",
    note: "A little room to breathe.",
    image: "/editorial/mood-off-duty.jpg",
    tint: "#b7cbd0",
  },
  {
    name: "Cafe / Mocha",
    note: "Grounded in good taste.",
    image: "/editorial/mood-move.jpg",
    tint: "#756154",
  },
  {
    name: "Buttercup / Butter",
    note: "A brighter point of view.",
    image: "/editorial/mood-after-hours.jpg",
    tint: "#ead99a",
  },
];

const communityImages = [
  "/editorial/hero.jpg",
  "/editorial/mood-soft.jpg",
  "/editorial/mood-off-duty.jpg",
  "/editorial/mood-move.jpg",
  "/editorial/mood-after-hours.jpg",
  "/editorial/look.jpg",
];

interface EditorialHomeSectionsProps {
  basePath: string;
  productSection: ReactNode;
}

export function EditorialHomeSections({
  basePath,
  productSection,
}: EditorialHomeSectionsProps) {
  return (
    <>
      <section className="container mx-auto px-5 pb-10 pt-10 sm:px-8 md:px-12 md:pb-14 md:pt-14">
        <div className="mb-6 text-center">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            A feeling for every day
          </p>
          <h2 className="font-serif text-3xl uppercase sm:text-4xl">
            What&apos;s your mood?
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 lg:grid-cols-4">
          {moods.map((mood) => (
            <Link
              key={mood.title}
              href={`${basePath}/products`}
              className="group min-w-0"
            >
              <div
                aria-hidden="true"
                className="aspect-4/5 overflow-hidden bg-secondary bg-cover transition-transform duration-500 group-hover:scale-[0.99]"
                style={{
                  backgroundImage: `url('${mood.image}')`,
                  backgroundPosition: mood.position,
                }}
              />
              <h3 className="mt-3 font-serif text-sm uppercase sm:text-base">
                {mood.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {mood.detail}
              </p>
              <span className="mt-3 inline-flex min-h-8 items-center bg-[#211c18] px-3 text-[9px] uppercase tracking-[0.14em] text-white">
                Shop the mood
              </span>
            </Link>
          ))}
        </div>
      </section>

      {productSection}

      <section className="bg-[#f1ede5] py-10 md:py-14">
        <div className="container mx-auto px-5 sm:px-8 md:px-12">
          <div className="mb-6 text-center">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Find your feeling
            </p>
            <h2 className="font-serif text-3xl uppercase sm:text-4xl">
              Choose your mood
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {colorStories.map((story) => (
              <Link
                key={story.name}
                href={`${basePath}/products`}
                className="group relative flex aspect-4/5 flex-col justify-end overflow-hidden bg-cover bg-center p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
                style={{
                  backgroundImage: `linear-gradient(0deg, rgb(24 21 18 / 62%), transparent 72%), url('${story.image}')`,
                  backgroundPosition: "center 32%",
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 mix-blend-soft-light opacity-45"
                  style={{ backgroundColor: story.tint }}
                />
                <span className="relative font-serif text-base uppercase text-white sm:text-lg">
                  {story.name}
                </span>
                <span className="relative mt-1 text-[10px] text-white/85 sm:text-xs">
                  {story.note}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-5 py-10 sm:px-8 md:px-12 md:py-14">
        <div
          className="relative flex aspect-4/5 items-end overflow-hidden bg-[#71665d] bg-cover bg-center md:aspect-video"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgb(24 21 18 / 50%), transparent 54%), url('/editorial/look.jpg')",
            backgroundPosition: "center 36%",
          }}
        >
          <div className="absolute inset-x-0 top-0 p-5 text-white sm:p-8 md:p-10">
            <h2 className="font-serif text-3xl uppercase sm:text-4xl">
              Shop the look
            </h2>
          </div>
          <span className="absolute left-[14%] top-[54%] border border-white/70 bg-[#211c18]/45 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:left-[22%] sm:top-[50%]">
            The base
          </span>
          <span className="absolute right-[12%] top-[43%] border border-white/70 bg-[#211c18]/45 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:right-[28%] sm:top-[40%]">
            The layer
          </span>
          <span className="absolute bottom-[18%] right-[18%] border border-white/70 bg-[#211c18]/45 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:bottom-[20%] sm:right-[38%]">
            Off-duty
          </span>
        </div>
      </section>

      <section id="seen-on-you" className="pb-10 md:pb-14">
        <div className="container mx-auto px-5 sm:px-8 md:px-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Out in the world
              </p>
              <h2 className="font-serif text-3xl uppercase sm:text-4xl">
                Seen on you
              </h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mb-1 text-[10px] uppercase tracking-[0.16em] underline underline-offset-4"
            >
              Join the conversation
            </a>
          </div>
        </div>
        <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto px-5 pb-2 sm:gap-2 sm:px-8 lg:container lg:mx-auto lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-12">
          {communityImages.map((image, index) => (
            <div
              key={image}
              role="img"
              aria-label={`Fashion community editorial ${index + 1}`}
              className="aspect-square w-64 shrink-0 snap-start bg-secondary bg-cover sm:w-72 lg:w-auto"
              style={{
                backgroundImage: `url('${image}')`,
                backgroundPosition: "center 32%",
              }}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-[#f1ede5] px-5 py-10 text-center sm:px-8 md:py-12">
        <h2 className="font-serif text-3xl uppercase sm:text-4xl">
          Join the club
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-muted-foreground">
          A considered note on new arrivals, personal style, and everyday life.
        </p>
        <form
          aria-label="Newsletter sign-up"
          className="mx-auto mt-5 flex max-w-xl flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            aria-label="Email address"
            placeholder="YOUR EMAIL ADDRESS"
            disabled
            className="h-11 min-w-0 flex-1 border border-border bg-background px-4 text-xs uppercase tracking-[0.12em] placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="h-11 bg-[#211c18] px-6 text-[10px] uppercase tracking-[0.16em] text-white opacity-60"
          >
            Join
          </button>
        </form>
      </section>
    </>
  );
}
