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
  sub: string,
  iat: number,
  exp: number
}

interface IORData {
  subject_ior: string,
  category_occur: string | null,
  occur_nbr: string | null,
  occur_date: Date | null,
  reference_ior: string | null,
  type_or_pnbr: string | null,
  to_uic: string | null,
  cc_uic: string | null,
  level_type: string | null,
  detail_occurance: string | null,
  ReportedBy: string | null,
  reporter_uic: string | null,
  report_date: Date | null,
  reporter_identity: string | null,
  Data_reference: string | null,
  hirac_process: string | null,
  initial_probability: string | null,
  initial_severity: string | null,
  initial_riskindex: string | null
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
    category_occur: null,
    occur_nbr: null,
    occur_date: null,
    reference_ior: null,
    type_or_pnbr: null,
    to_uic: null,
    cc_uic: null,
    level_type: null,
    detail_occurance: null,
    ReportedBy: null,
    reporter_uic: null,
    report_date: new Date(),
    reporter_identity: null,
    Data_reference: null,
    hirac_process: null,
    initial_probability: null,
    initial_severity: null,
    initial_riskindex: null
  };

  async ngOnInit() {
    const token = await this.authService.getToken();
    if (token) {
      const { sub } = jwtDecode<JwtPayload>(token);
      this.currentAccountID = sub;
      // this.currentAccountID = accountid;
      // console.log('Retrieved accountid:', accountid);
      // this.getAccountInfo();
      // insert functions to decode token and fetch accountid & role with token
    } else {
      window.location.href = '/login';
    }
  }

  account: any = {};

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:4040/account/show', { accountid: this.currentAccountID });
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
    console.log("Sending data:", this.ior_data);
    // Show the generating toast
    const generatingToastElement = this.toastService.generatingToast('Generating NCR Form');
  
    try {
        const response = await axios.post("http://localhost:4040/ior/add", this.ior_data);
        // Remove the generating toast
        document.body.removeChild(generatingToastElement);
        if (response.data.status === 200) {
          this.toastService.successToast('IOR form added successfully');
          console.log("IOR form added successfully");
        } else {
          //this.toastService.failedToast('Failed to submit IOR form');
          this.toastService.failedToast(response.data.status);
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

