import z from 'zod';

const statusEnum = z.enum(['active', 'blocked', 'disabled'], {
  required_error: 'Status is required!',
  invalid_type_error: 'Invalid status type. Allowed values are active, blocked, or disabled.',
});

const createUserZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required!',
      })
      .min(1, 'Name must not be empty!'),

    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email('Invalid email address!'),

    phone: z
      .string({
        required_error: 'Phone number is required!',
      })
      .min(10, 'Phone number must be at least 10 digits!')
      .regex(/^\d+$/, 'Phone number must only contain digits!'),

    password: z
      .string({
        required_error: 'Password is required!',
      })
      .min(8, 'Password must be at least 8 characters!'),

    isEmailVerified: z
      .preprocess((val) => val === 'true' || val === true, z.boolean())
      .optional()
      .default(false),

    status: z
      .preprocess((val) => val?.toString(), statusEnum)
      .optional()
      .default('active'),

    verification: z
      .object({
        code: z.string().nullable().optional(),
        expireDate: z
          .preprocess((val) => (val ? new Date(val as string) : null), z.date().nullable())
          .optional(),
      })
      .optional(),

    fcmToken: z.string().nullable().optional(),
  }),
});


const getSpecificUserZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'User ID is missing in request params!',
    }),
  }),
});

const UserValidationZodSchema = {
  createUserZodSchema,
  getSpecificUserZodSchema,
};

export default UserValidationZodSchema;
