import * as z from "zod";

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
// export const SignUpSchemaType = z.infer<typeof SignUpSchema>
