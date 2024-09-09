import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
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

@Component({
  selector: 'app-search-personnel',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './search-personnel.component.html',
  styleUrls: ['./search-personnel.component.css']
})

export class SearchPersonnelComponent implements OnInit {
  constructor(private authService: AuthService) { }

  items: Personnel[] = [];
  searchTerm: string = ''; // Define searchTerm here

  role: string | null = null;
  isInitialized: boolean = false;

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
    }
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('http://localhost:4040/personnel/show-all');
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].department = this.convertEnumValue(OfficeCode, this.items[i].department);
          this.items[i].birth_date = this.items[i].birth_date.slice(0, 10);
          this.items[i].employment_date = this.items[i].employment_date.slice(0, 10);
        }
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    this.isInitialized = true;
  }

  async fetchDataBySearchTerm() {
    try {
      const response = await axios.post('http://localhost:4040/personnel/search', {
        input: this.searchTerm
      });
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].department = this.convertEnumValue(OfficeCode, this.items[i].department);
          this.items[i].birth_date = this.items[i].birth_date.slice(0, 10);
          this.items[i].employment_date = this.items[i].employment_date.slice(0, 10);
        }
      } else {
        console.error('Error Message:', response.data.message);
        this.items = [];
      }
    } catch (error) {
      console.error('Error:', error);
      this.items = [];
    }
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

  async navigatePreview(documentId: string) {
    try {
      sessionStorage.setItem('document_id', documentId);
      console.log(documentId);
      const response = await axios.post('http://localhost:3000/getPDFDrive', { documentId });
      console.log(response.data.message);
      if (response.data.status === 200) {
        window.location.href = response.data.message;
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  search() {
    this.fetchDataBySearchTerm();
  }

  navigateAdd() {
    window.location.href = '/addPersonnel';
  }

  navigateDetail(person_id: string) {
    sessionStorage.setItem('person_id', person_id);
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }
}