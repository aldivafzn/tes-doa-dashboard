import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
import * as XLSX from 'xlsx';
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
  birth_date: string,
  employment_date: string,
  job_desc: string,
  design_exp: string
}

interface Education {
  edu_id: string,
  university: string,
  major: string,
  graduation_year: string | number,
  remark: string,
  person_id: string
}

interface Training {
  training_id: string,
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
  experience_id: string,
  job_title: string,
  since_date: Date | string,
  until_date: Date | string,
  assignment: string,
  remark: string,
  person_id: string
}

interface Certification {
  cert_id: string,
  regulation_based: string,
  cert_type: string,
  cert_number: string,
  cert_first_date: Date | string,
  cert_expire_date: Date | string,
  cert_letter_nbr: string,
  cert_scope: string,
  person_id: string
}

enum OfficeCode {
  TE = "TE",
  TEC_1 = "TEC-1",
  TEA = "TEA",
  TEA_1 = "TEA-1",
  TEA_2 = "TEA-2",
  TEA_3 = "TEA-3",
  TEA_4 = "TEA-4",
  TED = "TED",
  TED_1 = "TED-1",
  TED_2 = "TED-2",
  TED_3 = "TED-3",
  TED_4 = "TED-4",
  TER = "TER",
  TER_1 = "TER-1",
  TER_2 = "TER-2",
  TER_3 = "TER-3",
  TER_4 = "TER-4",
  TER_5 = "TER-5",
  TEL = "TEL",
  TEL_1 = "TEL-1",
  TEL_2 = "TEL-2",
  TEJ = "TEJ",
  TEJ_1 = "TEJ-1",
  TEJ_2 = "TEJ-2",
  TEJ_3 = "TEJ-3",
  TEM = "TEM",
  TEM_1 = "TEM-1",
  TEM_2 = "TEM-2",
  TEM_3 = "TEM-3"
}

enum TrainingCategory {
  Regulatory_Mandatory = "Regulatory Mandatory",
  Regulatory_Non_Mandatory = "Regulatory Non-Mandatory",
  Competence_Requirement = "Competence Requirement",
  Additional = "Additional"
}

@Component({
  selector: 'app-detail-personnel',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './detail-personnel.component.html',
  styleUrls: ['./detail-personnel.component.css']
})

export class DetailPersonnelComponent implements OnInit {
  constructor(private toastService: ToastService, private authService: AuthService) { }

