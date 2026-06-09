"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Stack,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import {
  createProduct,
  updateProduct,
} from "@/lib/api/products";

import type { Product } from "@/types/product";
import { useSnackbar } from "@/contexts/SnackbarContext";

import {
  GST_RATES,
  type GstRate,
} from "@/lib/products/gst";

import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/lib/products/categories";

type ProductFormValues = {
  title: string;
  description: string;
  price: number;

  gstRate: GstRate | "";
  hsnCode: string;

  category: ProductCategory | "";
  tags: string[];
  images: string[];
};

type Props =
  | {
    mode: "create";
  }
  | {
    mode: "edit";
    product: Product;
  };

export default function ProductForm(props: Props) {
  const router = useRouter();

  const { show } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const product =
    props.mode === "edit"
      ? props.product
      : null;

  const [values, setValues] =
    useState<ProductFormValues>({
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      gstRate: product?.gstRate ?? "",
      hsnCode: product?.hsnCode ?? "",
      category: product?.category ?? "",
      tags: product?.tags ?? [],
      images: product?.images ?? [],
    });

  async function submit() {
    if (values.gstRate === "") {
      show("GST Rate is required", "error");
      return;
    }

    if (values.category === "") {
      show("Category is required", "error");
      return;
    }

    const payload = {
      ...values,
      gstRate: values.gstRate,
      category: values.category,
    };

    try {
      setLoading(true);

      if (props.mode === "create") {
        const { product } = await createProduct(payload);
        router.push(`/platform/products/${product.productId}`);

      } else {
        await updateProduct(props.product.productId, payload);
        router.refresh();
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        show(err.message, "error");
      } else {
        show("Failed to save product", "error");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        required
        value={values.title}
        onChange={(e) =>
          setValues({ ...values, title: e.target.value })
        }
      />

      <TextField
        label="Description"
        required
        multiline
        minRows={3}
        value={values.description}
        onChange={(e) =>
          setValues({ ...values, description: e.target.value })
        }
      />

      <TextField
        label="Selling Price (paise, incl. GST)"
        type="number"
        required
        slotProps={{
          htmlInput: {
            min: 1,
            step: 1,
          },
        }}
        value={values.price}
        onChange={(e) =>
          setValues({ ...values, price: Number(e.target.value) })
        }
      />

      <TextField
        select
        label="GST Rate (%)"
        required
        value={values.gstRate}
        onChange={(e) =>
          setValues({
            ...values,
            gstRate: Number(e.target.value) as ProductFormValues["gstRate"],
          })
        }
      >
        <MenuItem value="">
          Select GST Rate
        </MenuItem>
        {GST_RATES.map((rate) => (
          <MenuItem
            key={rate}
            value={rate}
          >
            {rate}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="HSN Code"
        required
        value={values.hsnCode}
        onChange={(e) =>
          setValues({ ...values, hsnCode: e.target.value })
        }
      />

      <TextField
        select
        label="Category"
        required
        value={values.category}
        onChange={(e) =>
          setValues({
            ...values,
            category: e.target.value as ProductFormValues["category"],
          })
        }
      >
        <MenuItem value="">
          Select Category
        </MenuItem>
        {PRODUCT_CATEGORIES.map((category) => (
          <MenuItem
            key={category.code}
            value={category.name}
          >
            {category.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Tags"
        required
        value={values.tags.join(", ")}
        onChange={(e) =>
          setValues({
            ...values,
            tags: e.target.value.split(","),
          })
        }
      />

      <TextField
        label="Images"
        required
        value={values.images.join(", ")}
        onChange={(e) =>
          setValues({
            ...values,
            images: e.target.value.split(","),
          })
        }
      />

      <Button
        variant="contained"
        disabled={loading}
        onClick={submit}
      >
        {loading
          ? props.mode === "create"
            ? "Creating Product..."
            : "Saving Changes..."
          : props.mode === "create"
            ? "Create Product"
            : "Save Changes"}
      </Button>
    </Stack>
  );
}