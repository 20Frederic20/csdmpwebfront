import { User, CreateUserRequest, UpdateUserRequest, ListUsersResponse, ListUsersQueryParams } from "../types/user.types";
import { FetchService } from "@/features/core/services/fetch.service";

export class UserService {
  private static readonly ENDPOINT = 'users';

  static async getUsers(params?: ListUsersQueryParams): Promise<ListUsersResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.roles && params.roles.length > 0) queryParams.append('roles', params.roles.join(','));
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const endpoint = `${this.ENDPOINT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return FetchService.get<ListUsersResponse>(endpoint, 'Users');
  }

  static async getUserById(id: string): Promise<User> {
    return FetchService.get<User>(`${this.ENDPOINT}/${id}`, 'User');
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    return FetchService.post<User>(this.ENDPOINT, userData, 'User');
  }

  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    return FetchService.put<User>(`${this.ENDPOINT}/${id}`, userData, 'User');
  }

  static async deleteUser(id: string): Promise<void> {
    return FetchService.delete<void>(`${this.ENDPOINT}/${id}`, 'User');
  }

  static async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    return this.updateUser(id, { is_active: isActive });
  }
}
