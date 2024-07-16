import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Comic, Favorite, User } from '../models/models';

@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss']
})
export class ComicsComponent implements OnInit {
  comics: Comic[] = [];
  userName: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProfile().subscribe(
      (user: User) => {
        this.userName = user.name;
        localStorage.setItem('userName', this.userName); // Guardar en localStorage
      },
      error => console.error('Error fetching user profile:', error)
    );

    this.apiService.getComics(0, 20).subscribe(
      comics => this.comics = comics,
      error => console.error('Error fetching comics:', error)
    );
  }

  addToFavorites(comic: Comic): void {
    const favorite = new Favorite(comic.id, comic.title, comic.description || '', comic.image);
    this.apiService.addToFavorites(favorite).subscribe(
      () => alert('Cómic añadido con éxito'),
      error => alert('Error, el cómic ya se encuentra añadido')
    );
  }
}
