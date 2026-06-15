// components/auth/FormLogin.tsx

"use client";

import Link from "next/link";
import InputGoogle from "@/components/ui/InputGoogle";
import { useLogin } from "@/core/auth/hooks/useLogin";

export default function FormLogin() {
  const {
    form,
    errors,
    isSubmitting,
    isGoogleLoading,
    handleChange,
    validateFieldIdentifier,
    validateFieldPassword,
    handleSubmit,
    handleGoogleLogin,
  } = useLogin();

  return (
    <div className="relative mx-auto w-full max-w-md mb-3">

      {/* CLOSE BUTTON */}
      <Link
        href="/"
        className="absolute -top-2 -right-2 p-2 rounded-full border border-green-200 hover:bg-green-50 transition-colors"
      >
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Link>

      {/* TITLE */}
      <div className="mb-4 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-[#25C95F]">Login</h2>
        <p className="mt-1 text-sm text-slate-500">Masuk ke akun Sikades Cerdas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* IDENTIFIER (EMAIL/USERNAME) */}
        <InputGoogle 
          id="identifier"
          name="identifier" 
          label="Email / Username" 
          type="text" 
          value={form.identifier}
          onChange={handleChange}
          onBlur={() => validateFieldIdentifier(form.identifier)}
          error={errors.identifier}
          placeholder="johndoe@email.com / johndoe"
          showValidIcon={true}
        />

        {/* PASSWORD */}
        <InputGoogle
          id="password"
          name="password" 
          label="Password" 
          type="password" 
          value={form.password}
          onChange={handleChange}
          onBlur={() => validateFieldPassword(form.password)}
          error={errors.password}
        />

        {/* REMEMBER ME + FORGOT PASSWORD */}
        <div className="flex items-center justify-between">
          <label htmlFor="remember" className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="h-4 w-4 rounded border-slate-300 accent-[#25C95F] cursor-pointer"
            />
            <span>Ingat saya</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-[#25C95F] hover:underline">
            Lupa Password?
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-[#7AF3AE] to-[#25C95F] py-3 text-white font-semibold shadow-md hover:opacity-95 transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Memasuk..." : "Login"}
        </button>

        {/* OR DIVIDER */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-green-300 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-green-50 hover:shadow-md active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
          {isGoogleLoading ? "Loading..." : "Continue with Google"}
        </button>

        {/* REGISTER SPLIT LINE */}
        <div className="flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-slate-200" />
          <div className="flex items-center gap-1 whitespace-nowrap text-sm text-slate-500">
            <span>Belum punya akun?</span>
            <Link href="/register" className="font-semibold text-[#25C95F] hover:underline">Register</Link>
          </div>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* DOT DECOR */}
        <div className="flex justify-center gap-2 pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-100" />
        </div>

      </form>
    </div>
  );
}