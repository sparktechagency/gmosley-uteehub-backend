import z from 'zod';

const statusEnum = z.enum(['active', 'blocked', 'disabled'], {
  required_error: 'Status is required!',
  invalid_type_error: 'Invalid status type. Allowed values are active, blocked, or disabled.',
});

// Validation schema for user creation
const createUserZodSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required!',
      })
      .min(1, 'First name must not be empty!'),

    lastName: z
      .string({
        required_error: 'Last name is required!',
      })
      .min(1, 'Last name must not be empty!'),

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

    isEmailVerified: z.boolean().optional().default(false),

    status: statusEnum.optional().default('active'),

    verification: z
      .object({
        code: z.string().nullable().optional(),
        expireDate: z.date().nullable().optional(),
      })
      .optional(),

    isSocial: z.boolean().optional().default(false),

    fcmToken: z.string().nullable().optional(),
  }),
});

// Validation schema for fetching a specific user by ID
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
