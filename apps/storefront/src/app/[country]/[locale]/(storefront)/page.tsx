import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorialHomeSections } from "@/components/home/EditorialHomeSections";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { resolveCurrency } from "@/lib/data/markets";
import { generateHomeMetadata } from "@/lib/metadata/home";

interface HomePageProps {
  params: Promise<{
    country: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { country, locale } = await params;
  return generateHomeMetadata({ country, locale });
}

async function HomePageContent({ params }: HomePageProps) {
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;
  const currency = await resolveCurrency(country);

  return (
    <div>
      <HeroSection basePath={basePath} />
      <EditorialHomeSections
        basePath={basePath}
        productSection={
          <div id="the-edit">
            <FeaturedProductsSection
              basePath={basePath}
              locale={locale}
              country={country}
              currency={currency}
            />
          </div>
        }
      />
    </div>
  );
}

export default function HomePage(props: HomePageProps) {
  return (
    <Suspense fallback={null}>
      <HomePageContent {...props} />
    </Suspense>
  );
}
