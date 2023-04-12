import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NotFoundComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          url: {
            subscribe: (fn: (value: any) => void) => fn([{ path: 'dog' }])
          }
        }
      }]
    })
      .compileComponents();
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 404 error message', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.querySelector('h1').textContent).toContain('404');
    expect(element.querySelector('p').textContent).toContain('Page Not Found');
  });
});
