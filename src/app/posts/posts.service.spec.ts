import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { Post } from './post';
import { of } from 'rxjs';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PostsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get post list', fakeAsync(() => {
    const mockPosts: Post[] = [
      { id: '1', title: 'Post 1', text: 'Content 1', timestamp: Date.now().toString() },
      { id: '2', title: 'Post 2', text: 'Content 2', timestamp: Date.now().toString() },
    ];

    let result: Post[] | undefined;

    service.getPostList().subscribe((posts) => {
      result = posts;
    });

    const req = httpMock.expectOne('/api/v1/article');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);

    tick(); // simulates the passage of time until all pending asynchronous activities finish

    expect(result?.length).toEqual(2);
  }));


  it('should create a post', () => {
    const newPost: Post = { id: '3', title: 'Post 3', text: 'Content 3', timestamp: Date.now().toString() };

    service.createPost(newPost).subscribe((success) => {
      expect(success).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/v1/article');
    expect(req.request.method).toBe('POST');
    req.flush(newPost);
  });

  it('should handle error when creating a post', () => {
    const newPost: Post = { id: '3', title: 'Post 3', text: 'Content 3', timestamp: Date.now().toString() };
    const errorMessage = 'Error creating post';

    service.createPost(newPost).subscribe((success) => {
      expect(success).toBeFalsy();
    });

    const req = httpMock.expectOne('/api/v1/article');
    expect(req.request.method).toBe('POST');
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });

  it('should update a post', () => {
    const updatedPost: Post = { id: '1', title: 'Updated Post 1', text: 'Updated Content 1', timestamp: Date.now().toString() };

    service.updatePost('1', updatedPost).subscribe((success) => {
      expect(success).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/v1/article/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPost);
  });

  it('should update the correct internal record after getAll', fakeAsync(() => {
    const mockPosts: Post[] = [
      { id: '1', title: 'Post 1', text: 'Content 1', timestamp: Date.now().toString() },
      { id: '2', title: 'Post 2', text: 'Content 2', timestamp: Date.now().toString() },
    ];
    service.getPostList().subscribe();

    const getAllReq = httpMock.expectOne('/api/v1/article');
    getAllReq.flush(mockPosts);
    tick();
    const updatedPost: Post = { id: '1', title: 'Updated Post 1', text: 'Updated Content 1', timestamp: Date.now().toString() };

    service.updatePost('1', updatedPost).subscribe((success) => {
      expect(success).toBeTruthy();
    });
    const req = httpMock.expectOne('/api/v1/article/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPost);
    expect(service['posts']).toContain(updatedPost);
  }));


  it('should handle error when updating a non-existent record', () => {
    const updatedPost: Post = { id: '999', title: 'Updated Post 999', text: 'Updated Content 999', timestamp: Date.now().toString() };
    const errorMessage = 'Error updating post';

    service.updatePost('999', updatedPost).subscribe((success) => {
      expect(success).toBeFalsy();
    });

    const req = httpMock.expectOne('/api/v1/article/999');
    expect(req.request.method).toBe('PUT');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should delete a post', () => {
    service.deletePost('1').subscribe((success) => {
      expect(success).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/v1/article/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should delete the correct internal record after getAll', fakeAsync(() => {
    const mockPosts: Post[] = [
      { id: '1', title: 'Post 1', text: 'Content 1', timestamp: Date.now().toString() },
      { id: '2', title: 'Post 2', text: 'Content 2', timestamp: Date.now().toString() },
    ];
    const deletedPost: Post = mockPosts[0];
    service.getPostList().subscribe();

    const getAllReq = httpMock.expectOne('/api/v1/article');
    getAllReq.flush(mockPosts);
    tick();

    service.deletePost('1').subscribe((success) => {
      expect(success).toBeTruthy();
    });
    const req = httpMock.expectOne('/api/v1/article/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(service['posts']).not.toContain(deletedPost);
  }));

  it('should handle permission denied error when deleting a post', () => {
    const postId = '1';
    const errorMessage = 'Permission denied';

    service.deletePost(postId).subscribe((success) => {
      expect(success).toBeFalsy();
    });

    const req = httpMock.expectOne(`/api/v1/article/${postId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(errorMessage, { status: 403, statusText: 'Forbidden' });
  });

  it('should get a post by id', () => {
    const post: Post = { id: '1', title: 'Post 1', text: 'Content 1', timestamp: Date.now().toString() };

    service.getPostById('1').subscribe((fetchedPost) => {
      expect(fetchedPost).toEqual(post);
    });

    const req = httpMock.expectOne('/api/v1/article/1');
    expect(req.request.method).toBe('GET');
    req.flush(post);
  });

  it('should get a post by id from cache', fakeAsync(() => {
    const mockPosts: Post[] = [
      { id: '1', title: 'Post 1', text: 'Content 1', timestamp: Date.now().toString() },
      { id: '2', title: 'Post 2', text: 'Content 2', timestamp: Date.now().toString() },
    ];

    service.getPostList().subscribe();
    const req = httpMock.expectOne('/api/v1/article');
    req.flush(mockPosts);
    tick();

    let result: Post | undefined;
    service.getPostById('1').subscribe((post) => {
      result = post;
    });
    httpMock.expectNone('/api/v1/article/1');
    tick();

    expect(result).toEqual(mockPosts[0]);
  }));

});
