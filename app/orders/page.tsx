"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";

const orders = [
  {
    id: "ORD123",
    date: "12 Jan 2026",
    total: "₹1,999",
    status: "Delivered",
  },
  {
    id: "ORD124",
    date: "15 Jan 2026",
    total: "₹899",
    status: "Processing",
  },
];

export default function order(){
    return (
        <Box p={3} maxWidth='800px' mx="auto">
            <Typography  variant="h4" gutterBottom  sx={{mt:2}}>
                My Orders
            </Typography>
            {orders.length==0&&( //Here everything we put into {} becaz JSX works like this everyhting it see as a expression .
                <Typography color="text.secondary">
                    No Orders Yet.
                </Typography> //Here && not a condition it means if oder.length==0 become true the typography part will executed its a special function of jsx to work less.Means if you want to write that if something is true then it will happend {write the condition && its function}
                
            )}
            {orders.map((order)=>(
                <Card key={order.id} sx={{
                    mb:2,
                    borderRadius: 3,
                    
                    boxShadow:3,
                    }}>
                    <CardContent>
                        <Box 
                           display="flex"
                           justifyContent="space-between"
                           alignItems="center"
                        
                        >
                            <Typography>
                                Order: {order.id}
                            </Typography>
                            <Typography>
                                <Chip 
                                 label={order.status}
                                 color={order.status==="Delivered"?"success":"warning"}
                                 size="small" 
                                 sx={{minWidth: 90,justifyContent: "center"}}
                                 
                                
                                />
                            </Typography>
                            
                        </Box>
                        <Divider sx={{my:1}}/>
                        <Typography variant="body2" color="text.secondary">
                            Date: {order.date}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                            Price: {order.total}
                        </Typography>
                    
                      
                    </CardContent>

                </Card>

            ))}


        </Box>
    );

}
