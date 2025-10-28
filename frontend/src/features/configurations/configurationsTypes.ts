export interface IConfiguration {
  _id: string;
  key: string;
  data: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}
