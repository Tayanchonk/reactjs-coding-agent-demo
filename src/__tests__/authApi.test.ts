import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthApiService } from '../services/authApi';

describe('AuthApiService', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  describe('validateCredentials', () => {
    it('should return success for valid credentials', async () => {
      const credentials = { username: 'admin', password: 'p@ssw0rd' };
      
      const responsePromise = AuthApiService.validateCredentials(credentials);
      vi.advanceTimersByTime(800);
      const response = await responsePromise;

      expect(response.data).toBe(true);
      expect(response.message).toBe('Credentials valid. Please enter verification code.');
      expect(response.error).toBeUndefined();
    });

    it('should return error for invalid credentials', async () => {
      const credentials = { username: 'wrong', password: 'wrong' };
      
      const responsePromise = AuthApiService.validateCredentials(credentials);
      vi.advanceTimersByTime(800);
      const response = await responsePromise;

      expect(response.data).toBe(false);
      expect(response.error).toBe('Invalid username or password. Please try again.');
      expect(response.message).toBeUndefined();
    });
  });

  describe('verifyTwoFactor', () => {
    it('should return user for valid verification code', async () => {
      const verification = { code: '864120' };
      
      const responsePromise = AuthApiService.verifyTwoFactor(verification);
      vi.advanceTimersByTime(600);
      const response = await responsePromise;

      expect(response.data).toEqual({
        id: '1',
        username: 'admin',
      });
      expect(response.message).toBe('Login successful! Welcome back.');
      expect(response.error).toBeUndefined();
    });

    it('should return error for invalid verification code', async () => {
      const verification = { code: '123456' };
      
      const responsePromise = AuthApiService.verifyTwoFactor(verification);
      vi.advanceTimersByTime(600);
      const response = await responsePromise;

      expect(response.data).toBe(null);
      expect(response.error).toBe('Invalid verification code. Please try again.');
      expect(response.message).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should return success when logging out', async () => {
      const responsePromise = AuthApiService.logout();
      vi.advanceTimersByTime(300);
      const response = await responsePromise;

      expect(response.data).toBe(true);
      expect(response.message).toBe('Logged out successfully.');
      expect(response.error).toBeUndefined();
    });
  });
});