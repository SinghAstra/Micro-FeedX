export interface User {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  isAuthor: boolean;
}
