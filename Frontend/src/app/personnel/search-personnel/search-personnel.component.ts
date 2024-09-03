import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
// import * as XLSX from 'xlsx';
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

interface PersonnelData {
  personnelNo: number,
  name: string,
  department: string,
  email: string,
  employmentDate: string
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

  items: PersonnelData[] = [];
  searchData = { input: '' };
  searchTerm: string = ''; // Define searchTerm here

  role: string | null = null;

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
    }
    //this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      const response = await axios.get('http://localhost:3000/showPersonnelAll');
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].employmentDate = this.items[i].employmentDate.slice(0, 10)
        }
      } else {
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async fetchDataBySearchTerm() {
    try {
      const response = await axios.post('http://localhost:3000/searchPersonnel', {
        ...this.searchData
      });
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
      } else {
        console.error('Error Message:', response.data.message);
        this.items = [];
      }
    } catch (error) {
      console.error('Error:', error);
      this.items = [];
    }
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
}