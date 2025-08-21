export interface Position {
  x: number
  y: number
  width: number
  height: number
}

export interface FloatStyle {
  left: string
  top: string
}

export interface SizeIndicatorStyle {
  left: string
  top: string
  width: string
  height: string
}

export function calculateFloatPosition(
  position: Position,
  floatsElement: HTMLElement | null,
): FloatStyle {
  let margin = 10
  let x = position.x + position.width / 2
  let y = position.y + position.height + 5
  let floatsWidth = floatsElement?.clientWidth ?? 0
  let floatsHeight = floatsElement?.clientHeight ?? 0

  x = Math.max(margin, x)
  x = Math.min(x, window.innerWidth - floatsWidth - margin)
  if (x < floatsWidth / 2)
    x = floatsWidth / 2 + margin

  y = Math.max(margin, y)
  y = Math.min(y, window.innerHeight - floatsHeight - margin)

  return {
    left: `${x}px`,
    top: `${y}px`,
  }
}

export function calculateSizeIndicatorStyle(position: Position): SizeIndicatorStyle {
  return {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${position.width}px`,
    height: `${position.height}px`,
  }
}

export function parseToggleButtonPosition(toggleButtonPos: string): Record<string, string> {
  const positions = toggleButtonPos.split('-')
  const result: Record<string, string> = {}

  for (const position of positions)
    result[position] = '15px'

  return result
}

export function calculateBannerPosition(toggleButtonPos: string): Record<string, string> {
  const [x, y] = toggleButtonPos.split('-')
  return {
    [x === 'top' ? 'bottom' : 'top']: '-45px',
    [y]: '0',
  }
}

export function getElementRect(element: Element): Position {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  }
}
