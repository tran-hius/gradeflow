import apiClient from "@/lib/axios";

export type User = {
  user_id: number;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
};

export type UserCreate = {
  name: string;
  email: string;
  role?: "student" | "teacher" | "admin";
};

export type UserUpdate = {
  name?: string;
  email?: string;
  role?: "student" | "teacher" | "admin";
};

export const userService = {
  async getAll(skip = 0, limit = 10): Promise<User[]> {
    try {
      const { data } = await apiClient.get("/users", {
        params: { skip, limit },
      });
      return data;
    } catch (error) {
      console.warn('[userService.getAll] Unable to connect to backend. Returning empty list.');
      return [];
    }
  },

  async getById(userId: number): Promise<User> {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
  },

  async create(userData: UserCreate): Promise<User> {
    const { data } = await apiClient.post("/users", userData);
    return data;
  },

  async update(userId: number, userData: UserUpdate): Promise<User> {
    const { data } = await apiClient.patch(`/users/${userId}`, userData);
    return data;
  },

  async delete(userId: number): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  },
};
