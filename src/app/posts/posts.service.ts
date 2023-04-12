import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private baseUrl = '/api/v1/article';
  private posts: Post[] = [];
  private postsSubject: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>(this.posts);

  constructor(private http: HttpClient) { }

  getPostList(): Observable<Post[]> {
    this.http.get<Post[]>(`${this.baseUrl}`).subscribe(result => {
      this.posts = result;
      this.postsSubject.next(this.posts);
    });
    return this.postsSubject;
  }

  createPost(data: Post): Observable<boolean> {
    return this.http.post<Post>(`${this.baseUrl}`, data).pipe(
      tap((newPost: Post) => {
        this.posts.push(newPost);
        this.postsSubject.next(this.posts);
      }),
      map(() => true),
      catchError(error => {
        console.error('Error creating post:', error);
        return of(false);
      })
    );
  }

  updatePost(id: string, data: Partial<Post>): Observable<boolean> {
    return this.http.put<Post>(`${this.baseUrl}/${id}`, data).pipe(
      tap((updatedPost: Post) => {
        const index = this.posts.findIndex((post: Post) => post.id === id);
        if (index !== -1) {
          this.posts[index] = updatedPost;
          this.postsSubject.next(this.posts);
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Error updating post:', error);
        return of(false);
      })
    );
  }

  deletePost(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const index = this.posts.findIndex((post: Post) => post.id === id);
        if (index !== -1) {
          this.posts.splice(index, 1);
          this.postsSubject.next(this.posts);
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Error deleting post:', error);
        return of(false);
      })
    );
  }

  getPostById(id: string): Observable<Post> {
    const localPost = this.posts.find((post: Post) => post.id === id);

    if (localPost) {
      return of(localPost);
    } else {
      return this.http.get<Post>(`${this.baseUrl}/${id}`).pipe(
        tap((fetchedPost: Post) => {
          this.posts.push(fetchedPost);
          this.postsSubject.next(this.posts);
        })
      );
    }
  }
}
