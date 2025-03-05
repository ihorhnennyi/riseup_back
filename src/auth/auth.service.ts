import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(
    username: string,
    password: string,
    role?: UserRole,
  ): Promise<User> {
    const isFirstUser = (await this.userModel.countDocuments()) === 0;
    const roleToAssign = isFirstUser ? UserRole.ADMIN : (role ?? UserRole.USER);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      role: roleToAssign,
    });

    return newUser.save();
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { message: 'Invalid credentials' };
    }

    const payload = { username: user.username, sub: user._id, role: user.role };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
