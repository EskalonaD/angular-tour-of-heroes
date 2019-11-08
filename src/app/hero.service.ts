import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators'

import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  /* 
  Handle http operation that failed 
  Let the app continue.
  @param operation - name of the operation that failes
  @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  // GET heroes from the server
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetchedHeroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }
  
  // GET hero by id. Will 404 if if not found
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`)),
    )
    // this.messageService.add(`HeroService: fetched her id =${id}`)
    // return this.http.get<Hero[]>(this.heroesUrl).find(el => el.id === id )
  }

  // Log a HeroService message with the MessageService
  private log(message: string): void {
    this.messageService.add('HeroService: ' + message);
  }

  constructor(
    private http: HttpClient, 
    private messageService: MessageService,) { }
}
