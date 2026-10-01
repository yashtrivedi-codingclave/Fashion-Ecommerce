"use client";

import type { Media, Product, Variant } from "@spree/sdk";
import { CircleCheckBig, CircleX, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { QuantityPickerField } from "@/components/cart/QuantityPickerField";
import { HiddenPricePrompt } from "@/components/products/HiddenPricePrompt";
import { MediaGallery } from "@/components/products/MediaGallery";
import { ProductCustomFields } from "@/components/products/ProductCustomFields";
import { VariantPicker } from "@/components/products/VariantPicker";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useHiddenPricing } from "@/contexts/HiddenPricingContext";
import { useStore } from "@/contexts/StoreContext";
import { trackAddToCart, trackViewItem } from "@/lib/analytics/gtm";

interface ProductDetailsProps {
  product: Product;
  basePath: string;
}

export function ProductDetails({ product, basePath }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { currency } = useStore();
  const t = useTranslations("products");
  const tw = useTranslations("wholesale");
  // Non-null inside a HiddenPricingProvider (wholesale `prices_hidden`, guest
  // view): prices are null on purpose, and ordering is gated behind sign-in.
  const hiddenPricing = useHiddenPricing();
  const pricesHidden = hiddenPricing !== null;

  // Filter variants list
  const variants = useMemo(() => {
    return (product.variants || []).filter(Boolean);
  }, [product.variants]);

  const hasVariants = variants.length > 0;
  const optionTypes = product.option_types || [];

  // Initialize with default variant or first available variant
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(() => {
    if (product.default_variant) {
      return product.default_variant;
    }
    if (hasVariants) {
      return variants.find((v) => v.purchasable) || variants[0];
    }
    // For products without variants, use default variant
    return product.default_variant || null;
  });

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Track product view (analytics - client-only side effect)
  useEffect(() => {
    trackViewItem(product, currency);
  }, [product, currency]);

  const galleryImages = useMemo((): Media[] => {
    return product.media || [];
  }, [product.media]);

  const variantImageIndex = useMemo((): number | null => {
    if (!selectedVariant) return null;
    const index = galleryImages.findIndex((m) =>
      m.variant_ids.includes(selectedVariant.id),
    );
    return index >= 0 ? index : null;
  }, [selectedVariant, galleryImages]);

  const price = selectedVariant?.price ?? product.price;
  const originalPrice =
    selectedVariant?.original_price ?? product.original_price;
  const displayPrice = price?.display_amount;

  const currentAmountCents = price?.amount_in_cents;
  const originalAmountCents = originalPrice?.amount_in_cents;
  const compareAtAmountCents = price?.compare_at_amount_in_cents;
  const onSale =
    (currentAmountCents != null &&
      originalAmountCents != null &&
      currentAmountCents < originalAmountCents) ||
    (compareAtAmountCents != null &&
      currentAmountCents != null &&
      currentAmountCents < compareAtAmountCents);

  const strikethroughPrice = onSale
    ? ((originalPrice?.display_amount &&
      originalPrice.display_amount !== displayPrice
        ? originalPrice.display_amount
        : price?.display_compare_at_amount) ?? null)
    : null;

  const sku = selectedVariant?.sku ?? product.default_variant?.sku;

  // Purchasability
  const isPurchasable = hasVariants
    ? (selectedVariant?.purchasable ?? false)
    : (product.purchasable ?? false);

  const inStock = hasVariants
    ? (selectedVariant?.in_stock ?? false)
    : (product.in_stock ?? false);

  const handleAddToCart = async () => {
    const variantId =
      selectedVariant?.id ||
      product.default_variant?.id ||
      product.default_variant_id;
    if (!variantId) {
      throw new Error("No variant selected");
    }

    setLoading(true);
    await addItem(variantId, quantity);
    setLoading(false);
    trackAddToCart(product, selectedVariant, quantity, currency);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-14">
        {/* Media Gallery */}
        <div>
          <MediaGallery
            images={galleryImages}
            productName={product.name}
            activeIndex={variantImageIndex}
          />
        </div>

        {/* Product Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="font-serif text-3xl font-normal leading-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-center gap-4">
            {displayPrice ? (
              <span className="font-serif text-3xl font-normal text-foreground sm:text-4xl">
                {displayPrice}
              </span>
            ) : (
              <HiddenPricePrompt className="inline-flex items-center gap-1.5 text-base font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900" />
            )}
            {onSale && strikethroughPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {strikethroughPrice}
                </span>
                <span className="bg-secondary px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-foreground">
                  {t("sale")}
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CircleCheckBig className="w-5 h-5" />
                {t("inStock")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CircleX className="w-5 h-5" />
                {t("outOfStock")}
              </span>
            )}
          </div>

          {/* Variant Picker */}
          {hasVariants && optionTypes.length > 0 && (
            <div className="mt-7 border-y border-border py-6">
              <VariantPicker
                variants={variants}
                optionTypes={optionTypes}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mt-8">
            {pricesHidden ? (
              // Guest on a prices-hidden channel: no pricing, no ordering —
              // route them through the wholesale sign-in first.
              <Button asChild size="lg">
                <Link href={hiddenPricing.signInHref}>
                  {tw("hiddenPrice.signInToOrder")}
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <QuantityPickerField
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  size="lg"
                />

                {/* Add to Cart Button */}
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={loading || !isPurchasable}
                  className="h-12 flex-1 rounded-none bg-[#211c18] text-[10px] uppercase tracking-[0.16em] text-white hover:bg-[#3b332d]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      {t("adding")}
                    </>
                  ) : isPurchasable ? (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      {t("addToCart")}
                    </>
                  ) : (
                    t("outOfStock")
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description_html && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-foreground">
                {t("description")}
              </h2>
              {/* Description is admin-authored HTML from the Spree CMS backend (trusted source) */}
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: product.description_html,
                }}
              />
            </div>
          )}

          {/* Custom Fields */}
          <ProductCustomFields customFields={product.custom_fields} />

          {/* Product Details */}
          <div className="mt-8 border-t border-border pt-6">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-foreground">
              {t("details")}
            </h2>
            <dl className="space-y-3">
              {sku && (
                <div className="flex">
                  <dt className="w-32 text-gray-500 text-sm">{t("sku")}</dt>
                  <dd className="text-gray-900 text-sm">{sku}</dd>
                </div>
              )}
              {selectedVariant?.options_text && (
                <div className="flex">
                  <dt className="w-32 text-gray-500 text-sm">{t("options")}</dt>
                  <dd className="text-gray-900 text-sm">
                    {selectedVariant.options_text}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
