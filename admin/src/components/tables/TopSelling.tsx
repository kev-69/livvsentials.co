import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data
const products = [
  {
    id: "PROD-001",
    name: "Black Jeans",
    price: 89.99,
    category: "Denim",
    unitSold: 210,
    sales: 18897.90,
  },
  {
    id: "PROD-002",
    name: "Blue T-Shirt",
    price: 25.99,
    category: "T-Shirts",
    unitSold: 150,
    sales: 3898.50,
  },
  {
    id: "PROD-003",
    name: "Green Hoodie",
    price: 45.00,
    category: "Hoodies",
    unitSold: 100,
    sales: 4500.00,
  },
  {
    id: "PROD-004",
    name: "Red Dress",
    price: 79.99,
    category: "Dresses",
    unitSold: 80,
    sales: 6399.20,
  },
  {
    id: "PROD-005",
    name: "Blue Backpack",
    price: 65.25,
    category: "Bags",
    unitSold: 150,
    sales: 9787.50,
  },
  {
    id: "PROD-006",
    name: "Black Hoodie",
    price: 99.99,
    category: "Hoodies",
    unitSold: 100,
    sales: 9999.00,
  },
  {
    id: "PROD-007",
    name: "Green T-Shirt",
    price: 25.99,
    category: "T-Shirts",
    unitSold: 150,
    sales: 3898.50,
  },
  {
    id: "PROD-008",
    name: "Blue Backpack",
    price: 65.25,
    category: "Bags",
    unitSold: 150,
    sales: 9787.50,
  },
  {
    id: "PROD-009",
    name: "Cream Joggers",
    price: 120.00,
    category: "Joggers",
    unitSold: 120,
    sales: 14400.00,
  },
];

const TopSelling = () => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-y-auto max-h-[250px]">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Units Sold</TableHead>
              <TableHead>Sales Made</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.unitSold}</TableCell>
                <TableCell>${product.sales.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopSelling;