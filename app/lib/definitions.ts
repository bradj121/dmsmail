// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: number;
  name: string;
  email: string;
  hashed_password: string;
  policies: number[];  // This is a list of policy ids attached to this user
};

export type Policy = {
  id: number;
  sender: number;
  recipients: string;
  subject: string;
  body: string;
  expiration_date: string
  attachments: File[];
  status: 'active' | 'inactive'
}
