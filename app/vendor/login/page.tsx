"use client";
import { useState } from "react";
import {Box,Typography,TextField,Button,Alert} from "@mui/material";
import Link from "next/link";
export default function Loginpage(){
    const[loading,SetLoading]=useState(false);
    const[error,SetError]=useState("");
    const handleLoading=()=>{
        SetLoading(true);
        SetError("");


        setTimeout(()=>{
        SetLoading(false);
        SetError("Mock login only. No backend connected.");


    },1000);

    };
    




    return(
        <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3}>
            <Typography variant="h5" gutterBottom textAlign="center">
                Vendor Login
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField 
            label="Email"
            margin="normal"
            fullWidth
            />
            <TextField 
            label="Password"
            type="password"
            margin="normal"
            fullWidth
            />
            <Typography
            component={Link}
            href="/forgot-password"
            variant="body2"
            color="primary"
            sx={{
            display: "block",
            textAlign: "right",
            mt: 1,
            textDecoration: "none","&:hover": {
            textDecoration: "underline"},}}
            >
                Forgot password?
            </Typography>
            <TextField
        fullWidth
        label="Role"
        value="Vendor"
        margin="normal"
        disabled
      />
            
            <Button 
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleLoading}
            disabled={loading}>
                {loading?"Loading In...":"Login"}
            </Button>
            <Typography
            variant="body2"
            textAlign="center"
            sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Typography  component={Link}
                href="/vendor/signup"
                color="primary"
                sx={{ textDecoration: "none","&:hover":{textDecoration:"underline"}, 
                   
                }}
                >
                    Signup
                </Typography>
            </Typography>

                
           
        </Box>
    );
} 