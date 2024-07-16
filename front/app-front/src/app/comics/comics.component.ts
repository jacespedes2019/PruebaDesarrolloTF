import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Comic, Favorite, User } from '../models/models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-comics',
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss']
})
export class ComicsComponent implements OnInit {
  comics: Comic[] = [];
  userName: string = '';
  totalComics: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  isLoading: boolean = true; // Variable para controlar el estado de carga
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadComics();
    this.apiService.getProfile().subscribe(
      (user: User) => this.userName = user.name,
      error => console.error('Error fetching user profile:', error)
    );

    this.apiService.getTotalComics().subscribe(
      data => this.totalComics = data.total,
      error => console.error('Error fetching total comics:', error)
    );
  }

  loadComics(page: number = this.currentPage, limit: number = this.pageSize): void {
    this.isLoading = true; // Iniciar el símbolo de carga
    this.apiService.getComics(page, limit).subscribe(
      comics => {
        this.comics = comics;
        this.isLoading = false; // Detener el símbolo de carga
      },
      error => {
        console.error('Error fetching comics:', error);
        this.isLoading = false; // Detener el símbolo de carga en caso de error
      }
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadComics(this.currentPage, this.pageSize);
  }

  addToFavorites(comic: Comic): void {
    const favorite = new Favorite(comic.id, comic.title, comic.description || '', comic.image);
    this.apiService.addToFavorites(favorite).subscribe(
      () => alert('Cómic añadido a favoritos'),
      error => alert('Cómic ya existente en la lista')
    );
  }

  goToFirstPage(): void {
    this.paginator.firstPage();
  }

  goToLastPage(): void {
    const lastPageIndex = Math.ceil(this.totalComics / this.pageSize) - 1;
    this.paginator.pageIndex = lastPageIndex;
    this.loadComics(lastPageIndex, this.pageSize);
  }
}
