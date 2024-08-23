import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadTradingViewWidgets();
    this.startAutoScroll();
  }

  loadTradingViewWidgets(): void {
    // Load Stock Widget
    const stockScript = document.createElement('script');
    stockScript.type = 'text/javascript';
    stockScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    stockScript.async = true;
    stockScript.innerHTML = JSON.stringify({
      "symbol": "IDX:GIAA",
      "width": "100%",
      "locale": "en",
      "colorTheme": "light",
      "isTransparent": false
    });
    document.getElementById('tradingview-stock-widget')?.appendChild(stockScript);

    // Load Chart Widget
    const chartScript = document.createElement('script');
    chartScript.type = 'text/javascript';
    chartScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    chartScript.async = true;
    chartScript.innerHTML = JSON.stringify({
      "symbol": "IDX:GIAA",
      "width": "100%",
      "height": "400",
      "locale": "en",
      "colorTheme": "light",
      "isTransparent": false
    });
    document.getElementById('tradingview-chart-widget')?.appendChild(chartScript);
  }

  startAutoScroll() {
    const carousel: HTMLElement | null = document.querySelector('.carousel');
    if (!carousel) return;

    let index = 0;
    const items = carousel.querySelectorAll('.carousel-item');
    const totalItems = items.length;

    setInterval(() => {
      items.forEach((item, idx) => {
        item.classList.remove('active');
        if (idx === index) {
          item.classList.add('active');
        }
      });
      index = (index + 1) % totalItems;
    }, 5000);
  }
}
