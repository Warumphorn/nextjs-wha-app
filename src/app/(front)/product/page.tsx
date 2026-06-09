import FeaturesProduct from "@/components/features-product";
import { getProducts } from "@/lib/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
  description: "รายการสินค้าจากฐานข้อมูล eCommerce",
};

// http://localhost:3000/product
export default async function ProductPage() {
  const products = await getProducts();

  return (
    <main>
      <FeaturesProduct products={products} />
    </main>
  );
}
