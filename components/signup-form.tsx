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
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignupForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

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
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-auto">
          <CardHeader>
            <CardTitle>S'inscrire</CardTitle>
            <CardDescription>Inscrivez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ... */}
            {/* Build the form here */}
            {/* ... */}

            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalide={fieldState.invalid}>
                    <FieldLabel>Nom complet</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalide={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalide={fieldState.invalid}>
                    <FieldLabel>Mot de passe</FieldLabel>
                    <div className="relative">
                      <Input
                        type={isVisible ? "text" : "password"}
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
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

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            {/* </form> */}
          </CardContent>
          <CardFooter>
            <Field className="justify-center" orientation={"horizontal"}>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => form.reset()}
              >
                Réinitialiser
              </Button>
              <Button disabled={loading} type="submit">
                {loading ? "Inscription..." : " S'inscrire"}
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
