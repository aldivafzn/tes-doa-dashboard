import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';
import { user_role, office_code } from '@prisma/client';

/* 
    ACCOUNT DTO 
*/
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// DTO for adding an account
export class AddAccountDto {
  @IsNumber()
  accountid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(office_code)
  @IsNotEmpty()
  unit: office_code;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include a combination of uppercase letters, lowercase letters, numbers, and symbols.',
    },
  )
  password: string;

  @IsEnum(user_role)
  @IsNotEmpty()
  role: user_role;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid GMF AeroAsia email address' })
  @Matches(/^[a-zA-Z0-9._%+-]+@gmf-aeroasia\.co\.id$/, {
    message: 'Email must be a valid GMF AeroAsia email address',
  })
  email: string;
}

// DTO for updating a password
export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  currentPass: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include a combination of uppercase letters, lowercase letters, numbers, and symbols.',
    },
  )
  newPass: string;
}

// DTO for showing an account
export class ShowAccountDto {
  @IsNumber()
  accountid: string;
}

// DTO for deleting an account
export class DeleteAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
