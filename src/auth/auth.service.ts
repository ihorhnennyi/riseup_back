import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';
import { User, UserDocument } from './schemas/user.schema';

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

    return this.generateTokens(user);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: UserDocument) {
    const payload = { username: user.username, sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findById(decoded.sub).exec();

      if (!user || !user.refreshToken) {
        throw new Error('User not found or no refreshToken stored');
      }

      const isTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isTokenValid) {
        throw new Error('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (err) {
      console.error('Refresh token error:', err.message);
      throw new Error('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    return { message: 'Logged out successfully' };
  }
}
