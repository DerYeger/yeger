export class Match {
  public readonly startInOld: number
  public readonly startInNew: number
  public readonly size: number

  public readonly endInOld: number
  public readonly endInNew: number

  public constructor(startInOld: number, startInNew: number, size: number) {
    this.startInOld = startInOld
    this.startInNew = startInNew
    this.size = size
    this.endInOld = this.startInOld + this.size
    this.endInNew = this.startInNew + this.size
  }
}
