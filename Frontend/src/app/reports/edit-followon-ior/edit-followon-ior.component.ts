import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth.service';
import axios from 'axios';

interface FollowonIOR {
  id_IOR: string,
  follup_detail: string,
  follupby: string,
  follup_uic: string,
  follup_date: Date | string,
  follup_datarefer: string | boolean,
  follup_status: string,
  nextuic_follup: string,
  current_probability: string,
  current_severity: string,
  current_riskindex: string
}

@Component({
  selector: 'app-edit-followon-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './edit-followon-ior.component.html',
  styleUrl: './edit-followon-ior.component.css'
})
export class EditFollowonIORComponent implements OnInit{
  constructor(private toastService: ToastService, private authService: AuthService) { }
  currentFollowonIorID = '';
  followonData: FollowonIOR = {
    id_IOR: '',
    follup_detail: '',
    follupby: '',
    follup_uic: '',
    follup_date: '',
    follup_datarefer: '',
    follup_status: '',
    nextuic_follup: '',
    current_probability: '',
    current_severity: '',
    current_riskindex: ''
  };

  ngOnInit() {
    const id_follup_ior = sessionStorage.getItem('id_follup_ior');
    if (id_follup_ior) {
      this.currentFollowonIorID = id_follup_ior;
      console.log('Retrieved id_follup_ior:', id_follup_ior);
      this.fetchFollowupIOR();
    } else {
      window.location.href = '/searchFollowupIOR';
    }
  }

  async fetchFollowupIOR() {
    try {
      const response = await axios.post('http://34.87.6.132:4040/ior/follow-up/show',
        { id_follup: this.currentFollowonIorID }
      );
      this.followonData = response.data.result;
      this.followonData.follup_date = this.followonData.follup_date.toString().slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching IOR Follow On');
      console.error('There was an error fetching IOR Follow On:', error);
    }
  }

  async updateFollowupIOR() {
    this.followonData.id_IOR = this.currentFollowonIorID;
    this.followonData.follup_date = new Date(this.followonData.follup_date)
    console.log("Sending data:", this.followonData);
    const generatingToastElement = this.toastService.generatingToast('Updating IOR Follow On...');
    try {
      const response = await axios.put('http://34.87.6.132:4040/ior/follow-up/update', this.followonData);
      if (response.data.status === 200) {
        this.toastService.successToast('IOR Follow On updated successfully');
        console.log('IOR Follow On updated successfully');
        sessionStorage.removeItem('id_follup_ior');
        window.location.href = '/searchFollowonIOR';
      } else {
        this.toastService.failedToast('Failed to update IOR Follow On');
        console.error('Failed to update IOR Follow On:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating IOR Follow On');
      console.error('There was an error updating IOR Follow On', error);
    }
    document.removeChild(generatingToastElement);
  }
}
