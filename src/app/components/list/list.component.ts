import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TestService } from '../../services/test.service';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  form: FormGroup = new FormGroup({
    searchBar: new FormControl(),
  });
  results$: Observable<any> | undefined;
  data: {title: string, img: string}[] = [];

  @ViewChild('search') search: ElementRef | undefined;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Slash') {
      this.search?.nativeElement.focus();
    }
  }

  constructor(private _testService: TestService) {
    this.form
      .get('searchBar')
      ?.valueChanges.pipe(
        /* When user finishes typing, waits 400ms to send the observable. If data is updated within that time, it won't timer resets and only the latest data will be sent */
        debounceTime(400),
        /* Sends first distinct element. If user types two time the same value, it won't make the same call again */
        distinctUntilChanged(),
        /* Maps the data given by te observable to return the actual call to the API */
        switchMap((search: any) => {
          if (search === '') {
            return of(null);
          }
          return this._testService.getData(search);
        })
      )
      .subscribe((res: any) => {
        this.data = [];
        if (res) {
          this.data = res.data.map((anime: any) => {
            return {
              title: anime.title,
              img: anime.images.webp.image_url,
            };
          });
        }
        this.search?.nativeElement.blur();
      });
  }
}
