import '@testing-library/jest-dom'

// jsdom ships no ResizeObserver; components that observe layout need one to
// exist so their effects run the same code path they do in a browser.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver
