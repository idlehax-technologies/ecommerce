import { Box, Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <Box p={3}>
      <Skeleton variant="text" width={200} height={40} />
      <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
    </Box>
  );
}
