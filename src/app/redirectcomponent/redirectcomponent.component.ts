import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Enviroment } from '../enviroment';

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    const shortCode = this.route.snapshot.paramMap.get('shortCode');
    if (shortCode) {
      const apiUrl = `${Enviroment.apiBaseUrl}/${shortCode}`;
      fetch(apiUrl)
        .then(async (res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          const data = await res.json();
          // Nếu BE trả về object
          if (data.originalUrl) {
            window.location.href = data.originalUrl;
          }
          // Nếu BE trả về array (giữ lại logic cũ)
          else if (Array.isArray(data) && data.length > 0 && data[0].originalUrl) {
            window.location.href = data[0].originalUrl;
          } else {
            alert('Không tìm thấy link gốc!');
          }
        })
        .catch(() => {
          alert('Không tìm thấy link gốc!');
        });
    }
  }
}
