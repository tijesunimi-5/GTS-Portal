export interface User {
  id: number;
  name: string;
  department: string;
  uniqueID: string
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}
