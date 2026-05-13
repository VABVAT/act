"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createProductAction, updateProductAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField, FormNote } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryRecord, ProductRecord } from "@/lib/data/types";
import { initialActionState } from "@/lib/utils/action-state";

type ProductFormProps = {
  categories: CategoryRecord[];
  product?: ProductRecord | null;
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const formId = product ? `product-form-${product.id}` : "product-form-new";
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction] = useActionState(action, initialActionState);
  const [sizes, setSizes] = useState(
    product?.sizes.length
      ? product.sizes.map((size) => ({
          size: size.size,
          quantity: size.quantity,
        }))
      : [],
  );
  const [tags, setTags] = useState(product?.tags.join(", ") ?? "");
  const [existingImages, setExistingImages] = useState(
    product?.images.map((image) => image.imageUrl) ?? [],
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message || "Product saved.");
      router.push("/admin/products");
    }
  }, [router, state]);

  return (
    <>
      <form id={formId} action={formAction} className="grid gap-6 pb-28 md:pb-0">
        <Card className="grid gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              {product ? "Edit product" : "New product"}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-none text-foreground md:text-5xl">
              {product ? product.name : "Create a product"}
            </h1>
            {!product ? (
              <p className="mt-3 text-sm text-muted">
                You can create a listing with minimal details now and complete it later.
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField error={state.fieldErrors?.name?.[0]} label="Product name">
              <Input defaultValue={product?.name} name="name" placeholder="Optional for now" />
            </FormField>
            <FormField error={state.fieldErrors?.sku?.[0]} label="SKU">
              <Input defaultValue={product?.sku} name="sku" placeholder="Auto-generated if left blank" />
            </FormField>
            <FormField error={state.fieldErrors?.categoryId?.[0]} label="Category">
              <Select defaultValue={product?.categoryId ?? ""} name="categoryId">
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField error={state.fieldErrors?.color?.[0]} label="Color">
              <Input defaultValue={product?.color} name="color" placeholder="Optional for now" />
            </FormField>
            <FormField error={state.fieldErrors?.fabric?.[0]} label="Fabric">
              <Input defaultValue={product?.fabric} name="fabric" placeholder="Optional for now" />
            </FormField>
            <FormField error={state.fieldErrors?.price?.[0]} label="Price">
              <Input defaultValue={product?.price} min="0" name="price" placeholder="0" type="number" />
            </FormField>
            <FormField error={state.fieldErrors?.discountedPrice?.[0]} label="Discounted price">
              <Input
                defaultValue={product?.discountedPrice ?? ""}
                min="0"
                name="discountedPrice"
                type="number"
              />
            </FormField>
            <FormField label="Tags">
              <Input
                name="tags"
                placeholder="festive, wedding, embroidery"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </FormField>
          </div>
          <FormField error={state.fieldErrors?.description?.[0]} label="Description">
            <Textarea defaultValue={product?.description} name="description" placeholder="Optional for now" />
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField error={state.fieldErrors?.deliveryInformation?.[0]} label="Delivery information">
              <Textarea
                defaultValue={product?.deliveryInformation}
                name="deliveryInformation"
                placeholder="Optional for now"
              />
            </FormField>
            <FormField error={state.fieldErrors?.returnPolicy?.[0]} label="Return policy">
              <Textarea defaultValue={product?.returnPolicy} name="returnPolicy" placeholder="Optional for now" />
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-background-soft px-4 py-3 text-sm font-semibold text-foreground">
              <input defaultChecked={product?.featured} name="featured" type="checkbox" />
              Featured product
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-line bg-background-soft px-4 py-3 text-sm font-semibold text-foreground">
              <input defaultChecked={product ? product.isActive : true} name="isActive" type="checkbox" />
              Available on storefront
            </label>
          </div>
        </Card>

        <Card className="grid gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">Size-wise inventory</p>
              <p className="text-sm text-muted">Track quantity for each size.</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setSizes((current) => [...current, { size: "", quantity: 0 }])
              }
            >
              <Plus className="size-4" />
              Add size
            </Button>
          </div>
          <div className="grid gap-3">
            {sizes.map((size, index) => (
              <div
                key={`${size.size}-${index}`}
                className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px_auto] sm:items-center"
              >
                <Input
                  aria-label={`Size ${index + 1}`}
                  value={size.size}
                  placeholder="Size"
                  onChange={(event) =>
                    setSizes((current) =>
                      current.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, size: event.target.value }
                          : entry,
                      ),
                    )
                  }
                />
                <Input
                  aria-label={`Quantity for size ${index + 1}`}
                  min="0"
                  type="number"
                  value={size.quantity}
                  onChange={(event) =>
                    setSizes((current) =>
                      current.map((entry, entryIndex) =>
                        entryIndex === index
                          ? { ...entry, quantity: Number(event.target.value) }
                          : entry,
                      ),
                    )
                  }
                />
                <Button
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setSizes((current) => current.filter((_, entryIndex) => entryIndex !== index))
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="grid gap-5">
          <div>
            <p className="text-lg font-semibold text-foreground">Product images</p>
            <p className="text-sm text-muted">
              Upload multiple images if you have them. You can also save the listing without images for now.
            </p>
          </div>
          {existingImages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {existingImages.map((imageUrl) => (
                <div key={imageUrl} className="relative overflow-hidden rounded-[22px] border border-line bg-background-soft p-2">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[18px]">
                    <Image alt="Product preview" className="object-cover" fill sizes="200px" src={imageUrl} />
                  </div>
                  <button
                    className="mt-2 inline-flex items-center text-xs font-semibold text-danger"
                    type="button"
                    onClick={() =>
                      setExistingImages((current) =>
                        current.filter((entry) => entry !== imageUrl),
                      )
                    }
                  >
                    Remove image
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <FormField label="Upload images">
            <Input accept="image/*" multiple name="images" type="file" />
          </FormField>
        </Card>

        <input name="sizes" type="hidden" value={JSON.stringify(sizes)} />
        <input name="existingImages" type="hidden" value={JSON.stringify(existingImages)} />

        {state.message ? (
          <FormNote tone={state.status === "success" ? "success" : "danger"}>
            {state.message}
          </FormNote>
        ) : null}

        <div className="hidden flex-wrap gap-3 md:flex">
          <Button size="lg" type="submit">
            {product ? "Update product" : "Create product"}
          </Button>
          <Button
            size="lg"
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
        </div>
      </form>

      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-40 md:hidden">
        <div className="content-wrap">
          <div className="surface-card flex items-center gap-3 rounded-[26px] border border-line/70 p-3 shadow-[0_24px_70px_rgba(120,84,60,0.2)] backdrop-blur-xl">
            <Button className="min-w-0 flex-1" form={formId} size="lg" type="submit">
              {product ? "Update product" : "Create product"}
            </Button>
            <Button
              className="min-w-0 flex-1"
              size="lg"
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
