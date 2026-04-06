"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { signup } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

function JoinButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-white bg-gradient-to-r from-[#6f4627] to-[#8b5e3c] font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-60"
      data-testid="register-button"
    >
      {pending ? "Creating account…" : "Join the Atelier"}
    </button>
  )
}

const inputCls =
  "block w-full px-4 py-3 rounded-lg bg-[#e5e2dd] border-none focus:bg-white focus:ring-2 focus:ring-[#6f4627]/30 transition-all text-[#1c1c19] outline-none placeholder:text-[#83746b]"

const labelCls = "block text-sm font-medium text-[#51443c]"

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <main
      className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 medium:px-8 bg-[#fcf9f4]"
      data-testid="register-page"
    >
      <div className="max-w-5xl w-full grid grid-cols-1 medium:grid-cols-2 gap-12 items-center">

        {/* ── Left: editorial image + quote ─────────────────── */}
        <div className="hidden medium:block relative">
          <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
            <img
              src="/images/register_right_pic.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating quote card */}
          <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-xl shadow-lg border-l-4 border-[#6f4627] max-w-[280px]">
            <p className="font-lora italic text-xl text-[#6f4627] leading-relaxed">
              &ldquo;Every piece tells a story of the forest. Join us in curating a life of intention.&rdquo;
            </p>
            <p className="mt-4 text-xs tracking-widest text-[#83746b] uppercase">
              — The Founder&apos;s Note
            </p>
          </div>
        </div>

        {/* ── Right: registration form ───────────────────────── */}
        <div className="flex flex-col space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-lora text-4xl font-bold tracking-tight text-[#1c1c19]">
              Begin your journey
            </h1>
            <p className="text-[#51443c]">
              Create your account and enter our digital atelier.
            </p>
          </div>

          <form className="space-y-6" action={formAction}>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first_name" className={labelCls}>First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Julian"
                  className={inputCls}
                  data-testid="first-name-input"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="last_name" className={labelCls}>Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  autoComplete="family-name"
                  placeholder="Vibe"
                  className={inputCls}
                  data-testid="last-name-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className={labelCls}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="hello@woodenly.com"
                className={inputCls}
                data-testid="email-input"
              />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className={labelCls}>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className={inputCls}
                  data-testid="password-input"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm_password" className={labelCls}>Confirm Password</label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-0.5 h-5 w-5 text-[#6f4627] border-[#d5c3b8] rounded focus:ring-[#6f4627]"
              />
              <label htmlFor="terms" className="text-sm text-[#51443c]">
                I agree to the{" "}
                <LocalizedClientLink
                  href="/terms-and-conditions"
                  className="text-[#6f4627] underline decoration-[#f4bb92] decoration-2 underline-offset-4"
                >
                  Terms of Service
                </LocalizedClientLink>{" "}
                and{" "}
                <LocalizedClientLink
                  href="/privacy-policy"
                  className="text-[#6f4627] underline decoration-[#f4bb92] decoration-2 underline-offset-4"
                >
                  Privacy Policy
                </LocalizedClientLink>
                .
              </label>
            </div>

            {/* Error */}
            {typeof message === "string" && message && (
              <p className="text-sm text-red-600">{message}</p>
            )}

            <JoinButton />
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#e5e2dd]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#fcf9f4] text-[#51443c]">Or continue with</span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 rounded-xl bg-[#f6f3ee] border border-[#d5c3b8]/20 hover:bg-[#ebe8e3] transition-colors"
            >
              <span className="text-sm font-semibold text-[#1c1c19]">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 rounded-xl bg-[#f6f3ee] border border-[#d5c3b8]/20 hover:bg-[#ebe8e3] transition-colors"
            >
              <span className="text-sm font-semibold text-[#1c1c19]">Apple</span>
            </button>
          </div>

          {/* Sign-in link */}
          <p className="text-center text-[#51443c]">
            Already have an account?{" "}
            <button
              onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
              className="font-semibold text-[#6f4627] hover:underline decoration-[#f4bb92] decoration-2 underline-offset-4"
            >
              Sign In
            </button>
          </p>

        </div>
      </div>
    </main>
  )
}

export default Register
