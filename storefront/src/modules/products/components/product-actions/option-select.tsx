import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = option.values?.map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
        {title}
      </label>
      <div className="flex flex-wrap gap-3" data-testid={dataTestId}>
        {filteredOptions?.map((v) => {
          const isActive = v === current
          return (
            <button
              onClick={() => updateOption(option.title ?? "", v ?? "")}
              key={v}
              disabled={disabled}
              data-testid="option-button"
              className={
                isActive
                  ? "px-6 py-2 bg-[#6f4627] text-white rounded-md font-medium text-sm transition-all"
                  : "px-6 py-2 border border-outline-variant text-on-surface-variant rounded-md font-medium text-sm hover:bg-surface-container-low transition-all"
              }
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
