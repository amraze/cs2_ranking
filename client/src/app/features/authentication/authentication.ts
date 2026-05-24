import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedImports } from '../../shared/shared-imports';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';

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
  errorMessage: string = "";
  hasError: boolean = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    if (this.isLogin) {
      this.authForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        scope_gg_session: ['', [Validators.required]]
      });
    } else {
      this.authForm = this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
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
    this.authService.login(this.authForm.value).subscribe(response => {
      if (!response.success) { this.errorMessage = response.message; this.hasError = false; this.hasError = true; }
      else { this.errorMessage = ""; this.router.navigate(['']) }
    });
  }

  signup(): void {
    this.authService.register(this.authForm.value).subscribe(response => {
      if (!response.success) { this.errorMessage = response.message; this.hasError = true; }
      else { this.errorMessage = ""; this.hasError = false; alert("Registered succesfully !") }
    });
  }

  get f() {
    return this.authForm.controls;
  }
}
