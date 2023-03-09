import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private baseUrl = 'http://localhost:4200/posts/bcoleman';

  constructor(private http: HttpClient) { }

  getPostList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createPost(data: Post): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  updatePost(id: string, data: Partial<any>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getPostById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
