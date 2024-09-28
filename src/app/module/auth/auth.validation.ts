const { z } = require('zod');

const loginValidation = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
});

export const AuthValidation = {
  loginValidation,
}
