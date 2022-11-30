/**
 * Label configuration.
 */
export interface Label {
  /**
   * The color of the label.
   * Can be any valid CSS expression.
   */
  readonly color: string
  /**
   * The font size of the label.
   * Can be any valid CSS expression.
   */
  readonly fontSize: string
  /**
   * The text of the label.
   */
  readonly text: string
}
