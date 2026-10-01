"use client";

import type { Product } from "@spree/sdk";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { HiddenPricePrompt } from "@/components/products/HiddenPricePrompt";
import { ProductImage } from "@/components/ui/product-image";
import { trackSelectItem } from "@/lib/analytics/gtm";

interface ProductCardProps {
  product: Product;
  basePath?: string;
  categoryId?: string;
  index?: number;
  listId?: string;
  listName?: string;
  fetchPriority?: "high" | "low" | "auto";
  /** Optional currency used for analytics; omit to skip the select_item event. */
  currency?: string;
}

export const ProductCard = memo(function ProductCard({
  product,
  basePath = "",
  categoryId,
  index,
  listId,
  listName,
  fetchPriority,
  currency,
}: ProductCardProps) {
  const t = useTranslations("products");
  const imageUrl = product.thumbnail_url || null;

  // Current display price
  const displayPrice = product.price?.display_amount;

  const currentAmountCents = product.price?.amount_in_cents;
  const originalAmountCents = product.original_price?.amount_in_cents;
  const compareAtAmountCents = product.price?.compare_at_amount_in_cents;
  const onSale =
    (currentAmountCents != null &&
      originalAmountCents != null &&
      currentAmountCents < originalAmountCents) ||
    (compareAtAmountCents != null &&
      currentAmountCents != null &&
      currentAmountCents < compareAtAmountCents);

  const strikethroughPrice = onSale
    ? ((product.original_price?.display_amount &&
      product.original_price.display_amount !== displayPrice
        ? product.original_price.display_amount
        : product.price?.display_compare_at_amount) ?? null)
    : null;

  const handleClick = () => {
    if (index != null && listId && listName && currency) {
      trackSelectItem(product, listId, listName, index, currency);
    }
  };

  // Calculate distinct colors from variants if available
  const colorOptionId = product.option_types?.find(
    (ot) => ot.name?.toLowerCase() === "color",
  )?.id;

  let colorCount = 0;
  if (colorOptionId && product.variants?.length) {
    const uniqueColors = new Set();
    for (const variant of product.variants) {
      const colorOpt = variant.option_values?.find(
        (ov) => ov.option_type_id === colorOptionId,
      );
      if (colorOpt) uniqueColors.add(colorOpt.id);
    }
    colorCount = uniqueColors.size;
  } else if (!colorOptionId && product.variants?.length) {
    // Fallback: if we have variants but no color option type, we just show variant count if > 1
    colorCount = product.variants.length > 1 ? product.variants.length : 0;
  }

  return (
    <div className="group relative flex flex-col font-sans">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
        <ProductImage
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 300px"
          iconClassName="w-16 h-16 opacity-20"
          fetchPriority={fetchPriority}
        />
        {onSale && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-medium px-2 py-1">
            {t("sale")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-foreground group-hover:text-primary/70 transition-colors line-clamp-1">
          {/* Stretched link: the ::after overlay keeps the whole card clickable
              without wrapping the content in an <a> — HiddenPricePrompt renders
              its own link, and anchors can't nest. */}
          <Link
            href={`${basePath}/products/${product.slug}${categoryId ? `?category_id=${categoryId}` : ""}`}
            className="after:absolute after:inset-0"
            onClick={handleClick}
          >
            {product.name}
          </Link>
        </h3>

        {/* Real Variant Colors */}
        {colorCount > 1 && (
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {colorCount} Options
          </p>
        )}

        <div className="mt-1 flex items-center gap-2">
          {displayPrice ? (
            <span className="text-xs text-foreground tracking-wider">
              {displayPrice}
            </span>
          ) : (
            // Null price: a deliberate hide inside a HiddenPricingProvider
            // (renders a sign-in prompt), otherwise renders nothing.
            <HiddenPricePrompt />
          )}
          {onSale && strikethroughPrice && (
            <span className="text-[10px] text-muted-foreground line-through tracking-wider">
              {strikethroughPrice}
            </span>
          )}
        </div>

        {!product.purchasable && (
          <span className="mt-1 text-[10px] uppercase tracking-widest text-destructive font-medium">
            {t("outOfStock")}
          </span>
        )}
      </div>
    </div>
  );
});
