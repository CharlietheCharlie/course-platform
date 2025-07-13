import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

const ProductCard = ({
  id,
  name,
  description,
  priceInDollars,
  imageUrl,
}: {
  id: string;
  name: string;
  description: string;
  priceInDollars: number;
  imageUrl: string;
}) => {
  return (
    <Card className="overflow-hidden flex flex-col w-full max-w-[500px] mx-auto">
      <div className="relative aspect-video w-full">
        <Image src={imageUrl} alt={name} fill={true} className="object-cover" />
      </div>
      <CardHeader className="space-y-0">
        <CardDescription>
          <Suspense fallback={formatPrice(priceInDollars)}>
            <Price price={priceInDollars}></Price>
          </Suspense>
        </CardDescription>
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full text-md py-2" asChild>
          <Link href={`/products/${id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

async function Price({ price }: { price?: number } = {}) {
  return null;
}
