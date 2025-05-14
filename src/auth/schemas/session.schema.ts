import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, trim: true })
  userId: string;

  @Prop({ required: true, trim: true })
  ip: string;

  @Prop({ required: true, trim: true })
  userAgent: string;

  @Prop({ required: true, default: true })
  active: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.pre<SessionDocument>('save', function (next) {
  console.log(
    `Оновлення сесії для користувача: ${this.userId}, активна: ${this.active}`,
  );
  next();
});
