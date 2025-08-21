export function isKeyActive(key: string, event: KeyboardEvent): boolean {
  switch (key) {
    case 'shift':
    case 'control':
    case 'alt':
    case 'meta':
      return event.getModifierState(
        key.charAt(0).toUpperCase() + key.slice(1),
      )
    default:
      return key === event.key.toLowerCase()
  }
}

export function createKeydownHandler(
  toggleCombo: string[] | false,
  onToggle: () => void,
  onDisable?: () => void,
): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    if (event.repeat || event.key === undefined)
      return

    // Handle Esc key to disable inspector
    if (event.key === 'Escape' && onDisable) {
      onDisable()
      return
    }

    // Handle toggle combo
    if (!toggleCombo)
      return

    const isCombo = toggleCombo.every(key => isKeyActive(key, event))
    if (isCombo)
      onToggle()
  }
}

export function parseToggleCombo(toggleComboKey?: string | false): string[] | false {
  if (typeof toggleComboKey === 'string')
    return toggleComboKey.toLowerCase()?.split?.('-') ?? false
  else
    return false
}
