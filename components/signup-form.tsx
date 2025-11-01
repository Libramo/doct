"use client";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { SignUpSchema } from "@/lib/validations";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Button } from "./ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  async function onSubmit(formValues: z.infer<typeof SignUpSchema>) {
    // Do something with the form values.
    setLoading(true);
    console.log("Formvalues", formValues);

    await authClient.signUp.email(
      {
        email: formValues.email, // user email address
        password: formValues.password, // user password -> min 8 characters by default
        name: formValues.name, // user display name
        callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
      },

      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          router.push("/dashboard");
          console.log(ctx.data);
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
          alert("unable to sign-up");
        },
      }
    );
    setLoading(false);
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Créer un compte Docto-djib</CardTitle>
        <CardDescription>
          Entrez vos informations ci-dessous pour créer votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nom complet</FieldLabel>
                  <Input type="text" {...field} placeholder="John Doe" />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} type="email" placeholder="m@example.com" />
                  <FieldDescription>
                    Nous l&apos;utiliserons pour vous contacter. Nous ne
                    partagerons pas votre adresse e-mail avec qui que ce soit
                    d'autre.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Mot de passe</FieldLabel>
                  <div className="relative">
                    <Input
                      type={isVisible ? "text" : "password"}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="*********"
                    />
                    <button
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}
                      aria-controls="password"
                    >
                      {isVisible ? (
                        <EyeOffIcon size={16} aria-hidden="true" />
                      ) : (
                        <EyeIcon size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <FieldDescription>
                    Doit comporter au moins 8 caractères.
                  </FieldDescription>

                  {fieldState.invalid ?? (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creation de compte..." : "Créer compte"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Déja un compte ? <Link href={"/login"}>Se connecter</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
