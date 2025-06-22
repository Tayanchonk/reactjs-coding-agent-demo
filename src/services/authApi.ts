import type { LoginCredentials, TwoFactorVerification, User, ApiResponse } from '../types';

// Mock authentication service
export class AuthApiService {
  private static readonly VALID_CREDENTIALS = {
    username: 'admin',
    password: 'p@ssw0rd',
  };

  private static readonly VALID_2FA_CODE = '864120';

  // Simulate API delay
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async validateCredentials(credentials: LoginCredentials): Promise<ApiResponse<boolean>> {
    await this.delay(800); // Simulate network delay

    const { username, password } = credentials;
    
    if (username === this.VALID_CREDENTIALS.username && password === this.VALID_CREDENTIALS.password) {
      return {
        data: true,
        message: 'Credentials valid. Please enter verification code.',
      };
    }

    return {
      data: false,
      error: 'Invalid username or password. Please try again.',
    };
  }

  static async verifyTwoFactor(verification: TwoFactorVerification): Promise<ApiResponse<User>> {
    await this.delay(600); // Simulate network delay

    const { code } = verification;

    if (code === this.VALID_2FA_CODE) {
      const user: User = {
        id: '1',
        username: this.VALID_CREDENTIALS.username,
      };

      return {
        data: user,
        message: 'Login successful! Welcome back.',
      };
    }

    return {
      data: null as unknown as User,
      error: 'Invalid verification code. Please try again.',
    };
  }

  static async logout(): Promise<ApiResponse<boolean>> {
    await this.delay(300);
    
    return {
      data: true,
      message: 'Logged out successfully.',
    };
  }
}