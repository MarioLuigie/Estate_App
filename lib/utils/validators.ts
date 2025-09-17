// modules
import { z } from 'zod';
// lib
import { ActionTypes } from '@/lib/constants/enums';

export const CreatePropertyFormSchema = z.object({
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
	// image: z.string().optional(),
	image: z.array(z.looseObject({})).optional(),
	ownerId: z.string(),
	geolocation: z.string(),
	gallery: z.array(z.string()).optional(),
	reviews: z.array(z.looseObject({})).optional(),
	agent: z.string(),
});

export type PropertyFormValues = z.infer<typeof CreatePropertyFormSchema>;

export const UpdatePropertyFormSchema = CreatePropertyFormSchema.extend({
	$id: z.string().min(1, 'Id is required'),
});

export function getPropertyFormSchema(actionType: ActionTypes) {
	switch (actionType) {
		case ActionTypes.CREATE:
			return CreatePropertyFormSchema;
		case ActionTypes.UPDATE:
			return UpdatePropertyFormSchema;
	}
}
