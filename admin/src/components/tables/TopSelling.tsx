import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTopSellingProducts } from "@/lib/api";

interface TopSellingProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  unitSold: number;
  sales: number;
}

const TopSelling = () => {
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchTopSellingProducts();
        setTopSellingProducts(response);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading top products...</span>
          </div>
        ) : (
        <div className="overflow-y-auto max-h-[250px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Sales Made</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSellingProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No products data available
                  </TableCell>
                </TableRow>
              ) : (
              topSellingProducts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">PROD-{item.id.substring(0, 4).toLocaleUpperCase()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.unitSold}</TableCell>
                  <TableCell>GHS {item.sales.toFixed(2)}</TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopSelling;