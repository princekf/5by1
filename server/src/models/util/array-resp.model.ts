import { Entity, model, property } from '@loopback/repository';
import { ArrayResponse as ArrayReponseInft } from '@shared/util/array-resp';

@model()
export class ArrayReponse extends Entity implements ArrayReponseInft {

    @property.array(String)
    data: Array<string>;

}
