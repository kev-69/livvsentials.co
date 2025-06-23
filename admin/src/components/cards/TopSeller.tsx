import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTopSellingProduct } from "@/lib/api"; // Changed from fetchTopSellingProducts

interface TopSellingProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  productImages: string[];
  totalSold: number;
}

const TopSeller = () => {
  const [topProduct, setTopProduct] = useState<TopSellingProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // This now directly fetches just the top product
        const product = await fetchTopSellingProduct();
        setTopProduct(product);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch top selling product:", err);
        setError("Failed to load top product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Clean the image URL (remove brackets and quotes if present)
  const getCleanImageUrl = (url: string | undefined) => {
    if (!url) return '/placeholder-product.jpg';
    return url.replace(/[\[\]"']/g, '');
  };

  // Rest of the component remains the same
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Top Selling Product</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="flex gap-3 items-center">
              <Skeleton className="h-12 w-12 rounded-md" />
              <Skeleton className="h-6 w-[120px]" />
            </div>
            <Skeleton className="h-4 w-[160px]" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : topProduct ? (
          <div className="flex items-start gap-3">
            <div className="h-14 w-14 rounded-md overflow-hidden bg-muted">
              <img 
                src={getCleanImageUrl(topProduct.productImages?.[0])} 
                alt={topProduct.name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.jpg';
                }}
              />
            </div>
            <div>
              <div className="text-lg font-bold line-clamp-1">{topProduct.name}</div>
              <p className="text-xs text-muted-foreground">
                {topProduct.totalSold} units sold this month
              </p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No top selling product found</div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopSeller;