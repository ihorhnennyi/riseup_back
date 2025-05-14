import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(message = 'Користувача не знайдено') {
    super(message);
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor(message = 'Невірний email або пароль') {
    super(message);
  }
}

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor(message = 'Недійсний refresh token') {
    super(message);
  }
}

export class EmailAlreadyExistsException extends BadRequestException {
  constructor(message = 'Користувач з таким email вже існує') {
    super(message);
  }
}
