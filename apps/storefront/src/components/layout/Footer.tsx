import type { Category } from "@spree/sdk";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { POLICY_LINKS } from "@/lib/constants/policies";
import { isWholesaleEnabled } from "@/lib/spree";
import { getStoreName } from "@/lib/store";
import { CurrentYear } from "./CurrentYear";

const storeName = getStoreName();

interface FooterProps {
  basePath: string;
  locale: Locale;
  categoryLinks: ReactNode;
}

interface FooterCategoryLinksProps {
  rootCategories: Category[];
  basePath: string;
}

export function FooterCategoryLinks({
  rootCategories,
  basePath,
}: FooterCategoryLinksProps) {
  return rootCategories.map((category) => (
    <li key={category.id}>
      <Link
        href={`${basePath}/c/${category.permalink}`}
        className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
      >
        {category.name}
      </Link>
    </li>
  ));
}

export async function Footer({ basePath, locale, categoryLinks }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tp = await getTranslations({ locale, namespace: "policies" });
  const wholesaleEnabled = isWholesaleEnabled();

  const shopLinks = (
    <>
      <li>
        <Link
          href={`${basePath}/products`}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block"
        >
          {t("allProducts")}
        </Link>
      </li>
      {categoryLinks}
    </>
  );

  const aboutLinks = (
    <>
      <li>
        <Link
          href={`${basePath}/#seen-on-you`}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block"
        >
          Our Story
        </Link>
      </li>
    </>
  );

  const helpLinks = (
    <>
      <li>
        <Link
          href={`${basePath}/account`}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block"
        >
          {t("myAccount")}
        </Link>
      </li>
      <li>
        <Link
          href={`${basePath}/account/orders`}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block"
        >
          {t("orderHistory")}
        </Link>
      </li>
      <li>
        <Link
          href={`${basePath}/cart`}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block"
        >
          {t("cart")}
        </Link>
      </li>
      {wholesaleEnabled && (
        <li>
          <Link
            href={`${basePath}/wholesale`}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block"
          >
            {t("wholesale")}
          </Link>
        </li>
      )}
    </>
  );

  const followLinks = (
    <>
      <li>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block"
        >
          Instagram
        </a>
      </li>
      <li>
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block"
        >
          TikTok
        </a>
      </li>
    </>
  );

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border mt-auto font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-8 mb-16 border-t border-border md:border-none">
          {/* SHOP */}
          <div>
            <h3 className="hidden md:block text-xs font-semibold tracking-widest uppercase mb-6">
              Shop
            </h3>
            <ul className="hidden md:block space-y-4">{shopLinks}</ul>
            <details className="md:hidden group border-b border-border py-4">
              <summary className="text-xs font-semibold tracking-widest uppercase cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                Shop
                <span className="transition-transform group-open:rotate-180">
                  ↓
                </span>
              </summary>
              <ul className="mt-4 space-y-4">{shopLinks}</ul>
            </details>
          </div>

          {/* ABOUT */}
          <div>
            <h3 className="hidden md:block text-xs font-semibold tracking-widest uppercase mb-6">
              About
            </h3>
            <ul className="hidden md:block space-y-4">{aboutLinks}</ul>
            <details className="md:hidden group border-b border-border py-4">
              <summary className="text-xs font-semibold tracking-widest uppercase cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                About
                <span className="transition-transform group-open:rotate-180">
                  ↓
                </span>
              </summary>
              <ul className="mt-4 space-y-4">{aboutLinks}</ul>
            </details>
          </div>

          {/* HELP */}
          <div>
            <h3 className="hidden md:block text-xs font-semibold tracking-widest uppercase mb-6">
              Help
            </h3>
            <ul className="hidden md:block space-y-4">{helpLinks}</ul>
            <details className="md:hidden group border-b border-border py-4">
              <summary className="text-xs font-semibold tracking-widest uppercase cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                Help
                <span className="transition-transform group-open:rotate-180">
                  ↓
                </span>
              </summary>
              <ul className="mt-4 space-y-4">{helpLinks}</ul>
            </details>
          </div>

          {/* FOLLOW */}
          <div>
            <h3 className="hidden md:block text-xs font-semibold tracking-widest uppercase mb-6">
              Follow
            </h3>
            <ul className="hidden md:block space-y-4">{followLinks}</ul>
            <details className="md:hidden group border-b border-border py-4">
              <summary className="text-xs font-semibold tracking-widest uppercase cursor-pointer list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                Follow
                <span className="transition-transform group-open:rotate-180">
                  ↓
                </span>
              </summary>
              <ul className="mt-4 space-y-4">{followLinks}</ul>
            </details>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {POLICY_LINKS.map((policy) => (
              <Link
                key={policy.slug}
                href={`${basePath}/policies/${policy.slug}`}
                className="hover:text-primary transition-colors"
              >
                {tp(policy.nameKey)}
              </Link>
            ))}
          </div>
          <p>
            &copy; <CurrentYear /> {storeName}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
