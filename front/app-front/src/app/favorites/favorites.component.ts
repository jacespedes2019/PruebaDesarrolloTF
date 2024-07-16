import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Favorite } from '../models/models';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  userName: string = '';
  isLoading= true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true; // Iniciar el símbolo de carga
    this.userName = localStorage.getItem('userName') || ''; // Recuperar desde localStorage

    this.apiService.getFavorites().subscribe(
      favorites => {this.favorites = favorites
        this.isLoading = false; // Iniciar el símbolo de carga
      },
      error => {console.error('Error fetching favorites:', error)
        this.isLoading = false; // Iniciar el símbolo de carga
      }
    );
  }

  removeFromFavorites(comicId: number): void {
    this.apiService.removeFromFavorites(comicId).subscribe(
      () => this.favorites = this.favorites.filter(fav => fav.comic_id !== comicId),
      error => console.error('Error removing comic from favorites:', error)
    );
  }
}
