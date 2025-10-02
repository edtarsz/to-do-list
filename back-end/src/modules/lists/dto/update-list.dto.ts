import { PartialType } from '@nestjs/mapped-types';
import { CreateListDTO } from './create-list.dto';

export class UpdateListDTO extends PartialType(CreateListDTO) { }