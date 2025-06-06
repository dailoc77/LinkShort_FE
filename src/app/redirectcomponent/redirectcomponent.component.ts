import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-redirectcomponent',
  standalone: true,
  imports: [],
  templateUrl: './redirectcomponent.component.html',
  styleUrl: './redirectcomponent.component.css'
})
export class RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    const shortCode = this.route.snapshot.paramMap.get('shortCode');
    if (shortCode) {
      // Gọi MockAPI để lấy originalUrl
      this.http.get<any[]>(`https://68418b25d48516d1d35bf578.mockapi.io/links?shortCode=${shortCode}`)
        .subscribe({
          next: (data) => {
            if (data.length > 0 && data[0].originalUrl) {
              window.location.href = data[0].originalUrl;
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
}
