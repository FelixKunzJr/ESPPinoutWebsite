import { useApp } from '../../context/AppContext'
import { resolveInfo } from '../../data/info/resolveInfo'
import { CollapsibleCard } from '../CollapsibleCard'

export function SpecsSection() {
  const { chip } = useApp()
  const { specs } = resolveInfo(chip)
  const rows: Array<[string, string]> = [
    ['CPU', `${specs.cores}x ${specs.arch}, up to ${specs.cpuMaxMhz} MHz`],
    ['SRAM', `${specs.sramKb} KB`],
    ['ROM', `${specs.romKb} KB`],
    ...(specs.flash ? [['Flash', specs.flash] as [string, string]] : []),
    ...(specs.psram ? [['PSRAM', specs.psram] as [string, string]] : []),
    ['Radios', chip.module?.radios ?? ''],
  ]
  return (
    <CollapsibleCard title={`\u{1F4CB} Specs - ${chip.name}`}>
      <table className="w-full text-xs">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-gray-800/60 first:border-t-0">
              <td className="py-1.5 pr-3 text-gray-500 font-medium align-top whitespace-nowrap">{k}</td>
              <td className="py-1.5 text-gray-200">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {specs.notable && specs.notable.length > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          <span className="text-gray-500">Notable: </span>{specs.notable.join(' · ')}
        </p>
      )}
    </CollapsibleCard>
  )
}
