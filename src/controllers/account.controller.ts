import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AccountService } from 'src/services/account.service';
import {
  AddAccountDto,
  LoginDto,
  UpdatePasswordDto,
  ShowAccountDto,
  DeleteAccountDto,
} from 'src/dtos/account.dto';

import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.accountService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addAccount(@Body() addAccountDto: AddAccountDto) {
    return this.accountService.addAccount(addAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('show')
  async showAccount(@Body() showAccountDto: ShowAccountDto) {
    return this.accountService.showAccount(showAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('show-all')
  async showAllAccounts() {
    return this.accountService.showAllAccounts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.accountService.updatePassword(updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteAccount(@Body() deleteAccountDto: DeleteAccountDto) {
    return this.accountService.deleteAccount(deleteAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return this.accountService.logout();
  }
}
