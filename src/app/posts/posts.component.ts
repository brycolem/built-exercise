import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostsService } from './posts.service';
import { Post } from './post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  postForm!: FormGroup;
  posts!: Post[];

  constructor(private modalService: NgbModal, private service: PostsService, private fb: FormBuilder) { }

  ngOnInit() {
    this.service.getPostList().subscribe(result => this.posts = result.response);
  }

  newOrEditPost(_modal: any, post: any = {}) {
    if (post.id == null) {
      console.log("new post");
      this._initalizePost();
    } else {
      this._initalizePost(post);
    }
    const modalRef = this.modalService.open(_modal, { centered: true });
  }

  deletePost(id: string) {
    this.service.deletePost(id).subscribe(done => {
      this.service.getPostList().subscribe(result => this.posts = result.response);
      console.log(done);
    }
    );
  }

  onSubmit(_modal: any) {
    let id = this.postForm?.value?.id;
    if (id) {
      this.service.updatePost(id, this.postForm.value as Post).subscribe(data => {
        this.service.getPostList().subscribe(result => this.posts = result.response);
        console.log(data);
        _modal?.close();
      });
    }
    else {
      const now = new Date();
      const timestamp = now.toLocaleString('en-US', { timeZoneName: 'short' });
      this.postForm?.get('timestamp')?.setValue(timestamp);
      console.log(new Date(), this.postForm.value);
      this.service.createPost(this.postForm.value).subscribe(done => {
        _modal?.close();
        this.service.getPostList().subscribe(result => this.posts = result.response);
        console.log(done);
      });
    }
  }

  private _initalizePost(post: any = undefined) {
    this.postForm = this.fb.group({
      title: [''],
      text: [''],
      timestamp: ['']
    });
    if (post?.id != null) {
      for (let key in post) {
        this.postForm.addControl(key, new FormControl([post[key]]));
        this.postForm?.get(key)?.setValue(post[key]);
      };
    }
  }
}
