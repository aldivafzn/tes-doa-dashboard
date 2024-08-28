import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service'; // Assuming you have Prisma set up
import {
  AddAccountDto,
  LoginDto,
  UpdatePasswordDto,
  ShowAccountDto,
  DeleteAccountDto,
} from 'src/dtos/account.dto';
import { HelperService } from 'src/utils/hash.util';
import { AuthService } from '../auth/auth.service'; // Import AuthService

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private helperService: HelperService,
    private authService: AuthService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.account.findUnique({ where: { email } });

    if (
      user &&
      (await this.helperService.comparePassword(password, user.password))
    ) {
      const token = await this.authService.generateJwtToken(
        email,
        user.accountid.toString(),
        user.role,
      );

      return {
        status: 200,
        message: 'Login successful',
        token,
      };
    } else {
      return { status: 401, message: 'Email/Password is not correct' };
    }
  }

  async addAccount(addAccountDto: AddAccountDto) {
    const { name, unit, password, role, email } = addAccountDto;
    const hashedPassword = await this.helperService.hashPassword(password);

    try {
      const existingUser = await this.prisma.account.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          status: 400,
          message: 'Email already exists',
        };
      }

      // Create new account
      const newUser = await this.prisma.account.create({
        data: {
          name,
          unit,
          password: hashedPassword,
          role,
          email,
        },
      });

      const userWithStringId = {
        ...newUser,
        accountid: newUser.accountid.toString(), // Convert BigInt to String
      };

      return {
        status: 200,
        message: 'Account created successfully',
        user: userWithStringId,
      };
    } catch (error) {
      console.error('Error creating account:', error);
      throw new Error('Error creating account');
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { email, currentPass, newPass } = updatePasswordDto;
    const user = await this.prisma.account.findUnique({ where: { email } });
    if (
      user &&
      (await this.helperService.comparePassword(currentPass, user.password))
    ) {
      const hashedNewPass = await this.helperService.hashPassword(newPass);
      await this.prisma.account.update({
        where: { email },
        data: { password: hashedNewPass },
      });
      return { status: 200, message: 'Password updated successfully' };
    } else {
      return { status: 401, message: 'Current password is incorrect' };
    }
  }

  async showAccount(showAccountDto: ShowAccountDto) {
    const { accountid } = showAccountDto;

    if (!accountid) {
      return { status: 400, message: 'Account ID is required' };
    }

    try {
      const account = await this.prisma.account.findUnique({
        where: { accountid: accountid },
      });

      if (account) {
        return {
          status: 200,
          message: 'Account found',
          account: {
            ...account,
            accountid: account.accountid.toString(), // Convert BigInt to string for response
          },
        };
      } else {
        return { status: 404, message: 'Account not found' };
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }

  async showAllAccounts() {
    const accounts = await this.prisma.account.findMany();

    const serializedAccounts = accounts.map((account) => ({
      ...account,
      accountid: account.accountid.toString(), // Convert BigInt to string
    }));

    return {
      status: 200,
      message: 'Accounts retrieved successfully',
      accounts: serializedAccounts,
    };
  }

  async deleteAccount(deleteAccountDto: DeleteAccountDto) {
    const { email, password } = deleteAccountDto;
    const user = await this.prisma.account.findUnique({ where: { email } });
    if (
      user &&
      (await this.helperService.comparePassword(password, user.password))
    ) {
      await this.prisma.account.delete({ where: { email } });
      return { status: 200, message: 'Account deleted successfully' };
    } else {
      return { status: 401, message: 'Invalid email or password' };
    }
  }

  async logout(): Promise<{ status: number; message: string }> {
    console.log('User logged out');

    return { status: 200, message: 'Logout successful' };
  }
}
