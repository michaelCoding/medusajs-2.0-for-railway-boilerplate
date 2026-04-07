import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
  // used to determine which values are available given current selections
  variants?: HttpTypes.StoreProductVariant[]
  selectedOptions?: Record<string, string | undefined>
}

function isVariantInStock(variant: HttpTypes.StoreProductVariant): boolean {
  if (!variant.manage_inventory) return true
  if (variant.allow_backorder) return true
  return (variant.inventory_quantity ?? 0) > 0
}

function optionsAsKeymap(variantOptions: any): Record<string, string> {
  return (variantOptions ?? []).reduce(
    (acc: Record<string, string>, varopt: any) => {
      if (varopt.option && varopt.value != null) acc[varopt.option.title] = varopt.value
      return acc
    },
    {}
  )
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  variants,
  selectedOptions = {},
}) => {
  const filteredOptions = option.values?.map((v) => v.value) ?? []

  const isValueAvailable = (value: string): boolean => {
    if (!variants?.length) return true
    // Build the options combination to test: everything selected so far + this value
    const testOptions = { ...selectedOptions, [option.title ?? ""]: value }
    return variants.some((v) => {
      const map = optionsAsKeymap(v.options)
      // All keys in testOptions must match (ignore unset keys)
      const matches = Object.entries(testOptions).every(
        ([k, val]) => val === undefined || map[k] === val
      )
      return matches && isVariantInStock(v)
    })
  }

  return (
    <div className="flex flex-col gap-y-3">
      <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
        {title}
      </label>
      <div className="flex flex-wrap gap-3" data-testid={dataTestId}>
        {filteredOptions.map((v) => {
          const isActive = v === current
          const available = isValueAvailable(v ?? "")

          return (
            <button
              onClick={() => updateOption(option.title ?? "", v ?? "")}
              key={v}
              disabled={disabled || !available}
              data-testid="option-button"
              title={!available ? "Out of stock" : undefined}
              className={
                isActive
                  ? "px-6 py-2 bg-[#6f4627] text-white rounded-md font-medium text-sm transition-all"
                  : !available
                  ? "relative px-6 py-2 border border-outline-variant text-on-surface-variant/40 rounded-md font-medium text-sm cursor-not-allowed overflow-hidden"
                  : "px-6 py-2 border border-outline-variant text-on-surface-variant rounded-md font-medium text-sm hover:bg-surface-container-low transition-all"
              }
            >
              {v}
              {/* Strikethrough diagonal line for unavailable */}
              {!available && !isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="10" y1="90" x2="90" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                  </svg>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
