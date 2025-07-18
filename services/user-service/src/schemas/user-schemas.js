const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
});

const getUserSchema = z.object({
  userId: z.string().uuid(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
};
