"use client";

import { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Box,
} from "@mui/material";

import type { Product } from "@/types/product";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";

type CreateProps = {
  mode: "create";
  onSubmit: (values: CreateProductDTO) => Promise<void>;
};

type EditProps = {
  mode: "edit";
  initial: Product;
  onSubmit: (values: UpdateProductDTO) => Promise<void>;
  onDelete?: () => Promise<void>;
};

type Props = CreateProps | EditProps;

export default function ProductForm(props: Props) {
  const { mode, onSubmit } = props;

  const initial = mode === "edit" ? props.initial : undefined;
  const onDelete = mode === "edit" ? props.onDelete : undefined;

  const [values, setValues] = useState<CreateProductDTO>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? 0,
    stock: initial?.stock ?? 0,
    sku: initial?.sku ?? "",
    category: initial?.category ?? "",
    tags: initial?.tags ?? [],
    images: initial?.images ?? [],
  });

  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof values>(k: K, v: typeof values[K]) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          required
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
        />

        <TextField
          label="Description"
          multiline
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />

        <TextField
          label="Price (paise)"
          type="number"
          slotProps={{
            htmlInput: { min: 0, step: 1 }
          }}
          value={values.price}
          onChange={(e) => set("price", Number(e.target.value))}
        />

        <TextField
          label="Stock"
          type="number"
          slotProps={{
            htmlInput: { min: 0, step: 1 }
          }}
          value={values.stock}
          onChange={(e) => set("stock", Number(e.target.value))}
        />

        <TextField
          label="SKU"
          value={values.sku}
          onChange={(e) => set("sku", e.target.value)}
        />

        <TextField
          label="Category"
          value={values.category}
          onChange={(e) => set("category", e.target.value)}
        />

        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create"
                : "Save"}
          </Button>

          {mode === "edit" && onDelete && (
            <Button
              color="error"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
