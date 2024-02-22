import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';
import { Observable, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  form: FormGroup = new FormGroup({
    searchBar: new FormControl()
  });
  results$: Observable<any> | undefined;
  data: any[] = [];

  constructor(private _testService: TestService) {
    this.form.get('searchBar')?.valueChanges.
    pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search) => this._testService.getData(search))
    ).subscribe((res: any) => {
      this.data = res.data.map((anime: any) => {
        return {
          title: anime.title,
          img: anime.images.jpg.image_url
        }
      });
    });
    console.log(this.data)
  }

}
