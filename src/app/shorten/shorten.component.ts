import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Enviroment } from '../enviroment'; // Import your environment file

@Component({
  selector: 'app-shorten',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './shorten.component.html',
  styleUrl: './shorten.component.css'
})
export class ShortenComponent {
  originalUrl = '';
  shortUrl = '';

  constructor(private http: HttpClient) { }

  shortenUrl() {
    const apiUrl = `${Enviroment.apiBaseUrl}`;

    // Tạo shortCode ngẫu nhiên 6 ký tự (chữ + số)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortCode = '';
    for (let i = 0; i < 6; i++) {
      shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const createdAt = new Date();
    const expiredAt = new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 ngày

    const body = {
      originalUrl: this.originalUrl,
      shortCode: shortCode,
      createdAt: createdAt,
      expiredAt: expiredAt
    };

    this.http.post<any>(apiUrl, body)
      .subscribe({
        next: (response) => {
          this.shortUrl = response.shortCode
            ? `https://dailoc77.github.io/LinkShort_FE/#/${response.shortCode}`
            : '';
        },
        error: () => {
          alert('Có lỗi xảy ra khi rút gọn link!');
          this.shortUrl = '';
        }
      });
  }

  redirectToOriginal(event: Event, shortUrl: string) {
    event.preventDefault();
      // Lấy shortCode từ shortUrl
    const shortCode = shortUrl.split('/').pop();
    
    const apiUrl = `http://localhost:8080/links/${shortCode}`;
    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response.originalUrl) {
          window.location.href = response.originalUrl;
        } else {
          alert('Không tìm thấy link gốc!');
        }
      },
      error: () => {
        alert('Không tìm thấy link gốc!');
      }
    });
  }

}
