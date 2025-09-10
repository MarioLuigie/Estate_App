import { z } from 'zod';

export const PropertyFormSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	type: z.string().min(1, 'Select only 1 type'),
	description: z
		.string()
		.min(10, 'Description must be at least 10 characters'),
	address: z.string().min(5),
	latitude: z.number(),
	longitude: z.number(),
	price: z.number().min(0),
	area: z.number().min(0),
	bedrooms: z.number().min(1),
	bathrooms: z.number().min(1),
	rating: z.number().min(1).max(5),
	facilities: z.array(z.string()).optional(),
	image: z.string().optional(),
	ownerId: z.string(),
	geolocation: z.string(),
	gallery: z.array(z.string()).optional(),
	reviews: z.array(z.string()).optional(),
	agent: z.string(),
});

export type PropertyFormValues = z.infer<typeof PropertyFormSchema>;
