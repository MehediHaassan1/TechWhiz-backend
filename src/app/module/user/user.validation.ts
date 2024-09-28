import { z } from 'zod';

const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(['user', 'admin']).default('user'),
    gender: z.enum(['male', 'female'], { message: 'Gender must be male or female!' }),
    birthday: z.string(),
    profileImage: z.string().url("Invalid URL").optional()
  })
});


const updateUserValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    gender: z.enum(['male', 'female'], { message: 'Gender must be male or female!' }).optional(),
    birthday: z.string().optional(),
    profileImage: z.string().url("Invalid URL").optional(),
    bio: z.string().optional(),
    userName: z.string().optional(),
  })
})

export const UserValidation = {
  createUserValidation,
  updateUserValidation,
}
