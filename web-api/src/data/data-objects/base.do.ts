/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { JsonProperty } from 'json2typescript';

import { ISODateConverter } from '../../common/json-converter';

export class BaseDataObject {
  @JsonProperty('createdBy', Number, true)
  public createdBy: number = undefined;

  @JsonProperty('updatedBy', Number, true)
  public updatedBy: number = undefined;

  @JsonProperty('createdAt', ISODateConverter, true)
  public createdAt: Date = undefined;

  @JsonProperty('updatedAt', ISODateConverter, true)
  public updatedAt: Date = undefined;
}
