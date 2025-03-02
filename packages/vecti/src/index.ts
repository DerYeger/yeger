/**
 * An immutable 2D Vector that supports various operations.
 * @public
 */
export class Vector {
  public readonly x: number
  public readonly y: number
  /**
   * Create a vector with the given components.
   * @param x - The component of the x-axis.
   * @param y - The component of the y-axis.
   * @returns The vector.
   */
  public static of([x, y]: [number, number]): Vector {
    return new Vector(x, y)
  }

  /**
   * Create a vector with the given components.
   * @param x - The component of the x-axis.
   * @param y - The component of the y-axis.
   * @returns The vector.
   */
  public constructor(
    x: number,
    y: number,
  ) {
    this.x = x
    this.y = y
  }

  /**
   * Add another vector to the vector.
   * @param val - The vector to be added.
   * @returns The resulting vector of the addition.
   */
  public add(val: Vector): Vector {
    return new Vector(this.x + val.x, this.y + val.y)
  }

  /**
   * Subtract another vector from the vector.
   * @param val - The vector to be added.
   * @returns The resulting vector of the subtraction.
   */
  public subtract(val: Vector): Vector {
    return new Vector(this.x - val.x, this.y - val.y)
  }

  /**
   * Multiply the vector by a scalar.
   * @param scalar - The scalar the vector will be multiplied by.
   * @returns The resulting vector of the multiplication.
   */
  public multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  /**
   * Divide the vector by a scalar.
   * @param scalar - The scalar the vector will be divided by.
   * @returns The resulting vector of the division.
   */
  public divide(scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar)
  }

  /**
   * Calculate the dot product of the vector and another vector.
   * @param other - The other vector used for calculating the dot product.
   * @returns The dot product.
   */
  public dot(other: Vector): number {
    return this.x * other.x + this.y * other.y
  }

  /**
   * Calculate the cross product of the vector and another vector. The cross product of two vectors `a` and `b` is defined as `a.x * b.y - a.y * b.x`.
   * @param other - The other vector used for calculating the cross product.
   * @returns The cross product.
   */
  public cross(other: Vector): number {
    return this.x * other.y - other.x * this.y
  }

  /**
   * Calculate the Hadamard product of the vector and another vector.
   * @param other - The other vector used for calculating the Hadamard product.
   * @returns The Hadamard product.
   */
  public hadamard(other: Vector): Vector {
    return new Vector(this.x * other.x, this.y * other.y)
  }

  /**
   * Calculate the length of the vector using the L2 norm.
   * @returns The length.
   */
  public length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  /**
   * Normalize the vector using the L2 norm.
   * @returns The normalized vector.
   */
  public normalize(): Vector {
    const length = this.length()
    return new Vector(this.x / length, this.y / length)
  }

  /**
   * Rotate the vector by the given radians counterclockwise.
   * @param radians - The radians the vector will be rotated by.
   * @returns The rotated vector.
   */
  public rotateByRadians(radians: number): Vector {
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos)
  }

  /**
   * Rotate the vector by the given degrees counterclockwise.
   * @param degrees - The degrees the vector will be rotated by.
   * @returns The rotated vector.
   */
  public rotateByDegrees(degrees: number): Vector {
    return this.rotateByRadians((degrees * Math.PI) / 180)
  }
}
