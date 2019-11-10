import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, filter } from 'rxjs/operators'

import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }


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
  }

  // PUT: update the hero on the server
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>(`updateHero`))
    );
  }

  // POST: add a new hero to the server
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero')),
      )
  }

  // DELETE: delete the hero from server
  deleteHero(hero: Hero | number): Observable<Hero> {

    const id = typeof hero === 'number' ? hero : hero.id;
    const url = this.heroesUrl + '/' + id;

    return this.http.delete<Hero>(url, this.httpOptions)
    .pipe(
      tap(_ => this.log(`deleted hero id = ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }
  // Log a HeroService message with the MessageService
  private log(message: string): void {
    this.messageService.add('HeroService: ' + message);
  }

  // GET heroes whose name contains search term
  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()){
      return of([]);
    }
    return this.http.get<Hero[]>(this.heroesUrl+`/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}`)),
      catchError(this.handleError<Hero[]>(`searchHeroes`, []))
    )
  }


  constructor(
    private http: HttpClient, 
    private messageService: MessageService,) { }
}
