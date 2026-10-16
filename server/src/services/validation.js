import { z } from 'zod';

export const linkSchema = z.object({
  original_url: z.string()
    .url("Format URL tidak valid. Harus diawali dengan http:// atau https://")
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: "Protokol harus http atau https"
    }),
  alias: z.string()
    .min(3, "Alias minimal 3 karakter")
    .max(30, "Alias maksimal 30 karakter")
    .regex(/^[a-zA-Z0-9-_]+$/, "Alias hanya boleh berisi huruf, angka, tanda hubung, dan underscore")
});