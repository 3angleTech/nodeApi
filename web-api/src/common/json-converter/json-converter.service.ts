/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
import { injectable } from 'inversify';
import { JsonConvert, ValueCheckingMode } from 'json2typescript';
import { IJsonConverterService } from './json-converter.service.interface';

@injectable()
export class JsonConverterService implements IJsonConverterService {

  public deserialize<T>(json: unknown, classReference: new() => T): T {
    return this.jsonConvert.deserialize(json, classReference) as T;
  }

  private get jsonConvert(): JsonConvert {
    const jsonConverter = new JsonConvert();
    jsonConverter.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
    return jsonConverter;

  }
}
