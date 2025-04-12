import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { ProductTable } from "./products";
import { UserTable } from "./user";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";

export type productDetails = {
  name: string;
  description: string;
  imageUrl: string;
};

export const PurchasesTable = pgTable("purchases", {
  id,
  pricePaidInCents: integer().notNull(),
  productDetails: jsonb().notNull().$type<productDetails>(), // keep the original product details incase the product is changed
  userId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  productId: uuid()
    .notNull()
    .references(() => ProductTable.id, { onDelete: "restrict" }),
  stripeSessionId: text().notNull().unique(),
  refundedAt: timestamp({ withTimezone: true }),
  createdAt,
  updatedAt,
});

export const PurchasesRelationShips = relations(PurchasesTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PurchasesTable.userId],
    references: [UserTable.id],
  }),
  product: one(ProductTable, {
    fields: [PurchasesTable.productId],
    references: [ProductTable.id],
  }),
}));
