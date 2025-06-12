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
          if (url && url.startsWith('http')) {
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
}
