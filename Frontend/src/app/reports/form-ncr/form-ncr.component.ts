import { Component, OnInit } from '@angular/core';
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

interface NCRData {
  regulationbased: string,
  subject: string,
  audit_plan_no: string,
  ncr_no: string,
  issued_date: Date | string,
  responsibility_office: string,
  audit_type: string,
  audit_scope: string,
  to_uic: string,
  attention: string,
  require_condition_reference: string,
  level_finding: string,
  pa_requirement: string,
  answer_due_date: Date | string,
  issue_ian: string | boolean,
  ian_no: string,
  encountered_condition: string,
  audit_by: string,
  audit_date: Date | string,
  acknowledge_by: string,
  acknowledge_date: Date | string,
  status: string,
  temporarylink: string
}

@Component({
  selector: 'app-form-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './form-ncr.component.html',
  styleUrl: './form-ncr.component.css'
})
export class FormNCRComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }
  currentAccountID = '';
  ncrData: NCRData = {
    regulationbased: '',
    subject: '',
    audit_plan_no: '',
    ncr_no: '',
    issued_date: '',
    responsibility_office: '',
    audit_type: '',
    audit_scope: '',
    to_uic: '',
    attention: '',
    require_condition_reference: '',
    level_finding: '',
    pa_requirement: '',
    answer_due_date: '',
    issue_ian: '',
    ian_no: '',
    encountered_condition: '',
    audit_by: '',
    audit_date: '',
    acknowledge_by: '',
    acknowledge_date: '',
    status: '',
    temporarylink: '',
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

  async submitNCR() {
    switch (this.ncrData.regulationbased) {
      case 'DGCA':
        this.ncrData.audit_plan_no.padStart(7, '0');
        this.ncrData.audit_plan_no = 'AP-' + this.ncrData.audit_plan_no;
        break;
      case 'EASA':
        this.ncrData.audit_plan_no.padStart(3, '0');
        this.ncrData.audit_plan_no = 'AP/E-' + this.ncrData.audit_plan_no;
        break;
    }
    this.ncrData.issued_date = new Date(this.ncrData.issued_date);
    this.ncrData.answer_due_date = new Date(this.ncrData.answer_due_date);
    this.ncrData.audit_date = new Date(this.ncrData.audit_date);
    this.ncrData.acknowledge_date = new Date(this.ncrData.acknowledge_date);
    console.log("Sending data:", this.ncrData);
  
    // Show the generating toast
    const generatingToastElement = this.toastService.generatingToast('Generating NCR Form');
  
    try {
      const response = await axios.post('http://localhost:4040/ncr/add', this.ncrData);
  
      // Remove the generating toast
      document.body.removeChild(generatingToastElement);
  
      if (response.data.status === 200) {
        this.toastService.successToast('NCR form added successfully');
        console.log('NCR form added successfully');
        window.location.href = '/searchNCR';
      } else {
        this.toastService.failedToast('Failed to submit NCR form');
        console.error('Failed to submit NCR form:', response.data.message);
      }
    } catch (error) {
      // Remove the generating toast in case of error
      document.body.removeChild(generatingToastElement);
      this.toastService.failedToast('There was an error adding NCR form');
      console.error('There was an error adding NCR form', error);
    }
  }
}
