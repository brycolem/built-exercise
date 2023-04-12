import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { PostsComponent } from './posts.component';
import { PostsService } from './posts.service';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postsService: PostsService;
  let ngbModal: NgbModal;

  const mockPosts = [
    { id: '1', title: 'Post 1', text: 'Content 1', timestamp: Date.now().toString() },
    { id: '2', title: 'Post 2', text: 'Content 2', timestamp: Date.now().toString() },
  ];

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', ['getPostList', 'deletePost', 'updatePost', 'createPost']);
    postsServiceSpy.getPostList.and.returnValue(of(mockPosts));
    postsServiceSpy.createPost.and.returnValue(of(true));
    postsServiceSpy.updatePost.and.returnValue(of(true));
    postsServiceSpy.deletePost.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgbModule,
      ],
      declarations: [PostsComponent],
      providers: [
        FormBuilder,
        { provide: PostsService, useValue: postsServiceSpy },
      ],
    }).compileComponents();

    postsService = TestBed.inject(PostsService);
    ngbModal = TestBed.inject(NgbModal);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call getPostList', () => {
    component.ngOnInit();
    expect(postsService.getPostList).toHaveBeenCalled();
  });

  it('newOrEditPost should call NgbModal.open', () => {
    spyOn(ngbModal, 'open').and.callThrough();
    component.newOrEditPost('fakeModal', undefined);
    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('deletePost should call deletePost from service', () => {
    component.deletePost('1');
    expect(postsService.deletePost).toHaveBeenCalledWith('1');
  });

  it('onSubmit should call updatePost from service when id exists', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.newOrEditPost(null, mockPosts[0]);
    component.onSubmit({ close: () => { } });

    expect(postsService.updatePost).toHaveBeenCalledWith(mockPosts[0].id!, mockPosts[0]);
  });

  it('onSubmit should call createPost from service when id does not exist', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.newOrEditPost(null);
    component.onSubmit({ close: () => { } });

    expect(postsService.createPost).toHaveBeenCalled();
  });
});
