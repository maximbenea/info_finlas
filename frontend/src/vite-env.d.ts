/// <reference types="vite/client" />
// Importuri `path?url` pentru asset-uri statice (img, audio, video).

declare module '*?url' {
  const src: string
  export default src
}
