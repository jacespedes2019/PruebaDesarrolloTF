import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Comic, Favorite } from '../models/models';

@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss']
})
export class ComicsComponent implements OnInit {
  comics: Comic[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getComics(0, 20).subscribe(
      comics => this.comics = comics,
      error => console.error('Error fetching comics:', error)
    );
  }

  addToFavorites(comic: Comic): void {
    const favorite = new Favorite(comic.id, comic.title, comic.description || '', comic.image);
    this.apiService.addToFavorites(favorite).subscribe(
      () => console.log('Comic added to favorites'),
      error => console.error('Error adding comic to favorites:', error)
    );
  }
}
