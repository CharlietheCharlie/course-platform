import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable, ProductTable } from "@/drizzle/schema";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";
import ProductForm from "@/features/products/components/ProductForm";
import {
  getProductIdTag,
} from "@/features/products/db/cache";
import { asc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProduct(productId);
  if (product == null) {
    return notFound();
  }
  return (
    <div className="container my-6">
      <PageHeader title="New Product"></PageHeader>
      <ProductForm
        courses={await getCourses()}
        product={{
          ...product,
          courseIds: product.courseProducts.map((cp) => cp.courseId),
        }}
      />
    </div>
  );
}

async function getCourses() {
  "use cache";
  cacheTag(getCourseGlobalTag());
  return db.query.CourseTable.findMany({
    orderBy: asc(CourseTable.name),
    columns: { id: true, name: true },
  });
}

async function getProduct(id: string) {
  "use cache";
  cacheTag(getProductIdTag(id));
  return db.query.ProductTable.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      priceInDollars: true,
      imageUrl: true,
      status: true,
    },
    where: eq(ProductTable.id, id),
    with: {
      courseProducts: {
        columns: { courseId: true },
      },
    },
  });
}
