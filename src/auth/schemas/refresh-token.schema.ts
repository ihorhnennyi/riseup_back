import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true, unique: true, trim: true })
  token: string;

  @Prop({ required: true, trim: true })
  userId: string;

  @Prop({ required: true, default: () => Date.now(), expires: '30d' })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.pre('findOneAndDelete', function (next) {
  console.log(`📌 Видаляється прострочений токен: ${this.get('token')}`);
  next();
});
