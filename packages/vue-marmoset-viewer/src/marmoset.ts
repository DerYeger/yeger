export const marmosetViewerDefaultOptions = {
  width: 800,
  height: 600,
  autoStart: false,
}

/**
 * The id of the Marmoset script tag.
 */
export const marmosetScriptId = 'marmoset-script'
const marmosetScriptUrl = 'https://viewer.marmoset.co/main/marmoset.js'

let loadingInProgress = false
let loadingCompleted = false

/**
 * Loads the Marmoset script asynchronously and only once.
 * @returns Promise that resolves when Marmoset is available.
 */
export function loadMarmoset(): Promise<void> {
  return new Promise((resolve) => {
    if (loadingCompleted) {
      resolve()
      return
    }
    if (loadingInProgress) {
      document
        .getElementById(marmosetScriptId)
        ?.addEventListener('load', () => resolve())
      return
    }
    loadingInProgress = true
    const marmosetScript = document.createElement('script')
    marmosetScript.setAttribute('src', marmosetScriptUrl)
    marmosetScript.id = marmosetScriptId
    marmosetScript.addEventListener('load', () => {
      loadingInProgress = false
      loadingCompleted = true
      resolve()
    })
    document.head.appendChild(marmosetScript)
  })
}

export declare interface Marmoset {
  /**
   * Embeds a viewer instance to the document body.
   * @param src - URL of the mview file.
   * @param options - Options for the viewer.
   * @returns Marmoset.WebViewer that has been embedded.
   */
  embed(src: string, options: Marmoset.WebViewerOptions): Marmoset.WebViewer

  /**
   * Fetches the thumbnail of a mview file. Request size will be around 64KB.
   * @param src - URL of the mview file.
   * @param onLoad - Callback that receives the fetched image.
   * @param onError - Callback for error scenarios.
   * @param image - Target image buffer. If not present, a new buffer will be created.
   */

  fetchThumbnail(
    src: string,
    onLoad: (image: any) => void,
    onError?: () => void,
    image?: any
  ): void

  /**
   * Custom viewer URL. Must be set before any viewer instances are created.
   */
  hostURL?: string

  /**
   * Custom viewer logo URL. Must be set before any viewer instances are created.
   */
  hostImage?: string

  /**
   * Enable transparent background. Must be set before any viewer instances are created.
   */
  transparentBackground?: boolean

  /**
   * Hide the user interface. Must be set before any viewer instances are created.
   */
  noUserInterface?: boolean
}

export declare namespace Marmoset {
  export class WebViewer {
    /**
     * Creates a Marmoset viewer with the given size and file.
     * @param width - Width of the viewer.
     * @param height - Height of the viewer.
     * @param src - URL of the mview file.
     */
    public constructor(width: number, height: number, src: string)

    /**
     * HTMLDivElement containing the viewer.
     */
    public domRoot: HTMLDivElement

    /**
     * Loads the scene immediately.
     */
    public loadScene(): void

    /**
     * Callback that is called once the scene has been loaded.
     */
    public onLoad?: () => void

    /**
     * Resizes the viewer instance using the given dimensions.
     * @param width - New width of the viewer.
     * @param height - New height of the viewer.
     */
    public resize(width: number, height: number): void

    /**
     * Unloads the viewer instance and frees used resources.
     */
    public unload(): void
  }

  /**
   * Options for the Marmoset WebViewer.
   */
  export interface WebViewerOptions {
    /**
     * Width of the viewer instance.
     */
    width?: number

    /**
     * Height of the viewer instance.
     */
    height?: number

    /**
     * If true, the viewer instance loads the scene without user interaction.
     */
    autoStart?: boolean

    /**
     * If true, the viewer instance starts in fullscreen mode.
     */
    fullFrame?: boolean

    /**
     * If true, the viewer instance will wrap itself in a prebuilt HTML page.
     */
    pagePreset?: boolean

    /**
     * Thumbnail of the viewer instance.
     */
    thumbnailURL?: string
  }
}

declare global {
  interface Window {
    marmoset: Marmoset & typeof Marmoset
  }
}
