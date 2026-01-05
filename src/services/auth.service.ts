import api, { getErrorMessage, tokenManager } from '@/lib/api';
import { AUTH_ROUTES } from '@/config/api.routes';
import {
  LoginDTO,
  LoginResponse,
  CurrentUserResponse,
  LogoutResponse,
  User,
  UserRole,
} from '@/types/auth.types';

class AuthService {
  /**
   * Login user with email and password
   * Only PLATFORM_ADMIN users are allowed to access this dashboard
   */
  async login(credentials: LoginDTO): Promise<{ user: User; success: boolean; message: string }> {
    try {
      const response = await api.post<LoginResponse>(AUTH_ROUTES.LOGIN, credentials);
      const { user, tokens } = response.data.data;

      // Store tokens in localStorage
      tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);

      // Check if user is a PLATFORM_ADMIN
      if (user.role !== UserRole.PLATFORM_ADMIN) {
        // Immediately logout if not a platform admin
        await this.logout();
        return {
          user: user,
          success: false,
          message: 'Access denied. Only platform administrators can access this dashboard.',
        };
      }

      return {
        user,
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      // Only call logout API if we have a token
      if (tokenManager.hasTokens()) {
        await api.post<LogoutResponse>(AUTH_ROUTES.LOGOUT);
      }
    } catch (error) {
      // Even if logout fails on server, we should clear local state
      console.error('Logout error:', getErrorMessage(error));
    } finally {
      // Always clear tokens from localStorage
      tokenManager.clearTokens();
    }
  }

  /**
   * Get current authenticated user
   * Returns null if not authenticated or not a PLATFORM_ADMIN
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Check if we have tokens before making the request
      if (!tokenManager.hasTokens()) {
        return null;
      }

      const response = await api.get<CurrentUserResponse>(AUTH_ROUTES.ME);
      const user = response.data.data;

      // Only allow PLATFORM_ADMIN users
      if (user.role !== UserRole.PLATFORM_ADMIN) {
        await this.logout();
        return null;
      }

      return user;
    } catch (error) {
      // User is not authenticated - clear any stale tokens
      tokenManager.clearTokens();
      return null;
    }
  }

  /**
   * Refresh access token
   * This is typically handled automatically by the axios interceptor
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await api.post(AUTH_ROUTES.REFRESH_TOKEN, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
      
      tokenManager.setTokens(accessToken, newRefreshToken);
      return true;
    } catch (error) {
      tokenManager.clearTokens();
      return false;
    }
  }

  /**
   * Check if user is authenticated
   * First checks for tokens, then verifies with server
   */
  async isAuthenticated(): Promise<boolean> {
    if (!tokenManager.hasTokens()) {
      return false;
    }
    const user = await this.getCurrentUser();
    return user !== null && user.role === UserRole.PLATFORM_ADMIN;
  }

  /**
   * Check if tokens exist (synchronous check)
   * Use this for initial UI state before async verification
   */
  hasStoredTokens(): boolean {
    return tokenManager.hasTokens();
  }
}

// Export singleton instance
export const authService = new AuthService();

export default authService;