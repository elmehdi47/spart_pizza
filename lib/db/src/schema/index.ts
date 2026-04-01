import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const mediaSettings = pgTable("media_settings", {
  id: serial("id").primaryKey(),
  slot: varchar("slot", { length: 50 }).unique().notNull(),
  imageUrl: text("image_url").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameFr: varchar("name_fr", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
