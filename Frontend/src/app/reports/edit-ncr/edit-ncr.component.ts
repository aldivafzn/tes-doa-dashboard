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

interface NCRInitData {
  ncr_init_id: string,
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
  selector: 'app-edit-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-ncr.component.html',
  styleUrl: './edit-ncr.component.css'
})
export class EditNCRComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }
  currentAccountID = '';
  currentNCRinitID = '';
  ncrData: NCRInitData = {
    ncr_init_id: '',
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
    temporarylink: ''
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
    }

    const ncr_init_id = sessionStorage.getItem('ncr_init_id');
    if (ncr_init_id) {
      this.currentNCRinitID = ncr_init_id;
      console.log('Retrieved ncr_init_id:', ncr_init_id);
      this.fetchNCR();
    } else {
      window.location.href = '/searchNCR';
    }
  }

  async fetchNCR() {
    try {
      const response = await axios.post('http://34.87.6.132:4040/ncr/show',
        { ncr_init_id: this.currentNCRinitID }
      );
      this.ncrData = response.data.showProduct[0];
      this.ncrData.issued_date = this.ncrData.issued_date.toString().slice(0, 10);
      this.ncrData.answer_due_date = this.ncrData.answer_due_date.toString().slice(0, 10);
      this.ncrData.audit_date = this.ncrData.audit_date.toString().slice(0, 10);
      this.ncrData.acknowledge_date = this.ncrData.acknowledge_date.toString().slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching NCR');
      console.error('There was an error fetching NCR:', error);
    }
  }

  async updateNCR() {
    this.ncrData.issued_date = new Date(this.ncrData.issued_date);
    this.ncrData.answer_due_date = new Date(this.ncrData.answer_due_date);
    this.ncrData.audit_date = new Date(this.ncrData.audit_date);
    this.ncrData.acknowledge_date = new Date(this.ncrData.acknowledge_date);
    console.log("Sending data:", this.ncrData);
    const generatingToastElement = this.toastService.generatingToast('Updating NCR...');
    try {
      const response = await axios.put('http://34.87.6.132:4040/ncr/update', this.ncrData);
      if (response.data.status === 200) {
        this.toastService.successToast('NCR updated successfully');
        console.log('NCR updated successfully');
        window.location.href = '/detailNCR';
      } else {
        this.toastService.failedToast('Failed to update NCR');
        console.error('Failed to update NCR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating NCR');
      console.error('There was an error updating NCR', error);
    }
    document.removeChild(generatingToastElement);
  }
}
