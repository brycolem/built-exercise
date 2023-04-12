import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display correct text in left footer section', () => {
    const leftSection = fixture.nativeElement.querySelector('.col-md-6.text-center.text-md-start');
    expect(leftSection.textContent).toContain('Copyright');
  });

  it('should display correct text in right footer section', () => {
    const rightSection = fixture.nativeElement.querySelector('.col-md-6.text-center.text-md-end');
    expect(rightSection.textContent).toContain('Made by Bryan Patrick Coleman');
  });
});
