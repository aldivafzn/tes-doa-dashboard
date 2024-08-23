import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';

@Component({
  selector: 'app-followon-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './followon-ncr.component.html',
  styleUrl: './followon-ncr.component.css'
})
export class FollowonNCRComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentAccountID = '';
  followncr_data = {
    accountid: '',
    ncr_init_id: '',
    close_corrective: '',
    proposed_close_audit: '',
    proposed_close_date: '',
    is_close: '',
    effective: '',
    refer_verif: '',
    sheet_no: '',
    new_ncr_issue_no: '',
    close_approvedby: '',
    close_approveddate: '',
    verif_chied: '',
    verif_date: '',
    temporarylink: ''
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

  async submitFollowNCR() {
    this.followncr_data.accountid = this.currentAccountID;
    console.log("Sending data:", this.followncr_data);
    try {
      const response = await axios.post('http://localhost:3000/addNCRFollowResult', this.followncr_data);

      if (response.data.status === 200) {
        this.toastService.successToast('Follow on NCR added successfully');
        console.log('Follow on NCR added successfully');
      } else {
        this.toastService.failedToast('Failed to add Follow on NCR');
        console.error('Failed to add Follow on NCR:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Follow on NCR');
      console.error('There was an error adding Follow on NCR', error);
    }
  }
}
