export interface LinkParams {
  file: string
  line: number
  column: number
  title: string
}

export function createOpenInEditorHandler(
  _base: string,
  disableInspectorOnEditorOpen: boolean,
  onDisable: () => void
) {
  return async (baseUrl: string | URL, file?: string, line?: number, column?: number) => {
    const _url =
      baseUrl instanceof URL
        ? baseUrl
        : `${baseUrl}/__open-in-editor?file=${encodeURIComponent(`${file}:${line}:${column}`)}`

    const promise = fetch(_url, {
      mode: 'no-cors',
    })

    if (disableInspectorOnEditorOpen) promise.then(onDisable)

    return promise
  }
}

export function createOpenInEditorUrl(
  base: string,
  file: string,
  line: string,
  column: string
): URL {
  return new URL(
    `${base}__open-in-editor?file=${encodeURIComponent(`${file}:${line}:${column}`)}`,
    import.meta.url
  )
}

export function createEmptyLinkParams(): LinkParams {
  return {
    file: '',
    line: 0,
    column: 0,
    title: '',
  }
}

export function shouldShowContainer(
  toggleButtonVisibility: 'always' | 'active' | 'never',
  enabled: boolean
): boolean {
  return toggleButtonVisibility === 'always' || (toggleButtonVisibility === 'active' && enabled)
}
