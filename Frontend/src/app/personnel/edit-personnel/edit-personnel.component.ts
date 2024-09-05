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
  name: string,
  personnel_no: string,
  title: string,
  department: string,
  email: string,
  birth_date: string,
  employ_date: string,
  job_desc: string,
  design_exp: string
}

interface Education {
  university: string,
  major: string,
  grad_year: Date | string,
  remark: string,
  person_id: string
}

interface Training {
  training_title: string,
  training_category: string,
  start_date: Date | string,
  finish_date: Date | string,
  interval_recurrent: string,
  next_date: Date | string,
  place: string,
  result: string,
  remark: string,
  person_id: string
}

interface Experience {
  job_title: string,
  since_date: Date | string,
  until_date: Date | string,
  assignment: string,
  remark: string,
  person_id: string
}

interface Certification {
  regulation_based: string,
  cert_type: string,
  cert_number: string,
  cert_first_date: Date | string,
  cert_expire_date: Date | string,
  cert_letter_nbr: string,
  cert_scope: string,
  person_id: string
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
    name: '',
    personnel_no: '',
    title: '',
    department: '',
    email: '',
    birth_date: '',
    employ_date: '',
    job_desc: '',
    design_exp: ''
  }
  role: string | null = null;
  educations: Education[] = [];
  trainingRecords: Training[] = [];
  experienceRecords: Experience[] = [];
  certifications: Certification[] = [];

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
    this.fetchPersonnel();
  }

  async fetchPersonnel() {
    try {

    } catch (error) {
      this.toastService.failedToast('There was an error fetching personnel data');
      console.error('There was an error fetching personnel data:', error);
    }
  }

  async updatePersonnel() {
    try {

    } catch (error) {
      this.toastService.failedToast('There was an error updating personnel data');
      console.error('There was an error updating personnel data:', error);
    }
  }

  addEduOptions() {
    this.educations.push({
      university: '',
      major: '',
      grad_year: '',
      remark: '',
      person_id: ''
    });
  }

  removeEduOptions() {
    this.educations.pop();
  }

  addTrainingOptions() {
    this.trainingRecords.push({
      training_title: '',
      training_category: '',
      start_date: '',
      finish_date: '',
      interval_recurrent: '',
      next_date: '',
      place: '',
      result: '',
      remark: '',
      person_id: ''
    });
  }

  removeTrainingOptions() {
    this.trainingRecords.pop();
  }

  addExperienceOptions() {
    this.experienceRecords.push({
      job_title: '',
      since_date: '',
      until_date: '',
      assignment: '',
      remark: '',
      person_id: ''
    });
  }

  removeExperienceOptions() {
    this.experienceRecords.pop();
  }

  addCertificationOptions() {
    this.certifications.push({
      regulation_based: '',
      cert_type: '',
      cert_number: '',
      cert_first_date: '',
      cert_expire_date: '',
      cert_letter_nbr: '',
      cert_scope: '',
      person_id: ''
    });
  }

  removeCertificationOptions() {
    this.certifications.pop();
  }
}