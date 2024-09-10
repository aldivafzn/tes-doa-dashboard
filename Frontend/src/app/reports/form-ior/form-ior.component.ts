import { Component, OnInit, forwardRef } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth.service';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string,
  userId: string,
  role: string,
  iat: number,
  exp: number
}

interface IORData {
  subject_ior: string,
  category_occur: string,
  occur_nbr: string,
  occur_date: Date | string,
  reference_ior: string,
  type_or_pnbr: string,
  to_uic: string,
  cc_uic: string,
  level_type: string,
  detail_occurance: string,
  ReportedBy: string,
  reporter_uic: string,
  report_date: Date | string,
  reporter_identity: string,
  Data_reference: string,
  hirac_process: string,
  initial_probability: string,
  initial_severity: string,
  initial_riskindex: string,
  attachment: File | null
}

@Component({
  selector: 'app-form-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './form-ior.component.html',
  styleUrl: './form-ior.component.css'
})
export class FormIORComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }
  currentAccountID = '';
  ior_data: IORData = {
    subject_ior: '',
    category_occur: '',
    occur_nbr: '',
    occur_date: '',
    reference_ior: '',
    type_or_pnbr: '',
    to_uic: '',
    cc_uic: '',
    level_type: '',
    detail_occurance: '',
    ReportedBy: '',
    reporter_uic: '',
    report_date: '',
    reporter_identity: '',
    Data_reference: '',
    hirac_process: '',
    initial_probability: '',
    initial_severity: '',
    initial_riskindex: '',
    attachment: null
  };

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { userId, role } = jwtDecode<JwtPayload>(token);
      this.currentAccountID = userId;
      console.log('Retrieved accountid:', this.currentAccountID);
      console.log('Retrieved role:', role);
      if (role !== 'Admin' && role !== 'IM') {
        this.toastService.failedToast('Unauthorized to access page');
        window.location.href = '/home';
      }
      if (this.currentAccountID) {
        this.getAccountInfo();
      }
    }
  }

  account: any = {};

  async getAccountInfo() {
    try {
      const response = await axios.post('http://34.87.6.132:4040/account/show', { accountid: this.currentAccountID });
      if (response.data.status === 200 && response.data.account) {
        this.account = response.data.account;
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
  }

  async submitIOR() {
    this.ior_data.occur_date = new Date(this.ior_data.occur_date);
    this.ior_data.report_date = new Date(this.ior_data.report_date);
    console.log("Sending data:", this.ior_data);
    // Show the generating toast
    const generatingToastElement = this.toastService.generatingToast('Generating IOR Form');
  
    try {
        const response = await axios.post("http://34.87.6.132:4040/ior/add", this.ior_data);
        // Remove the generating toast
        document.body.removeChild(generatingToastElement);
        if (response.data.status === 200) {
          this.toastService.successToast('IOR form added successfully');
          console.log("IOR form added successfully");
          window.location.href = '/searchIOR';
        } else {
          //this.toastService.failedToast('Failed to submit IOR form');
          this.toastService.failedToast("Failed to submit IOR form:");
          console.error("Failed to submit IOR form:", response.data.message);
        }
    } catch (error) {
      // Remove the generating toast in case of error
      document.body.removeChild(generatingToastElement);
      this.toastService.failedToast('There was an error adding IOR form');
      console.error('There was an error adding NCR form', error);
    }
  }
}

