import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type StatusDocument = Status & Document;

export enum StatusType {
  INITIAL = 'initial',
  INTERVIEW = 'interview',
  FINAL = 'final',
  OTHER = 'other',
  CALLBACK = 'callback'
}

@Schema({
  timestamps: true,
  versionKey: false
})
export class Status {
  @ApiProperty({ 
    example: 'На розгляді',
    description: 'Назва статусу кандидата'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ 
    example: '#FFD700',
    description: 'Колір статусу в HEX форматі'
  })
  @Prop({ required: true })
  color: string;

  @ApiProperty({ 
    example: 'Кандидат знаходиться на етапі розгляду резюме',
    description: 'Детальний опис статусу'
  })
  @Prop()
  description?: string;

  @ApiProperty({ 
    example: 1,
    description: 'Порядковий номер для сортування'
  })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({ 
    enum: StatusType,
    example: StatusType.INITIAL,
    description: 'Тип статусу (початковий, інтерв\'ю, фінальний, інший)'
  })
  @Prop({ 
    type: String,
    enum: StatusType,
    default: StatusType.OTHER
  })
  type: StatusType;

  @ApiProperty({ 
    example: false,
    description: 'Чи є статус статусом за замовчуванням'
  })
  @Prop({ default: false })
  isDefault: boolean;

  @ApiProperty({ 
    example: true,
    description: 'Чи є статус активним'
  })
  @Prop({ default: true })
  isActive: boolean;
}

export const StatusSchema = SchemaFactory.createForClass(Status); 