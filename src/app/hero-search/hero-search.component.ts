import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { HeroService } from '../hero.service';
import { Hero } from '../hero';

@Component({
    selector: 'app-hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

    constructor(private heroService: HeroService) { }

    heroes$: Observable<Hero[]>;
    private searchTerms = new Subject<string>();

    // Push a search term into the  observable stream.
    search(term: string): void {
        this.searchTerms.next(term);
    }

    ngOnInit() {
        this.heroes$ = this.searchTerms.pipe(
            //wait 300ms after each keystrole before considering the term
            debounceTime(300),

            //ignore new term if same as previous term
            distinctUntilChanged(),

            //switch to new search observable eachtime the term changes
            switchMap((term: string) => this.heroService.searchHeroes(term))
        )
    }
}
