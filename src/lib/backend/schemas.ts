import { z } from "zod";

export const quoteRequestLineSchema = z.object({
  seriesSlug: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().int().min(1).max(200),
});

export const quoteRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  need: z.string().min(5),
  lines: z.array(quoteRequestLineSchema).default([]),
});

export const dealerApplicationSchema = z.object({
  company: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  licenseNumber: z.string().optional(),
  serviceArea: z.string().optional(),
  businessType: z.string().optional(),
  monthlyVolume: z.string().optional(),
  brands: z.string().optional(),
  notes: z.string().optional(),
});

export const contactRequestSchema = z.object({
  topic: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(4),
});
