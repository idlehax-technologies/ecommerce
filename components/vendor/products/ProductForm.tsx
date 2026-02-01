"use client";

import { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Box,
} from "@mui/material";
import type { Product } from "@/types/product";

type Props = {
  mode: "create" | "edit";
  initial?: Product;
  onSubmit: (values: any) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export default function ProductForm({
  mode,
  initial,
  onSubmit,
  onDelete,
}: Props) {
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? 0,
    stock: initial?.stock ?? 0,
    sku: initial?.sku ?? "",
    category: initial?.category ?? "",
  });

  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof values>(k: K, v: any) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSubmit(values);
    setSaving(false);
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />

        <TextField
          label="Description"
          multiline
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />

        <TextField
          label="Price (₹ in paise)"
          type="number"
          value={values.price}
          onChange={(e) => set("price", Number(e.target.value))}
        />

        <TextField
          label="Stock"
          type="number"
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
          <Button type="submit" variant="contained" disabled={saving}>
            {mode === "create" ? "Create" : "Save"}
            {/* {mode === "create" ? "Create" : saving ? "Saving..." : "Save"} */}
          </Button>

          {mode === "edit" && onDelete && (
            <Button color="error" onClick={onDelete}>
              Delete
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
