import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { UserProfile } from '../../graphql';
import { CurrentUser } from '../decorators/user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

@Resolver('profile')
export class ProfileResolver {
  @Query()
  @UseGuards(GqlAuthGuard)
  async profile(@CurrentUser() currentUser): Promise<UserProfile> {
    return {
      id: currentUser.sub,
      ...currentUser,
    };
  }
}
