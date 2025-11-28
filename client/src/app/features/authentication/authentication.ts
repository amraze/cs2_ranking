import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedImports } from '../../shared/shared-imports';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.html',
  styleUrls: ['./authentication.scss'],
  imports: [SharedImports, ReactiveFormsModule],
})
export class Authentication implements OnInit {
  authForm!: FormGroup;
  isLogin: boolean = true;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    if (this.isLogin) {
      this.authForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else {
      this.authForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      }, {
        validators: this.passwordMatchValidator
      });
    }
    this.submitted = false;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.initForm();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.authForm.invalid) {
      return;
    }

    if (this.isLogin) {
      this.login();
    } else {
      this.signup();
    }
  }

  login(): void {
    const { email, password } = this.authForm.value;
    console.log('Login:', { email, password });
    // Implement your login logic here
    // this.authService.login(email, password).subscribe(...)
  }

  signup(): void {
    const { username, email, password } = this.authForm.value;
    console.log('Signup:', { username, email, password });
    // Implement your signup logic here
    // this.authService.signup(username, email, password).subscribe(...)
  }

  socialLogin(platform: string): void {
    console.log(`${platform} login`);
    // Implement social login logic
    // this.authService.socialLogin(platform).subscribe(...)
  }

  forgotPassword(): void {
    console.log('Forgot password');
    // Implement forgot password logic
    // Navigate to forgot password page or show modal
  }

  get f() {
    return this.authForm.controls;
  }
}
