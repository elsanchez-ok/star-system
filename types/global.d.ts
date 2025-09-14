declare global {
  interface Window {
    scannerListener?: (event: KeyboardEvent) => void
    scannerBuffer?: string[]
    scannerTimeout?: NodeJS.Timeout
  }
}

export {}
