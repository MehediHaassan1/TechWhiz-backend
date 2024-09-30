const { z } = require('zod');

const loginValidation = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
});

const changePasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});


export const AuthValidation = {
  loginValidation,
  changePasswordValidation,
  refreshTokenValidation,
}
