/**
 * Enum to indicate the type of available avialable auth providers
 */
enum AUTH_PROVIDERS {
  /**
   * The standard email and password provider
   */
  EMAIL = 'emailAndPassword',
  /**
   * Facebook social media login
   */
  FACEBOOK = 'facebook',
  /**
   * Google
   */
  GOOGLE = 'google',
  /**
   * Twitter
   */
  TWITTER = 'twitter',
}

export { AUTH_PROVIDERS };
