import { getProducts, getCourses, getApiVersion } from "@/lib/services";

export async function GET() {
  try {
    const [products, courses, version] = await Promise.all([
      getProducts(),
      getCourses(),
      getApiVersion(),
    ]);

    return Response.json({ products, courses, version });
  } catch {
    return Response.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
