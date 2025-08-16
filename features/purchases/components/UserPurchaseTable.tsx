import { SkeletonArray, SkeletonButton, SkeletonText } from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";

export function UserPurchaseTable({
  purchases,
}: {
  purchases: {
    id: string;
    pricePaidInCents: number;
    refundedAt: Date | null;
    productDetails: {
      name: string;
      imageUrl: string;
    };
    createdAt: Date;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((purchase) => (
          <TableRow key={purchase.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <Image
                  className="object-cover rounded size-12"
                  src={purchase.productDetails.imageUrl}
                  alt={purchase.productDetails.name}
                  width={192}
                  height={192}
                ></Image>
                <div className="flex flex-col gap-1">
                  <div className="font-semibold">
                    {purchase.productDetails.name}
                  </div>
                  <div className="text-muted-foreground">
                    {formatDate(purchase.createdAt)}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {purchase.refundedAt ? (
                <Badge variant="outline">Refunded</Badge>
              ) : (
                formatPrice(purchase.pricePaidInCents / 100)
              )}
            </TableCell>
            <TableCell>
              <Button asChild variant="outline">
                <Link href={`/purchases/${purchase.id}`}>View Details</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function UserPurchaseTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <SkeletonArray amount={3}>
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="bg-secondary animate-pulse size-12 rounded"></div>
                <div className="flex flex-col gap-1">
                  <SkeletonText className="w-36"></SkeletonText>
                  <SkeletonText className="w-3/4"></SkeletonText>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <SkeletonText className="w-12"></SkeletonText>
            </TableCell>
            <TableCell>
                <SkeletonButton ></SkeletonButton>
            </TableCell>
          </TableRow>
        </SkeletonArray>
      </TableBody>
    </Table>
  );
}
