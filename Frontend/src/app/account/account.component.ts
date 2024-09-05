import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastService } from '../toast.service';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { throws } from 'assert';

interface JwtPayload {
  email: string,
  userId: string,
  role: string,
  iat: number,
  exp: number
}

interface Account {
  name: string;
  email: string;
  unit: string;
  role: string;
}

enum unit {
  TE = "TE",
  TEC_1 = "TEC-1",
  TEA = "TEA",
  TEA_1 = "TEA-1",
  TEA_2 = "TEA-2",
  TEA_3 = "TEA-3",
  TEA_4 = "TEA-4",
  TED = "TED",
  TED_1 = "TED-1",
  TED_2 = "TED-2",
  TED_3 = "TED-3",
  TED_4 = "TED-4",
  TER = "TER",
  TER_1 = "TER-1",
  TER_2 = "TER-2",
  TER_3 = "TER-3",
  TER_4 = "TER-4",
  TER_5 = "TER-5",
  TEL = "TEL",
  TEL_1 = "TEL-1",
  TEL_2 = "TEL-2",
  TEJ = "TEJ",
  TEJ_1 = "TEJ-1",
  TEJ_2 = "TEJ-2",
  TEJ_3 = "TEJ-3",
  TEM = "TEM",
  TEM_1 = "TEM-1",
  TEM_2 = "TEM-2",
  TEM_3 = "TEM-3"
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent implements OnInit {

  constructor(private toastService: ToastService, private authService: AuthService) { }

  selectedTab: string = 'account-info';
  
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  accountid: string | null = null;
  role: string | null = null;

  account: Account = {
    name: '',
    email: '',
    unit: '',
    role: ''
  };
  allAccounts: any[] = [];
  changePass = {
    email: '',
    currentPass: '',
    newPass: ''
  };
  deleteCont = {
    email: '',
    password: ''
  };
  isInitialized: boolean = false;

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { userId, role } = jwtDecode<JwtPayload>(token);
      this.accountid = userId;
      this.role = role.toString();
      console.log('Retrieved accountid:', this.accountid);
      console.log('Retrieved role:', this.role);
      if (this.accountid) {
        this.getAccountInfo();
        this.fetchAllAccounts();
      }
    }
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:4040/account/show', { accountid: this.accountid });
      if (response.data.status === 200 && response.data.account) {
        this.account = response.data.account;
        this.account.unit = this.convertEnumValue(unit, this.account.unit);
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
    this.isInitialized = true;
  }

  async fetchAllAccounts() {
    try {
        const response = await axios.get('http://localhost:4040/account/show-all');
        console.log("Fetched accounts:", response.data.accounts);
        this.allAccounts = response.data.accounts;
        console.log(this.allAccounts);
    } catch (error) {
        console.error("Error fetching all accounts:", error);
        console.error("Entire error object:", error);
    }
  }

  async changePassword() {
    try {
        const response = await axios.post('http://localhost:4040/account/update-password', {
            email: this.changePass.email,
            currentPass: this.changePass.currentPass,
            newPass: this.changePass.newPass
        });

        if (response.data.status === 200) {
            console.log('Password updated successfully');
            this.toastService.successToast('Password updated successfully');
        } else {
            console.log('Email or password is incorrect');
            this.toastService.failedToast('Email or password is incorrect');
        }

    } catch (error) {
        console.log("Error updating password:", error);
        this.toastService.failedToast('Failed to update password');
    }
  }

  async deleteAccount() {
    try {
        const response = await axios.post('http://localhost:4040/account/delete', {
          email: this.deleteCont.email,
          password: this.deleteCont.password
        });

        console.log("Delete Password :", response.data.account);

        if (response.data.status === 200) {
            console.log('Account successfully Deleted');
            this.toastService.successToast('Account successfully Deleted');
        } else {
            console.log('Email or password is incorrect');
            this.toastService.failedToast('Email or password is incorrect');
        }
    } catch (error) {
        console.error("Error deleting account:", error);
        this.toastService.failedToast('Error deleting account');
    }
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }
}