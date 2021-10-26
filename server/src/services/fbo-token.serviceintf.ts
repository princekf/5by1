import { ProfileUser } from './user.service';

/**
 * An interface for generating and verifying a token
 */
export interface FBOTokenServiceInft {

    verifyToken(token: string): Promise<ProfileUser>;

    /**
     * Generates a token string based on a user profile
     *
     * @param userProfile A UserProfile for which a token should be generated.
     *
     * @returns a generated token/secret for a given UserProfile.
     */
    generateToken(userProfile: ProfileUser): Promise<string>;

    /**
     * Revokes a given token (if supported by token system)
     *
     * @param token The token/secret which should be revoked/invalidated.
     *
     * @returns true, if the given token was invalidated.
     */
    revokeToken?(token: string): Promise<boolean>;
}
