
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class LoginRequest {
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export class RegisterUserInput {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export class TokenRequest {
    code?: Nullable<string>;
    uic?: Nullable<string>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract profile(): Nullable<UserProfile> | Promise<Nullable<UserProfile>>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract authorize(authorizeData?: Nullable<LoginRequest>): Nullable<AuthorizeResponse> | Promise<Nullable<AuthorizeResponse>>;

    abstract register(registrationData?: Nullable<RegisterUserInput>): Nullable<AuthorizeResponse> | Promise<Nullable<AuthorizeResponse>>;

    abstract token(tokenRequest?: Nullable<TokenRequest>): Nullable<TokenResponse> | Promise<Nullable<TokenResponse>>;
}

export class AuthorizeResponse {
    __typename?: 'AuthorizeResponse';
    code?: Nullable<string>;
    uic?: Nullable<string>;
}

export class UserProfile {
    __typename?: 'UserProfile';
    id: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    displayName?: Nullable<string>;
    email?: Nullable<string>;
}

export class TokenResponse {
    __typename?: 'TokenResponse';
    profile?: Nullable<UserProfile>;
    accessToken?: Nullable<string>;
}

type Nullable<T> = T | null;
