import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <SignUp 
        appearance={{
          baseTheme: undefined,
          elements: {
            rootBox: "bg-slate-900 border border-slate-800 rounded-xl p-8",
            card: "bg-transparent",
            headerTitle: "text-white",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
            socialButtonsBlockButtonText: "text-white",
            dividerLine: "bg-slate-700",
            dividerText: "text-slate-500",
            formFieldLabel: "text-slate-300",
            formFieldInput: "bg-slate-800 border-slate-700 text-white",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            footerActionLink: "text-blue-400 hover:text-blue-300",
          }
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
      />
    </div>
  );
}
