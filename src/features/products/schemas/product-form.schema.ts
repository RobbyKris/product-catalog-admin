import { z } from "zod";

export const productFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title wajib diisi.")
        .max(100, "Title tidak boleh melebihi 100 karakter."),

    brand: z
        .string()
        .trim()
        .max(80, "Brand tidak boleh melebihi 80 karakter."),

    category: z
        .string()
        .trim()
        .min(1, "Category wajib diisi."),

    price: z
        .number({ error: "Price wajib diisi." })
        .min(0, "Price tidak boleh negatif."),

    discountPercentage: z
        .union([
            z.nan().transform(() => 0),
            z
                .number({ error: "Discount harus berupa angka yang valid." })
                .min(0, "Discount tidak boleh negatif.")
                .max(100, "Discount tidak boleh melebihi 100%."),
        ]),

    stock: z
        .number({ error: "Stock wajib diisi." })
        .int("Stock harus berupa bilangan bulat.")
        .min(0, "Stock tidak boleh negatif."),

    rating: z
        .number({ error: "Rating harus berupa angka yang valid." })
        .min(0, "Rating tidak boleh dibawah 0.")
        .max(5, "Rating tidak boleh melebihi 5."),

    description: z
        .string()
        .trim()
        .min(1, "Description wajib diisi.")
        .max(1000, "Description tidak boleh melebihi 1000 karakter."),

    thumbnail: z
        .string()
        .trim()
        .refine(
            (value) => {
                if (value === "") {
                    return true;
                }

                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
            },
            { message: "Thumbnail wajib berupa URL yang valid." },
        ),
});
