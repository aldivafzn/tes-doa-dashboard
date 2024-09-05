import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';
import { AuthService } from '../auth.service';
import axios from 'axios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private toastService: ToastService, private authService: AuthService) { }

  async login() {
    const loggingInToastElement = this.toastService.generatingToast('Logging In');
    try {
      const response = await axios.post<{ status: number, message: string, token: string }>('http://localhost:4040/account/login', {
        email: this.email,
        password: this.password
      });

      if (response.data.status === 200) {
        this.authService.setToken(response.data.token);
        this.toastService.successToast('Login successful');
        console.log('Login successful');
        this.router.navigate(['/home']);
      } else {
        this.toastService.failedToast('Email or password is incorrect');
        console.log('Error:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
    document.body.removeChild(loggingInToastElement);
  }
}