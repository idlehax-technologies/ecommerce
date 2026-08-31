"use client";

import Link from "next/link";

import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function Footer() {

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"));

  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: "appBar",

        py: { xs: 1, sm: 2 },
        px: { xs: 2, sm: 3 },

        bgcolor: "background.default",

        borderTop: 1,
        borderColor: "divider",
      }}
    >
      {smUp ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            ©{"\u00A0"}{year}{"\u00A0"}everyShop.in{" | "}All{"\u00A0"}Rights{"\u00A0"}Reserved
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Designed{"\u00A0"}and{"\u00A0"}Developed{"\u00A0"}by{" "}
            <Link
              href="https://www.idlehax.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              Idlehax{"\u00A0"}Technologies
            </Link>
          </Typography>
        </Stack>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          ©{"\u00A0"}{year}{"\u00A0"}everyShop.in{" • "}By{"\u00A0"}
          <Link
            href="https://www.idlehax.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit" }}
          >
            Idlehax{"\u00A0"}Technologies
          </Link>
        </Typography>
      )}
    </Box>
  );
}