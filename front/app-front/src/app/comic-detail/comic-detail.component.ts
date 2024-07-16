import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Comic } from '../models/models';

@Component({
  selector: 'app-comic-detail',
  templateUrl: './comic-detail.component.html',
  styleUrls: ['./comic-detail.component.scss']
})
export class ComicDetailComponent implements OnInit {
  comic: Comic | undefined;
  userName: string = '';
  isLoading = true; // Iniciar el símbolo de carga

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.isLoading = true; // Iniciar el símbolo de carga
    this.userName = localStorage.getItem('userName') || ''; // Recuperar desde localStorage
    const comicId = this.route.snapshot.paramMap.get('id');
    if (comicId) {
      this.apiService.getComicDetails(Number(comicId)).subscribe(
        (comic) => {(this.comic = comic)
          this.isLoading = false; // Iniciar el símbolo de carga
        },
        (error) => {console.error('Error fetching comic details:', error)
          this.isLoading = false; // Iniciar el símbolo de carga
        }
      );
    }
  }
}
