import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { City } from '../../cities/schemas/city.schema'

export type BranchDocument = Branch & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Branch {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'Унікальний ідентифікатор філії'
  })
  id: string;

  @ApiProperty({ 
    example: 'Філія Київ-Центр',
    description: 'Назва філії'
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ 
    example: 'Центральний офіс у Києві',
    description: 'Опис філії'
  })
  @Prop()
  description?: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'ID міста, де знаходиться філія'
  })
  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: City.name,
    required: true 
  })
  city: MongooseSchema.Types.ObjectId;

  @ApiProperty({ 
    example: true,
    description: 'Чи активна філія'
  })
  @Prop({ default: true })
  isActive: boolean;
}

export const BranchSchema = SchemaFactory.createForClass(Branch); 