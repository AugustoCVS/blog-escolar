import { IUserResponse } from "./user";

export interface metadata {
  total: number;
  page: number;
  limit: number;
}

export interface ICreatePost {
  title: string;
  content: string;
  authorId: string;
}

export interface IPosts {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: IUserResponse;
}

export interface IPostResponse {
  transactions: IPosts[];
  metadata: metadata;
}

export interface IUpdatePost {
  title?: string;
  content?: string;
  authorId?: string;
}

export interface IPostsSearchParams {
  title?: string;
  content?: string;
}

export interface IGetPostsInput {
  postsId?: string;
  page?: number;
  limit?: number;
}