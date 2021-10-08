/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

/**
 * JsonConverter wrapper.
 */
export interface IJsonConverterService {
  /**
   * Deserializes a JSON object into another object.
   *
   * @param json The JSON object.
   * @param classReference The class reference of the expected object.
   */
  deserialize<T>(json: any, classReference: new() => T): T;
}
export const IJsonConverterService = Symbol.for('IJsonConverterService');
