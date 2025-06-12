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
    const parts = shortUrl.split('/');
    const shortCode = parts[parts.length - 1] || parts[parts.length - 2];

    const apiUrl = `${Enviroment.apiBaseUrl}/${shortCode}`;
    console.log('Redirecting to:', apiUrl);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(apiUrl)
      .then(async (res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        const text = await res.text();
        let url = '';
        try {
          // Thử parse JSON
          const data = JSON.parse(text);
          url = data.originalUrl || data.url || '';
        } catch {
          // Nếu không phải JSON, assume là string thuần
          url = text.replace(/^"|"$/g, ''); // Bỏ dấu ngoặc kép nếu có
        }
        if (url && url.startsWith('https')) {
          window.location.href = url;
        } else {
          alert('Không tìm thấy link gốc!');
        }
      })
      .catch((err) => {
        alert('Không tìm thấy link gốc!');
        console.error('Fetch error:', err);
      });
  }
}
