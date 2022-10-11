import {injectable, BindingScope, inject} from '@loopback/core';
import { BindingKeys } from '../binding.keys';
import { PasswordHasher } from './hash-password.service';
import { signAsync, verifyAsync } from './jwt.service';

import {createCanvas} from 'canvas';
import { SignupLog } from '../models/signup-log.model';
import { SignupLogRepository } from '../repositories/signup-log.repository';
import { repository } from '@loopback/repository';
import sgMail from '@sendgrid/mail';
import { SignupInitiateResponse } from '../controllers/specs/common-specs';

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
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

  initiateSignup = async(signupLog:Omit<SignupLog, 'id'>): Promise<SignupInitiateResponse> => {

    const {email} = signupLog;
    const token = await signAsync({
      email
    }, this.jwtSecret, {
      expiresIn: 86400,
    });
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_MAIL ?? '',
      subject: '5By1 - Please verify your email address',
      text: '5By1 - Please verify your email address',
      html: `Thanks for choosing 5By1.<br/>
      <a href="${process.env.VERIFY_EMAIL_URL}/${token}">Click here to verify your eamil address</a>`,
    };
    await sgMail.send(msg);
    return {status: 'success',
      message: `We have send a verification email to ${email}. Please check your inobx.`};

  }

  validateSignup = async(token: string): Promise<{email: string}> => {

    const tokData = await verifyAsync(token, this.jwtSecret);
    const {email} = tokData as {email: string};
    return {
      email
    };

  }

}
