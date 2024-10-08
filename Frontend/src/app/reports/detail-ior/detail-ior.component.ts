import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
import { ToastService } from '../../toast.service';

interface JwtPayload {
  email: string,
  userId: string,
  role: string,
  iat: number,
  exp: number
}

enum uic {
  Chief_Design_Office = "Chief Design Office",
  Chief_Airworthiness_Office = "Chief Airworthiness Office",
  Chief_Independent_Monitoring = "Chief Independent Monitoring",
  Head_of_DOA = "Head of DOA"
}

enum category_occur {
  DOA_Management = "DOA Management",
  Procedure = "Procedure",
  Document = "Document",
  Personnel = "Personnel",
  Facility = "Facility",
  Partner_of_Subcontractor = "Partner or Subcontractor",
  Material = "Material",
  Information_Technology = "Information Technology",
  Training = "Training",
  Others = "Others"
}

interface Occurence {
  id_ior: string,
  subject_ior: string,
  occur_nbr: string,
  occur_date: string,
  reference_ior: string,
  to_uic: string,
  cc_uic: string,
  category_occur: string,
  type_or_pnbr: string,
  level_type: string,
  detail_occurance: string,
  reportedby: string,
  reporter_uic: string,
  report_date: string,
  reporter_identity: string,
  data_reference: string,
  hirac_process: string,
  initial_probability: string,
  initial_severity: string,
  initial_riskindex: string,
  document_id: string
}

interface FollowonIOR {
  id_follup: string,
  id_ior: string,
  follup_detail: string,
  follupby: string,
  follup_uic: string,
  follup_date: string,
  follup_datarefer: boolean | string,
  follup_status: string,
  nextuic_follup: string,
  current_probability: string,
  current_severity: string,
  current_riskindex: string
}

@Component({
  selector: 'app-detail-ior',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './detail-ior.component.html',
  styleUrls: ['./detail-ior.component.css']
})

export class DetailIORComponent implements OnInit{
  constructor(private toastService: ToastService, private authService: AuthService) { }

  iorData: Occurence = {
    id_ior: '',
    subject_ior: '',
    occur_nbr: '',
    occur_date: '',
    reference_ior: '',
    to_uic: '',
    cc_uic: '',
    category_occur: '',
    type_or_pnbr: '',
    level_type: '',
    detail_occurance: '',
    reportedby: '',
    reporter_uic: '',
    report_date: '',
    reporter_identity: '',
    data_reference: '',
    hirac_process: '',
    initial_probability: '',
    initial_severity: '',
    initial_riskindex: '',
    document_id: ''
  }
  followons: FollowonIOR[] = [];
  role: string | null = null;
  currentIORID = '';
  isInitialized: boolean = false;

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const { role } = jwtDecode<JwtPayload>(token);
      this.role = role;
      console.log('Retrieved role:', this.role);
    }

    const id_ior = sessionStorage.getItem('id_ior');
    if (id_ior) {
      this.currentIORID = id_ior;
    }
    this.fetchIOR();
    this.fetchFollowonIOR();
  }

  async fetchIOR() {
    try {
      const response = await axios.post('http://localhost:4040/ior/show',
        { id_IOR: this.currentIORID }
      );
      this.iorData = response.data.result;
      this.iorData.to_uic = this.convertEnumValue(uic, this.iorData.to_uic);
      this.iorData.cc_uic = this.convertEnumValue(uic, this.iorData.cc_uic);
      this.iorData.category_occur = this.convertEnumValue(category_occur, this.iorData.category_occur);
      this.iorData.reporter_uic = this.convertEnumValue(uic, this.iorData.reporter_uic);
      this.iorData.occur_date = this.iorData.occur_date.slice(0, 10);
      this.iorData.report_date = this.iorData.report_date.slice(0, 10);
    } catch (error) {
      this.toastService.failedToast('There was an error fetching NCR');
      console.error('There was an error fetching NCR:', error);
    }
  }

  async fetchFollowonIOR() {
    try {
      const response = await axios.get('http://localhost:4040/ior/follow-up/show-all');
      if (response.data.status === 200) {
        for (let i = 0; i < response.data.result.length; i++) {
          if (response.data.result[i].id_ior === this.currentIORID) {
            this.followons.push(response.data.result[i]);
          }
        }
        for (let i = 0; i < this.followons.length; i++) {
          this.followons[i].follup_uic = this.convertEnumValue(uic, this.followons[i].follup_uic);
          this.followons[i].nextuic_follup = this.convertEnumValue(uic, this.followons[i].nextuic_follup);
          this.followons[i].follup_date = this.followons[i].follup_date.slice(0, 10);
          this.followons[i].follup_datarefer = this.followons[i].follup_datarefer ? "Yes" : "No";
        }
      } else {
        console.error('Error message:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    this.isInitialized = true;
  }

  exportToExcel(): void {
    const table = document.getElementById('export-table');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const fileName = `Follow_On_${this.iorData.occur_nbr}_${formattedDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }

  async navigatePreview() {
    const generatePDFToastElement = this.toastService.generatingToast('Generating PDF');
    try {
      const response = await axios.post('http://localhost:4040/ior/getPDF', 
        { id_IOR: this.currentIORID }
      );
      if (response.data.status === 200) {
        this.toastService.successToast('PDF generated successfully! Redirecting...');
        const preview = window.open(response.data.result.data.document_id, '_blank');
        if (preview) {
          preview.focus();
        }
      } else {
        this.toastService.failedToast('There was an error while generating PDF');
        console.error('Error Message:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('Failed to generate PDF');
      console.error('Error:', error);
    }
    document.body.removeChild(generatePDFToastElement);
  }

  navigateEditIOR() {
    window.location.href = '/editIOR';
  }

  navigateAddFollowon() {
    window.location.href = '/addFollowonIOR';
  }

  navigateEditFollowon(id_follup: string) {
    sessionStorage.setItem('id_follup_ior', id_follup);
    window.location.href = '/editFollowonIOR';
  }

  convertEnumValue(enumObj: any, value: string): string {
    // Convert the value if it's a key in the enum object
    return enumObj[value] || value;
  }

  closeDetails(element_id: string) {
    const element = document.getElementById(element_id);
    if (element) {
      element.removeAttribute('open');
    }
  }
}