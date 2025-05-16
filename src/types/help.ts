export interface HelpRequestEntity {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdDate: string;
  status: string;
}

export interface Comment {
  id: number;
  content: string;
  createdDate: string;
  author: string;
} 