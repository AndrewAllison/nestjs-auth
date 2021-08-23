import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UserService } from './user.service';

@Module({
  imports: [CoreModule],
  providers: [UserService],
})
export class UserModule {}
