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
  employ_date: string
}

@Component({
  selector: 'app-add-personnel',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './add-personnel.component.html',
  styleUrls: ['./add-personnel.component.css']
})

export class AddPersonnelComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  personnelData: Personnel = {
    name: '',
    personnel_no: '',
    title: '',
    department: '',
    email: '',
    birth_date: '',
    employ_date: ''
  }
  role: string | null = null;

  ngOnInit() {
    const token = localStorage.getItem('token')
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

  }
}