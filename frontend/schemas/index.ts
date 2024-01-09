import { z } from "zod";

export const loginSchema = z.object({
  userName: z
    .string()
    .min(1, {
      message: "Username is required.",
    })
    .max(20, {
      message: "Username must be at most 20 characters.",
    })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username must only contain letters, numbers, and underscores."
    ),
  password: z
    .string()
    .min(1, {
      message: "Password is required.",
    })
    .max(32, {
      message: "Password must be at most 32 characters.",
    }),
});

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, {
        message: "First name must be at least 2 characters.",
      })
      .max(32, {
        message: "First name must be at most 32 characters.",
      }),
    lastName: z
      .string()
      .min(2, {
        message: "Last name must be at least 2 characters.",
      })
      .max(32, {
        message: "Last name must be at most 32 characters.",
      }),
    userName: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(32, {
        message: "Username must be at most 32 characters.",
      })
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username must only contain letters, numbers, and underscores."
      ),
    email: z.string().email({
      message: "Email must be a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be at most 32 characters.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .max(32, {
      message: "Email must be at most 32 characters.",
    }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be at most 32 characters.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  image: z.string().nullable().optional(),
  firstName: z.string().max(32, {
    message: "First name must be at most 32 characters.",
  }),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  deliveryAddress: z
    .object({
      country: z.string().optional(),
      street: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      province: z.string().optional(),
      label: z.string().optional(),
    })
    .optional(),
  billingAddress: z
    .object({
      country: z.string().optional(),
      street: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      province: z.string().optional(),
      label: z.string().optional(),
    })
    .optional(),
  website: z.string().url().optional(),
  notes: z
    .string()
    .max(500, {
      message: "Notes must be at most 500 characters.",
    })
    .optional(),
  tagIds: z.array(z.number()).optional(),
  isFavorite: z.boolean().optional(),
});

export const userSchema = z.object({
  image: z.string().nullable(),
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(32, {
      message: "First name must be at most 32 characters.",
    }),
  lastName: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .max(32, {
      message: "Last name must be at most 32 characters.",
    }),
  userName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(20, {
      message: "Username must be at most 20 characters.",
    })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username must only contain letters, numbers, and underscores."
    ),
  email: z.string().email({
    message: "Email must be a valid email address.",
  }),
});

export const tagSchema = z.object({
  name: z.string().max(32, {
    message: "Tag name must be at most 32 characters.",
  }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be at most 32 characters.",
      }),
    newPassword: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(32, {
        message: "Password must be at most 32 characters.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(32, {
      message: "Password must be at most 32 characters.",
    }),
});

export const newEmailSchema = z.object({
  newEmail: z.string().email({
    message: "Email must be a valid email address.",
  }),
});
