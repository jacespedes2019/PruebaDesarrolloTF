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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getFavorites().subscribe(
      favorites => this.favorites = favorites,
      error => console.error('Error fetching favorites:', error)
    );
  }

  removeFromFavorites(comicId: number): void {
    this.apiService.removeFromFavorites(comicId).subscribe(
      () => this.favorites = this.favorites.filter(fav => fav.comic_id !== comicId),
      error => console.error('Error removing comic from favorites:', error)
    );
  }
}
