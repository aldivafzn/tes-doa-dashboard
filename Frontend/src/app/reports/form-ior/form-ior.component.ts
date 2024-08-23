import { Component, OnInit, forwardRef } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';

@Component({
  selector: 'app-form-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './form-ior.component.html',
  styleUrl: './form-ior.component.css'
})
export class FormIORComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentAccountID = '';
  ior_data = {
    subject_ior: '',
    occur_nbr: '',
    occur_date: '',
    reference_ior: '',
    to_uic: '',
    cc_uic: '',
    category_occur: '',
    type_or_pnbr: '',
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
    initial_riskindex: ''
  };

  ngOnInit() {
    const accountid = sessionStorage.getItem('accountid');
    if (accountid) {
      this.currentAccountID = accountid;
      console.log('Retrieved accountid:', accountid);
      this.getAccountInfo();
    } else {
      window.location.href = '/login';
    }
  }

  account: any = {};

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:3000/showAccount', { accountid: this.currentAccountID });
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
        const response = await axios.post("http://localhost:3000/addOccurrence", this.ior_data);
        // Remove the generating toast
        document.body.removeChild(generatingToastElement);
        if (response.data.status === 200) {
          this.toastService.successToast('IOR form added successfully');
          console.log("IOR form added successfully");
        } else {
          this.toastService.failedToast('Failed to submit IOR form');
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

