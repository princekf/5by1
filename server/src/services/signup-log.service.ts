import {injectable, BindingScope, inject} from '@loopback/core';
import { BindingKeys } from '../binding.keys';
import { PasswordHasher } from './hash-password.service';
import { signAsync } from './jwt.service';

import {createCanvas} from 'canvas';
import { SignupLog } from '../models/signup-log.model';
import { SignupLogRepository } from '../repositories/signup-log.repository';
import { repository } from '@loopback/repository';

@injectable({scope: BindingScope.TRANSIENT})
export class SignupLogService {

  constructor(
    @inject(BindingKeys.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(BindingKeys.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(SignupLogRepository)
    public signupLogRepository: SignupLogRepository,) {}

  createCaptcha = async(): Promise<{ question: string, token: string; }> => {

    const HUNDRED = 100;
    const num1 = Math.floor(Math.random() * HUNDRED);
    const num2 = Math.floor(Math.random() * HUNDRED);
    const question = `${num1} + ${num2} = ?`;
    const width = 200;
    const height = 50;
    const yPos = 10;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.font = '30px Impact';
    ctx.fillText(question, 0, height - yPos);
    const answer2 = num1 + num2;
    const answer = await this.passwordHasher.hashPassword(String(answer2));
    const token = await signAsync({
      answer
    }, this.jwtSecret, {
      expiresIn: 180,
    });

    return { question: canvas.toDataURL(),
      token};

  }

  create = async(signupLog:Omit<SignupLog, 'id'>): Promise<SignupLog> => {

    const {name, email} = signupLog;
    const createdAt = new Date();
    const resp = await this.signupLogRepository.create({name,
      email,
      createdAt});
    return resp;

  }

}
