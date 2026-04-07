import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between bg-[#faf7f3] border border-[#e8e4dc] rounded-2xl px-5 py-4">
      <div>
        <p className="font-lora text-[15px] text-[#1c1c1a] mb-0.5">
          Already have an account?
        </p>
        <p className="text-xs text-[#9b9590]">
          Sign in for a more personal atelier experience.
        </p>
      </div>
      <LocalizedClientLink
        href="/account"
        className="flex-shrink-0 ml-4 px-4 py-2 border border-[#1c1c1a] text-sm text-[#1c1c1a] rounded-xl hover:bg-[#1c1c1a] hover:text-white transition-all duration-200"
        data-testid="sign-in-button"
      >
        Sign in
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
