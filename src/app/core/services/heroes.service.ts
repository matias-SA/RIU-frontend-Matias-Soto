import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Hero } from "../interfaces/hero.interface";
import { map, delay } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class HeroesService {
  constructor(private http: HttpClient) {}

  public getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>("assets/data/data.json").pipe(
      map((heroes) => {
        return heroes.map((hero) => {
          return {
            id: hero.id,
            name: hero.name,
            image: hero.image,
            team: hero.team,
          };
        });
      })
    );
  }
}
