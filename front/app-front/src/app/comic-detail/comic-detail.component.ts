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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || ''; // Recuperar desde localStorage
    const comicId = this.route.snapshot.paramMap.get('id');
    if (comicId) {
      this.apiService.getComicDetails(Number(comicId)).subscribe(
        (comic) => (this.comic = comic),
        (error) => console.error('Error fetching comic details:', error)
      );
    }
  }
}
