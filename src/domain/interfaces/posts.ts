import { IUserResponse } from "./user";

export interface ICreatePost {
  title: string;
  content: string;
  authorId: string;
}

export interface IPostResponse {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: IUserResponse;
}

export interface IUpdatePost {
  title?: string;
  content?: string;
  authorId?: string;
}