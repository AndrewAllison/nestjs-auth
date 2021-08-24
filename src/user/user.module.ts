import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UserService } from './user.service';
import { PasswordService } from './password.service';

@Module({
  imports: [CoreModule],
  providers: [UserService, PasswordService],
})
export class UserModule {}
