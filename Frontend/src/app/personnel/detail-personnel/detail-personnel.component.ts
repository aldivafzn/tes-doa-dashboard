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
  edu_id: string,
  university: string,
  major: string,
  grad_year: Date | string,
  remark: string,
  person_id: string
}

interface Training {
  training_id: string,
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
  educations: Education[] = [
    {
      edu_id: '',
      university: 'Universitas Indonesia',
      major: '(S1) Teknik Komputer',
      grad_year: '2024',
      remark: '',
      person_id: ''
    },
    {
      edu_id: '',
      university: 'Universitas Indonesia',
      major: '(S1) Teknik Komputer',
      grad_year: '2024',
      remark: '',
      person_id: ''
    },
    {
      edu_id: '',
      university: 'Universitas Indonesia',
      major: '(S1) Teknik Komputer',
      grad_year: '2024',
      remark: '',
      person_id: ''
    }
  ];
  trainingRecords: Training[] = [];
  experienceRecords: Experience[] = [];
  certifications: Certification[] = [];

  role: string | null = null;
  isInitialized: boolean = false;

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
    }
    this.fetchPersonnel();
    this.isInitialized = true;
  }

  async fetchPersonnel() {
    try {

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

  async navigatePreview(url: string) {
    if (!url) {
      this.toastService.failedToast('No PDF link is found!');
      return;
    }
    const preview = window.open(url, '_blank');
    if (preview) {
      preview.focus();
    }
  }

  navigateEdit() {
    window.location.href = '/editPersonnel';
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }
}