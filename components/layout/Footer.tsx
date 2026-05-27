'use client';

import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: '#fff',
        py: 2,
        textAlign: 'center',
        marginTop: '40px',
        boxShadow: `
      0px -2px 4px -1px rgba(0,0,0,0.2),
      0px -4px 5px 0px rgba(0,0,0,0.14),
      0px -1px 10px 0px rgba(0,0,0,0.12)
    `,
      }}
    >
      <Typography variant="body2" sx={{ marginTop: '2px' }}>
        © {new Date().getFullYear()} My Ecommerce Store
      </Typography>

      <Typography
        variant="caption"
        sx={{ opacity: 0.8, display: 'block', marginTop: '4px' }}
      >
        Built with Next.js & MUI
      </Typography>
    </Box>
  );
};

export default Footer;
