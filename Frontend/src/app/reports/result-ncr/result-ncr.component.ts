import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';


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
  problem_analysis: string,
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

interface ResultNCR {
  ncr_init_id: string,
  close_corrective_actions: string,
  proposed_close_auditee: string,
  proposed_close_date: Date | string,
  is_close: boolean | string,
  effectiveness: string,
  refer_verification: string,
  sheet_no: string,
  new_ncr_issue_nbr: string,
  close_approved_by: string,
  close_approved_date: Date | string,
  verified_chief_im: string,
  verified_date: Date | string,
  temporarylink: string
}

@Component({
  selector: 'app-result-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './result-ncr.component.html',
  styleUrl: './result-ncr.component.css'
})
export class ResultNCRComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentNCRInitId = '';
  resultNCRData: ResultNCR = {
    ncr_init_id: '',
    proposed_close_auditee: '',
    close_corrective_actions: '',
    proposed_close_date: '',
    is_close: '',
    effectiveness: '',
    refer_verification: '',
    sheet_no: '',
    new_ncr_issue_nbr: '',
    close_approved_by: '',
    close_approved_date: '',
    verified_chief_im: '',
    verified_date: '',
    temporarylink: ''
  }
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
    temporarylink: ''
  };

  ngOnInit() { 
    const ncr_init_id = sessionStorage.getItem('ncr_init_id');
    if (ncr_init_id) {
      this.currentNCRInitId = ncr_init_id;
    }
    this.fetchNCR();
  }

  async fetchNCR() {
    try {
      const response = await axios.post('http://34.87.6.132:4040/ncr/show',
        { ncr_init_id: this.currentNCRInitId }
      );
      this.ncrData = response.data.showProduct[0];
    } catch (error) {
      this.toastService.failedToast('There was an error fetching NCR');
      console.error('There was an error fetching NCR:', error);
    }
  }

  async submitResultNCR() {
    this.resultNCRData.ncr_init_id = this.currentNCRInitId;
    this.resultNCRData.proposed_close_date = new Date(this.resultNCRData.proposed_close_date);
    this.resultNCRData.close_approved_date = new Date(this.resultNCRData.close_approved_date);
    this.resultNCRData.verified_date = new Date(this.resultNCRData.verified_date);
    console.log("Sending data:", this.resultNCRData);
    const generatingToastElement = this.toastService.generatingToast('Generating NCR Follow Up Result...');
    try {
      const response = await axios.post('http://34.87.6.132:4040/ncr/result/add', this.resultNCRData);
      if (response.data.status === 200) {
        this.toastService.successToast('NCR Follow Up Result added successfully');
        console.log('NCR Follow Up Result added successfully');
        this.ncrData.status = "Closed";
        await axios.put('http://34.87.6.132:4040/ncr/update', this.ncrData);
        window.location.href = '/detailNCR';
      } else {
        this.toastService.failedToast('Failed to add NCR Follow Up Result');
        console.error('Failed to add NCR Follow Up Result:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding NCR Follow Up Result');
      console.error('There was an error adding NCR Follow Up Result', error);
    }
    document.removeChild(generatingToastElement);
  }
}
