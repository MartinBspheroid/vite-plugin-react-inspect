import { useMemo } from 'react'
import inspectorOptions from 'virtual:react-inspector-options'
import { parseToggleCombo } from '../utils/keyboard'
import {
  type Position,
  calculateBannerPosition,
  calculateFloatPosition,
  calculateSizeIndicatorStyle,
  parseToggleButtonPosition,
} from '../utils/positioning'
import { shouldShowContainer } from '../utils/editor'

// @ts-expect-error - Virtual module

export interface InspectorConfig {
  base: string
  toggleCombo: string[] | false
  disableInspectorOnEditorOpen: boolean
  animation: boolean
  containerVisible: (enabled: boolean) => boolean
  containerPosition: Record<string, string>
  bannerPosition: Record<string, string>
  floatsStyle: (position: Position, floatsElement: HTMLElement | null) => Record<string, string>
  sizeIndicatorStyle: (position: Position) => Record<string, string>
}

export function useInspectorConfig(): InspectorConfig {
  const config = useMemo((): InspectorConfig => {
    return {
      base: inspectorOptions.base,
      toggleCombo: parseToggleCombo(inspectorOptions.toggleComboKey),
      disableInspectorOnEditorOpen: inspectorOptions.disableInspectorOnEditorOpen,
      animation: !inspectorOptions.reduceMotion,

      containerVisible: (enabled: boolean) =>
        shouldShowContainer(inspectorOptions.toggleButtonVisibility, enabled),

      containerPosition: parseToggleButtonPosition(inspectorOptions.toggleButtonPos),

      bannerPosition: calculateBannerPosition(inspectorOptions.toggleButtonPos),

      floatsStyle: (position: Position, floatsElement: HTMLElement | null) =>
        calculateFloatPosition(position, floatsElement),

      sizeIndicatorStyle: (position: Position) =>
        calculateSizeIndicatorStyle(position),
    }
  }, [])

  return config
}
