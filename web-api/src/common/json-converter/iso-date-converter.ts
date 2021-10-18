/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { JsonConverter, JsonCustomConvert } from 'json2typescript';

@JsonConverter
export class ISODateConverter implements JsonCustomConvert<Date> {
  public serialize(date: Date | undefined): string | undefined {
    return date?.toISOString();
  }

  public deserialize(isoString: unknown): Date | undefined {
    if (typeof isoString === 'string') {
      const millis = Date.parse(isoString);
      if (!isNaN(millis)) {
        return new Date(millis);
      }
    }
    return undefined;
  }
}
