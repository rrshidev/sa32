import apiClient from '../api/apiClient';

export interface UpdateProfileData {
  email?: string;
  phone?: string;
  telegramId?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const profileService = {
  async updateProfile(data: UpdateProfileData) {
    const response = await apiClient.patch('/user', data);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/user/profile');
    return response.data;
  }
};
