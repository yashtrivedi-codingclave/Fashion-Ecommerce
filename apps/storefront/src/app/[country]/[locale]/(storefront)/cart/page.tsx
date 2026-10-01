"use client";

import type { LineItem } from "@spree/sdk";
import { ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { QuantityPickerField } from "@/components/cart/QuantityPickerField";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";
import { useCart } from "@/contexts/CartContext";
import { trackRemoveFromCart, trackViewCart } from "@/lib/analytics/gtm";
import { extractBasePath } from "@/lib/utils/path";

const ExpressCheckoutButton = dynamic(
  () =>
    import("@/components/checkout/ExpressCheckoutButton").then((m) => ({
      default: m.ExpressCheckoutButton,
    })),
  { ssr: false },
);

export default function CartPage() {
  const { cart, loading, updating, updateItem, removeItem } = useCart();
  const [expressProcessing, setExpressProcessing] = useState(false);
  const pathname = usePathname();
  const basePath = extractBasePath(pathname);
  const viewCartFiredRef = useRef(false);
  const t = useTranslations("cart");
  const tc = useTranslations("common");

  // Track view_cart when cart loads with items
  useEffect(() => {
    if (
      !loading &&
      cart &&
      cart.total_quantity > 0 &&
      !viewCartFiredRef.current
    ) {
      trackViewCart(cart);
      viewCartFiredRef.current = true;
    }
  }, [cart, loading]);

  const handleRemove = async (item: LineItem) => {
    await removeItem(item.id);
    if (cart) {
      trackRemoveFromCart(item, cart.currency);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag
            className="w-24 h-24 text-gray-300 mx-auto"
            strokeWidth={1}
          />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {t("emptyCart")}
          </h1>
          <p className="mt-2 text-gray-500">{t("emptyCartDescription")}</p>
          <div className="mt-6">
            <Button size="lg" asChild>
              <Link href={`${basePath}/products`}>
                {tc("continueShopping")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl font-normal text-foreground sm:text-4xl">
        {t("shoppingCart")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-border border-y border-border">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-5 sm:gap-6 sm:py-7">
                {/* Image */}
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-secondary sm:h-32 sm:w-28">
                  <ProductImage
                    src={item.thumbnail_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-serif text-base text-foreground sm:text-lg">
                    {item.name}
                  </h3>
                  {item.options_text && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.options_text}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-foreground">
                    {item.display_price}
                  </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <QuantityPickerField
                    quantity={item.quantity}
                    onQuantityChange={(quantity) =>
                      updateItem(item.id, quantity)
                    }
                    disabled={updating}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t("removeItemLabel", { name: item.name })}
                    onClick={() => handleRemove(item)}
                    disabled={updating}
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {tc("remove")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border-y border-border bg-[#f3efe7] p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-xl font-normal text-foreground">
              {tc("orderSummary")}
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{tc("subtotal")}</dt>
                <dd className="text-foreground">{cart.display_item_total}</dd>
              </div>
              {cart.discount_total && parseFloat(cart.discount_total) < 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>{tc("discount")}</dt>
                  <dd>{cart.display_discount_total}</dd>
                </div>
              )}
              {cart.delivery_total && parseFloat(cart.delivery_total) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{tc("shipping")}</dt>
                  <dd className="text-foreground">
                    {cart.display_delivery_total}
                  </dd>
                </div>
              )}
              {cart.tax_total && parseFloat(cart.tax_total) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{tc("tax")}</dt>
                  <dd className="text-foreground">{cart.display_tax_total}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-4">
                <dt className="text-base font-medium text-foreground">
                  {tc("total")}
                </dt>
                <dd className="text-base font-medium text-foreground">
                  {cart.display_total}
                </dd>
              </div>

              {cart.gift_card && parseFloat(cart.gift_card_total ?? "0") > 0 ? (
                <div className="flex justify-between text-green-600">
                  <dt>{t("giftCard")}</dt>
                  <dd>-{cart.display_gift_card_total}</dd>
                </div>
              ) : cart.store_credit_total &&
                parseFloat(cart.store_credit_total) > 0 ? (
                <div className="flex justify-between text-green-600">
                  <dt>{t("storeCredit")}</dt>
                  <dd>-{cart.display_store_credit_total}</dd>
                </div>
              ) : null}

              {cart.amount_due &&
                cart.amount_due !== cart.total &&
                parseFloat(cart.amount_due) > 0 && (
                  <div className="border-t pt-4 flex justify-between">
                    <dt className="text-base font-medium text-foreground">
                      {t("amountDue")}
                    </dt>
                    <dd className="text-base font-medium text-foreground">
                      {cart.display_amount_due}
                    </dd>
                  </div>
                )}
            </dl>

            <div className="mt-6 space-y-3">
              {parseFloat(cart.total ?? "0") > 0 && (
                <ExpressCheckoutButton
                  cart={cart}
                  basePath={basePath}
                  onComplete={() => {}}
                  onProcessingChange={setExpressProcessing}
                />
              )}
              {!expressProcessing && (
                <>
                  <Button
                    size="lg"
                    asChild
                    className="h-12 w-full rounded-none bg-[#211c18] text-[10px] uppercase tracking-[0.16em] text-white hover:bg-[#3b332d]"
                  >
                    <Link href={`${basePath}/checkout/${cart.id}`}>
                      {t("proceedToCheckout")}
                    </Link>
                  </Button>
                  <Button variant="link" asChild className="w-full">
                    <Link href={`${basePath}/products`}>
                      {tc("continueShopping")}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
