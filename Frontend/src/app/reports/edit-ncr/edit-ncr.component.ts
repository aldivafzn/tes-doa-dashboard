import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';

@Component({
  selector: 'app-edit-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-ncr.component.html',
  styleUrl: './edit-ncr.component.css'
})
export class EditNCRComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentAccountID = '';
  currentNCRinitID = '';
  ncr_data = {
    accountid: '',
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
    problem_analysis: '',
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
    documentid: '',
  };

  ngOnInit() {
    const accountid = sessionStorage.getItem('accountid');
    if (accountid) {
      this.currentAccountID = accountid;
      console.log('Retrieved accountid:', accountid);
    } else {
      window.location.href = '/login';
    }

    const ncrinitid = sessionStorage.getItem('ncr_init_id');
    if (ncrinitid) {
      this.currentNCRinitID = ncrinitid;
      console.log('Retrieved ncr_init_id:', ncrinitid);
      this.fetchNCR();
    }
  }

  async fetchNCR() {
    try {
      const response = await axios.post('http://localhost:3000/showNCRInit_ID',
        { ncr_init_id: this.currentNCRinitID }
      );
      this.ncr_data = response.data.showProduct[0];
      this.ncr_data.issued_date = this.ncr_data.issued_date.slice(0, 10);
      this.ncr_data.answer_due_date = this.ncr_data.answer_due_date.slice(0, 10);
      this.ncr_data.audit_date = this.ncr_data.audit_date.slice(0, 10);
      this.ncr_data.acknowledge_date = this.ncr_data.acknowledge_date.slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching NCR');
      console.error('There was an error fetching NCR:', error);
    }
  }

  async updateNCR() {
    this.ncr_data.accountid = this.currentAccountID;
    console.log("Sending data:", this.ncr_data);
    try {
      const response = await axios.put('http://localhost:3000/UpdateNCRInit', this.ncr_data);
      if (response.data.status === 200) {
        this.toastService.successToast('NCR updated successfully');
        console.log('NCR updated successfully');
      } else {
        this.toastService.failedToast('Failed to update NCR');
        console.error('Failed to update NCR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating NCR');
      console.error('There was an error updating NCR', error);
    }
  }
}