  personnel: Personnel = {
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
  educations: Education[] = [];
  trainingRecords: Training[] = [];
  experienceRecords: Experience[] = [];
  certifications: Certification[] = [];

  role: string | null = null;
  currentPersonId = '';
  isInitialized: boolean = false;

  newEducation: Omit<Education, 'edu_id'> = {
    university: '',
    major: '',
    graduation_year: '',
    remark: '',
    person_id: ''
  };
  newTraining: Omit<Training, 'training_id'> = {
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
  };
  newExperience: Omit<Experience, 'experience_id'> = {
    job_title: '',
    since_date: '',
    until_date: '',
    assignment: '',
    remark: '',
    person_id: ''
  };
  newCert: Omit<Certification, 'cert_id'> = {
    regulation_based: '',
    cert_type: '',
    cert_number: '',
    cert_first_date: '',
    cert_expire_date: '',
    cert_letter_nbr: '',
    cert_scope: '',
    person_id: ''
  }

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
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
      this.personnel = response.data.showProduct;
      this.educations = response.data.showProduct.education;
      this.trainingRecords = response.data.showProduct.training_record;
      this.experienceRecords = response.data.showProduct.experience_record;
      this.certifications = response.data.showProduct.certification;
      this.reformat();
    } catch (error) {
      this.toastService.failedToast('There was an error fetching personnel data');
      console.error('There was an error fetching personnel data:', error);
    }
    this.isInitialized = true;
  }

  exportToExcel(element_id: string): void {
    const table = document.getElementById(element_id);
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const fileName = `Personnel_${formattedDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  navigateEdit() {
    window.location.href = '/editPersonnel';
  }

  async addEducation() {
    const generatingToastElement = this.toastService.generatingToast('Adding education...');
    try {
      this.newEducation.person_id = this.currentPersonId;
      this.newEducation.graduation_year = Number(this.newEducation.graduation_year);
      const response = await axios.post('http://localhost:4040/personnel/education/add', this.newEducation);
      if (response.data.status === 200) {
        this.toastService.successToast('Education added successfully');
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to submit Education form');
        console.error('Failed to submit Education form:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Education form');
      console.error('There was an error adding Education form', error);
    }
    document.removeChild(generatingToastElement);
  }

  async editEducation(education: Education) {
    const generatingToastElement = this.toastService.generatingToast('Updating education...');
    try {
      education.graduation_year = Number(education.graduation_year);
      const response = await axios.put('http://localhost:4040/personnel/education/update', education);
      if (response.data.status === 200) {
        this.toastService.successToast('Education updated successfully')
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to update education');
        console.error('Failed to update education:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating education');
      console.error('There was an error updating education', error);
    }
    document.removeChild(generatingToastElement);
  }

  async addTraining() {
    const generatingToastElement = this.toastService.generatingToast('Adding training...');
    try {
      this.newTraining.person_id = this.currentPersonId;
      this.newTraining.start_date = new Date(this.newTraining.start_date);
      this.newTraining.finish_date = new Date(this.newTraining.finish_date);
      this.newTraining.next_date = new Date(this.newTraining.next_date);
      this.newTraining.interval_recurrent = Number(this.newTraining.interval_recurrent);
      const response = await axios.post('http://localhost:4040/personnel/training/add', this.newTraining);
      if (response.data.status === 200) {
        this.toastService.successToast('Training added successfully');
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to submit Training form');
        console.error('Failed to submit Training form:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Training form');
      console.error('There was an error adding Training form', error);
    }
    document.removeChild(generatingToastElement);
  }

  async editTraining(training: Training) {
    const generatingToastElement = this.toastService.generatingToast('Updating training...');
    try {
      training.start_date = new Date(training.start_date);
      training.finish_date = new Date(training.finish_date);
      training.next_date = new Date(training.next_date);
      training.interval_recurrent = Number(training.interval_recurrent);
      const response = await axios.put('http://localhost:4040/personnel/training/update', training);
      if (response.data.status === 200) {
        this.toastService.successToast('Training updated successfully');
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to update training');
        console.error('Failed to update training:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating training');
      console.error('There was an error updating training', error);
    }
    document.removeChild(generatingToastElement);
  }

  async addExperience() {
    const generatingToastElement = this.toastService.generatingToast('Adding experience...');
    try {
      this.newExperience.person_id = this.currentPersonId;
      this.newExperience.since_date = new Date(this.newExperience.since_date);
      this.newExperience.until_date = new Date(this.newExperience.until_date);
      const response = await axios.post('http://localhost:4040/personnel/experience/add', this.newExperience);
      if (response.data.status === 200) {
        this.toastService.successToast('Experience added successfully');
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to submit Experience form');
        console.error('Failed to submit Experience form:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Experience form');
      console.error('There was an error adding Experience form', error);
    }
    document.removeChild(generatingToastElement);
  }

  async editExperience(experience: Experience) {
    const generatingToastElement = this.toastService.generatingToast('Updating experience...');
    try {
      experience.since_date = new Date(experience.since_date);
      experience.until_date = new Date(experience.until_date);
      const response = await axios.put('http://localhost:4040/personnel/experience/update', experience);
      if (response.data.status === 200) {
        this.toastService.successToast('Experience updated successfully');
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to update experience');
        console.error('Failed to update experience:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating experience');
      console.error('There was an error updating experience', error);
    }
  }

  async addCert() {
    const generatingToastElement = this.toastService.generatingToast('Adding certification...');
    try {
      this.newCert.person_id = this.currentPersonId;
      this.newCert.cert_first_date = new Date(this.newCert.cert_first_date);
      this.newCert.cert_expire_date = new Date(this.newCert.cert_expire_date);
      const response = await axios.post('http://localhost:4040/personnel/cert/add', this.newCert);
      if (response.data.status === 200) {
        this.toastService.successToast('Certification added successfully');
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to submit Certification form');
        console.error('Failed to submit Certification form:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error adding Certification form');
      console.error('There was an error adding Certification form', error);
    }
    document.removeChild(generatingToastElement);
  }

  async editCert(cert: Certification) {
    const generatingToastElement = this.toastService.generatingToast('Updating certification...');
    try {
      cert.cert_first_date = new Date(cert.cert_first_date);
      cert.cert_expire_date = new Date(cert.cert_expire_date);
      const response = await axios.put('http://localhost:4040/personnel/cert/update', cert);
      if (response.data.status === 200) {
        this.toastService.successToast('Certification updated successfully');
        window.location.href = '/detailPersonnel';
      } else {
        this.toastService.failedToast('Failed to update certification');
        console.error('Failed to update certification:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error updating certification');
      console.error('There was an error updating certification', error);
    }
    document.removeChild(generatingToastElement);
  }

  reformat() {
    this.personnel.birth_date = this.personnel.birth_date.slice(0, 10);
    this.personnel.employment_date = this.personnel.employment_date.slice(0, 10);
    this.personnel.department = this.convertEnumValue(OfficeCode, this.personnel.department);
    for (let i = 0; i < this.trainingRecords.length; i++) {
      this.trainingRecords[i].start_date = this.trainingRecords[i].start_date.toString().slice(0, 10);
      this.trainingRecords[i].finish_date = this.trainingRecords[i].finish_date.toString().slice(0, 10);
      this.trainingRecords[i].next_date = this.trainingRecords[i].next_date.toString().slice(0, 10);
      this.trainingRecords[i].training_category = this.convertEnumValue(TrainingCategory, this.trainingRecords[i].training_category);
    }
    for (let i = 0; i < this.experienceRecords.length; i++) {
      this.experienceRecords[i].since_date = this.experienceRecords[i].since_date.toString().slice(0, 10);
      this.experienceRecords[i].until_date = this.experienceRecords[i].until_date.toString().slice(0, 10);
    }
    for (let i = 0; i < this.certifications.length; i++) {
      this.certifications[i].cert_first_date = this.certifications[i].cert_first_date.toString().slice(0, 10);
      this.certifications[i].cert_expire_date = this.certifications[i].cert_expire_date.toString().slice(0, 10);
    }
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }

  closeDetails(element_id: string) {
    const element = document.getElementById(element_id)?.removeAttribute('open');
  }
}