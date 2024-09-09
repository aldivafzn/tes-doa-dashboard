import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
// import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
import { ToastService } from '../../toast.service';
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string,
  userId: string,
  role: string,
  iat: number,
  exp: number
}

interface Personnel {
  person_id: string,
  person_name: string,
  person_no: string,
  job_title: string,
  department: string,
  email_address: string,
  birth_date: Date | string,
  employment_date: Date | string,
  job_desc: string,
  design_exp: string
}

@Component({
  selector: 'app-edit-personnel',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './edit-personnel.component.html',
  styleUrls: ['./edit-personnel.component.css']
})

export class EditPersonnelComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }
  personnelData: Personnel = {
    person_id: '',
    person_name: '',
    person_no: '',
    job_title: '',
    department: '',
    email_address: '',
    birth_date: '',
    employment_date: '',
    job_desc: '',
    design_exp: ''
  }
  role: string | null = null;
  currentPersonId = '';

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
    }
    if (this.role !== 'Admin' && this.role !== 'AO') {
      this.toastService.failedToast('Unauthorized to access page');
      window.location.href ='/detailPersonnel';
    }
    const person_id = sessionStorage.getItem('person_id');
    if (person_id) {
      this.currentPersonId = person_id;
    }
    this.fetchPersonnel();
  }

  async fetchPersonnel() {
    try {
      const response = await axios.post('http://localhost:4040/personnel/show', 
        { person_id: this.currentPersonId }
      );
      this.personnelData = {
        person_id: response.data.showProduct.person_id,
        person_name: response.data.showProduct.person_name,
        person_no: response.data.showProduct.person_no,
        job_title: response.data.showProduct.job_title,
        department: response.data.showProduct.department,
        email_address: response.data.showProduct.email_address,
        birth_date: response.data.showProduct.birth_date,
        employment_date: response.data.showProduct.employment_date,
        job_desc: response.data.showProduct.job_desc,
        design_exp: response.data.showProduct.design_exp
      }
      this.personnelData.birth_date = this.personnelData.birth_date.toString().slice(0, 10);
      this.personnelData.employment_date = this.personnelData.employment_date.toString().slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching personnel data');
      console.error('There was an error fetching personnel data:', error);
    }
  }

  async updatePersonnel() {
    this.personnelData.birth_date = new Date(this.personnelData.birth_date);
    this.personnelData.employment_date = new Date(this.personnelData.employment_date);
    const generatingToastElement = this.toastService.generatingToast('Updating personnel...');
    try {
      const response = await axios.put('http://localhost:4040/personnel/update', this.personnelData);
      if (response.data.status === 200) {
        this.toastService.successToast('Personnel updated successfully');
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to update personnel data');
        console.error('Failed to update personnel data');
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating personnel data');
      console.error('There was an error updating personnel data:', error);
    }
    document.removeChild(generatingToastElement);
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }
}