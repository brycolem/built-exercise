import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the Vaco BUILT logo', () => {
    const logo = fixture.nativeElement.querySelector('.navbar-brand .font-bold');
    expect(logo.textContent).toContain('Vaco BUILT');
  });

  it('should have a login button', () => {
    const compiled = fixture.nativeElement;
    const loginButton = compiled.querySelector('#login');
    expect(loginButton).toBeTruthy();
    expect(loginButton.textContent).toContain('Login');
  });

  it('should have a signup button', () => {
    const compiled = fixture.nativeElement;
    const signupButton = compiled.querySelector('#signup');
    expect(signupButton).toBeTruthy();
    expect(signupButton.textContent).toContain('Signup');
  });
});
