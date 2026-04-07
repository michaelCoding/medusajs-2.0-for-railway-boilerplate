"use client"

import { useEffect, useRef, useState } from "react"
import { useActionState } from "react"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"

const AddAddress = ({ region }: { region: HttpTypes.StoreRegion }) => {
  const [isOpen, setIsOpen] = useState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    success: false,
    error: null,
  })

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formState.success) {
      setIsOpen(false)
      formRef.current?.reset()
    }
  }, [formState.success])

  return (
    <div
      className="rounded-2xl border border-dashed border-[#d4cfc7] bg-[#faf7f3] overflow-hidden transition-all duration-300"
      data-testid="add-address-container"
    >
      {/* Collapsed state — add button */}
      <div className={`transition-all duration-300 ${isOpen ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-full min-h-[140px] p-6 flex flex-col items-center justify-center gap-3 group"
          data-testid="add-address-button"
        >
          <div className="w-10 h-10 rounded-full border border-[#d4cfc7] flex items-center justify-center text-[#9b9590] group-hover:border-[#6f4627] group-hover:text-[#6f4627] transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-lora text-[14px] text-[#9b9590] group-hover:text-[#1c1c1a] transition-colors">
            Add new address
          </span>
        </button>
      </div>

      {/* Expanded state — inline form */}
      <div className={`transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="font-lora text-[15px] text-[#1c1c1a]">New Address</p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#9b9590] hover:text-[#1c1c1a] transition-colors p-1"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <form ref={formRef} action={formAction} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First name" name="first_name" required autoComplete="given-name"
                data-testid="first-name-input" />
              <Input label="Last name" name="last_name" required autoComplete="family-name"
                data-testid="last-name-input" />
            </div>
            <Input label="Company" name="company" autoComplete="organization"
              data-testid="company-input" />
            <Input label="Address" name="address_1" required autoComplete="address-line1"
              data-testid="address-1-input" />
            <Input label="Apartment, suite, etc." name="address_2" autoComplete="address-line2"
              data-testid="address-2-input" />
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <Input label="Postal code" name="postal_code" required autoComplete="postal-code"
                data-testid="postal-code-input" />
              <Input label="City" name="city" required autoComplete="locality"
                data-testid="city-input" />
            </div>
            <Input label="Province / State" name="province" autoComplete="address-level1"
              data-testid="state-input" />
            <CountrySelect name="country_code" region={region} required autoComplete="country"
              data-testid="country-select" />
            <Input label="Phone" name="phone" autoComplete="phone"
              data-testid="phone-input" />

            {formState.error && (
              <p className="text-xs text-[#c0392b] bg-[#fef0f0] px-3 py-2 rounded-lg" data-testid="address-error">
                {formState.error}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 text-sm text-[#6b6860] border border-[#e8e4dc] rounded-xl hover:bg-[#f0ede8] transition-all"
                data-testid="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-sm text-white bg-[#1c1c1a] rounded-xl hover:bg-[#2d2d2a] transition-all"
                data-testid="save-button"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddAddress
