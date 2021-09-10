import {genSalt, hash, compare} from 'bcryptjs';
import {inject} from '@loopback/core';
import {PasswordHasherBindings} from '../keys';

export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {

  constructor(
    @inject(PasswordHasherBindings.ROUNDS)
    private readonly rounds: number,
  ) {}

  public hashPassword = async(password: string): Promise<string> => {

    const salt = await genSalt(this.rounds);
    return hash(password, salt);

  };

  public comparePassword = async(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> => {

    const passwordIsMatched = await compare(providedPass, storedPass);
    return passwordIsMatched;

  };

}
