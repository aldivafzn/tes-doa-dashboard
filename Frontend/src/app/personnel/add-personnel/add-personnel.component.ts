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

interface Education {
  university: string,
  major: string,
  graduation_year: string | number,
  remark: string,
  person_id: string
}

interface Training {
  training_title: string,
  training_category: string,
  start_date: Date | string,
  finish_date: Date | string,
  interval_recurrent: string | number,
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
  selector: 'app-add-personnel',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './add-personnel.component.html',
  styleUrls: ['./add-personnel.component.css']
})

export class AddPersonnelComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }
  personnelData: Personnel = {
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
  currentPersonId = '';
  
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
      window.location.href ='/searchPersonnel';
    }
  }

  async submitPersonnel() {
    this.personnelData.birth_date = new Date(this.personnelData.birth_date);
    this.personnelData.employment_date = new Date(this.personnelData.employment_date);

    const generatingToastElement = this.toastService.generatingToast('Generating Personnel Form');
    try {
      const response = await axios.post('http://34.87.6.132:4040/personnel/add', this.personnelData);
      if (response.data.status === 200) {
        if (response.data.personnel.person_id) {
          this.currentPersonId = response.data.personnel.person_id;
        }
        await this.submitEducation();
        await this.submitTraining();
        await this.submitExperience();
        await this.submitCertificate();
        this.toastService.successToast('Personnel form created successfully');
        window.location.href = '/searchPersonnel';
      } else {
        this.toastService.failedToast('Failed to submit Personnel form');
        console.error('Failed to submit Personnel form:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error submitting Personnel form');
      console.error('There was an error submitting Personnel form:', error);
    }
    document.body.removeChild(generatingToastElement);
  }

  async submitEducation() {
    try {
      for (let i = 0; i < this.educations.length; i++) {
        this.educations[i].person_id = this.currentPersonId;
        this.educations[i].graduation_year = Number(this.educations[i].graduation_year);
        const response = await axios.post('http://34.87.6.132:4040/personnel/education/add', this.educations[i]);
        if (response.data.status !== 200) {
          this.toastService.failedToast('Failed to submit Education form');
          console.error('Failed to submit Education form:', response.data.message);
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Education form');
      console.error('There was an error adding Education form', error);
      throw error;
    }
  }

  async submitTraining() {
    try {
      for (let i = 0; i < this.trainingRecords.length; i++) {
        this.trainingRecords[i].person_id = this.currentPersonId;
        this.trainingRecords[i].start_date = new Date(this.trainingRecords[i].start_date);
        this.trainingRecords[i].finish_date = new Date(this.trainingRecords[i].finish_date);
        this.trainingRecords[i].next_date = new Date(this.trainingRecords[i].next_date);
        this.trainingRecords[i].interval_recurrent = Number(this.trainingRecords[i].interval_recurrent);
        const response = await axios.post('http://34.87.6.132:4040/personnel/training/add', this.trainingRecords[i]);
        if (response.data.status !== 200) {
          this.toastService.failedToast('Failed to submit Training form');
          console.error('Failed to submit Training form:', response.data.message);
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Training form');
      console.error('There was an error adding Training form', error);
      throw error;
    }
  }

  async submitExperience() {
    try {
      for (let i = 0; i < this.experienceRecords.length; i++) {
        this.experienceRecords[i].person_id = this.currentPersonId;
        this.experienceRecords[i].since_date = new Date(this.experienceRecords[i].since_date);
        this.experienceRecords[i].until_date = new Date(this.experienceRecords[i].until_date);
        const response = await axios.post('http://34.87.6.132:4040/personnel/experience/add', this.experienceRecords[i]);
        if (response.data.status !== 200) {
          this.toastService.failedToast('Failed to submit Experience form');
          console.error('Failed to submit Experience form:', response.data.message);
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Experience form');
      console.error('There was an error adding Experience form', error);
      throw error;
    }
  }

  async submitCertificate() {
    try {
      for (let i = 0; i < this.certifications.length; i++) {
        this.certifications[i].person_id = this.currentPersonId;
        this.certifications[i].cert_first_date = new Date(this.certifications[i].cert_first_date);
        this.certifications[i].cert_expire_date = new Date(this.certifications[i].cert_expire_date);
        const response = await axios.post('http://34.87.6.132:4040/personnel/cert/add', this.certifications[i]);
        if (response.data.status !== 200) {
          this.toastService.failedToast('Failed to submit Certification form');
          console.error('Failed to submit Certification form:', response.data.message);
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Certification form');
      console.error('There was an error adding Certification form', error);
      throw error;
    }
  }

  addEduOptions() {
    this.educations.push({
      university: '',
      major: '',
      graduation_year: '',
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