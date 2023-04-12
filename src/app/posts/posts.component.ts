import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostsService } from './posts.service';
import { Post } from './post';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  public readonly Editor: any = ClassicEditor;
  postForm!: FormGroup;
  posts$!: Observable<Post[]>;

  constructor(private modalService: NgbModal, private service: PostsService, private fb: FormBuilder) { }

  ngOnInit() {
    this.posts$ = this.service.getPostList();
  }

  newOrEditPost(_modal: any, post: Post | undefined = undefined) {
    this._initializePost(post);
    this.modalService.open(_modal, { centered: true, size: 'xl' });
  }

  deletePost(id: string) {
    this.service.deletePost(id).subscribe();
  }


  onSubmit(_modal: any) {
    let id = this.postForm?.value?.id;
    if (id) {
      this.service.updatePost(id, this.postForm.value as Post).subscribe(() => {
        _modal?.close();
      });
    } else {
      const now = new Date();
      const timestamp = now.toLocaleString('en-US', { timeZoneName: 'short' });
      this.postForm?.get('timestamp')?.setValue(timestamp);
      console.log(new Date(), this.postForm.value);
      this.service.createPost(this.postForm.value).subscribe(() => {
        _modal?.close();
      });
    }
  }

  private _initializePost(post: Post | undefined = undefined) {
    this.postForm = this.fb.group({
      id: [post?.id || null],
      title: [post?.title || ''],
      text: [post?.text || ''],
      timestamp: [post?.timestamp || '']
    });
  }

}
