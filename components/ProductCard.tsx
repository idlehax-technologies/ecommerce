import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
    return (

        <Card>
            <CardContent>
                <Typography variant="h6">
                    {product.name}
                </Typography>
                <Typography color="text.secondary">
                    {product.price}
                </Typography>
                <Typography variant="body2">
                    {product.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} href={`products/${product.id}`}>
                    View Item
                </Button>
            </CardActions>
        </Card>

    );
}
