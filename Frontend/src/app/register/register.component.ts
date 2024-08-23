import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ToastService } from '../toast.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios, { AxiosError } from 'axios';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  accountid: string | null = null;
  role: string | null = null;
  registerData = { name: '', unit: '', role: '', email: '', password: '' };
  registerMessage = '';
  email: string | null = null;
  showEmailDisplay = false;

  constructor(private router: Router, private toastService: ToastService) { }

  ngOnInit() {
    this.accountid = sessionStorage.getItem('accountid');
    this.role = sessionStorage.getItem('role');
    console.log('Retrieved accountid:', this.accountid);
    console.log('Retrieved role:', this.role);
    if (this.accountid === null){
      console.log('Redirecting to login page');
      this.router.navigate(['/login']);
    }
    this.showEmailDisplay = false;
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  notAdmin(): boolean {
    return this.role !== 'Admin';
  }

  async registerAccount() {
    console.log("Sending data:", this.registerData);
    try {
      const response = await axios.post("http://localhost:3000/addAccount", this.registerData);
      console.log("Server response:", response.data);
      if (response.data.status === 200) {
        this.registerMessage = response.data.message;
        this.toastService.successToast('Registration successful');
      } else {
        this.registerMessage = response.data.message;
        this.toastService.failedToast('Email/password not valid, please use company domain and strong password');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        this.toastService.failedToast('An error occurred during registration');
        console.error("Error during registration:", axiosError);
        this.registerMessage = axiosError.response?.data?.message || "An error occurred during registration";
      } else {
        this.toastService.failedToast('An error occurred during registration');
        console.error("Error during registration:", error);
        this.registerMessage = "An error occurred during registration";
      }
      this.showEmailDisplay = true;
    }
  }
}
