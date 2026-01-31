"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import type { Product } from "@/types/product";

type Props = {
  initialData?: Product;
  submitLabel: string;
  onSubmit: (data: any) => Promise<void>;
};

export default function ProductForm({
  initialData,
  submitLabel,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    stock: initialData?.stock ?? 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box maxWidth={500}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          label="Price (₹)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={() => onSubmit(form)}
        >
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
