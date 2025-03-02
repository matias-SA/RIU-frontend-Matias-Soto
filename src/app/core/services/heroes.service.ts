import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, forkJoin } from "rxjs";
import { Hero } from "../interfaces/hero.interface";
import { map, tap, delay, switchMap } from "rxjs/operators";
import { default as data } from "../../../assets/data/data.json";
export interface PaginatedHeroes {
  heroes: Hero[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface HeroCreate {
  name: string;
  image: string;
  description?: string;
  team: string;
  powers?: string[];
  firstAppearance?: number;
  realName?: string;
  rating?: number;
}

@Injectable({ providedIn: "root" })
export class HeroesService {
  public heroes = signal<Hero[]>(data);
  private lastId = signal<number>(0);

  constructor(private http: HttpClient) {}

  private initializeCache(): Observable<Hero[]> {
    const heroesHttp = this.http.get<Hero[]>("assets/data/data.json").pipe(
      tap((heroes) => {
        this.updateLastId(heroes);
      })
      //   map(() => this.getFilteredHeroes())
    );
    const heroesSignal = of(this.heroes());

    return forkJoin([heroesHttp, heroesSignal]).pipe(
      map(([heroesHttp, heroesSignal]) => {
        return [...heroesSignal];
      })
    );
  }

  private updateLastId(heroes: Hero[]): void {
    if (heroes.length > 0) {
      const maxId = Math.max(...heroes.map((hero) => hero.id));
      this.lastId.set(maxId);
    }
  }

  //   private getFilteredHeroes(): Hero[] {
  //     return this.heroesCache().filter(
  //       (hero) => !this.deletedHeroIds().includes(hero.id)
  //     );
  //   }

  public getHeroes(
    page: number = 1,
    pageSize: number = 5
  ): Observable<PaginatedHeroes> {
    return this.initializeCache().pipe(
      map((heroes) => this.paginateHeroes(heroes, page, pageSize))
    );
  }

  public searchHeroes(
    name: string,
    page: number = 1,
    pageSize: number = 5
  ): Observable<PaginatedHeroes> {
    return this.initializeCache().pipe(
      map((heroes) => {
        const searchTerm = name.toLowerCase();
        const filteredHeroes = heroes.filter((hero) =>
          hero.name.toLowerCase().includes(searchTerm)
        );

        return this.paginateHeroes(filteredHeroes, page, pageSize);
      })
    );
  }

  public createHero(heroData: HeroCreate): Observable<Hero> {
    const newId = this.lastId() + 1;

    const newHero: Hero = {
      id: newId,
      name: heroData.name,
      image: heroData.image,
      description: heroData.description || "",
      team: heroData.team,
      powers: heroData.powers || [],
      firstAppearance: heroData.firstAppearance || new Date().getFullYear(),
      realName: heroData.realName || "",
      rating: heroData.rating || 5,
    };

    return this.http.post<Hero>("assets/data/data.json", newHero).pipe(
      delay(800),
      tap(() => {
        console.log(this.heroes());
        this.heroes.update((heroes) => [...heroes, newHero]);
        console.log(this.heroes());
        this.lastId.set(newId);
      }),
      map(() => newHero)
    );
  }

  public updateHero(id: number, heroData: Partial<Hero>): Observable<Hero> {
    return this.initializeCache().pipe(
      switchMap((heroes) => {
        const heroIndex = heroes.findIndex((h) => h.id === id);

        if (heroIndex === -1) {
          throw new Error(`Héroe con ID ${id} no encontrado`);
        }

        const updatedHero: Hero = {
          ...heroes[heroIndex],
          ...heroData,
          id,
        };

        return this.http.put<Hero>("assets/data/data.json", updatedHero).pipe(
          delay(800),
          tap(() => {
            const updatedHeroes = [...this.heroes()];
            updatedHeroes[heroIndex] = updatedHero;
            this.heroes.set(updatedHeroes);
          }),
          map(() => updatedHero)
        );
      })
    );
  }

  public deleteHero(id: number): Observable<void> {
    return this.http.delete<void>("assets/data/data.json").pipe(
      delay(800),
      tap(() => {
        this.heroes.update((heroes) => heroes.filter((hero) => hero.id !== id));
      })
    );
  }

  public getHeroById(id: number): Observable<Hero | undefined> {
    return this.initializeCache().pipe(
      map((heroes) => heroes.find((hero) => hero.id === id))
    );
  }

  private paginateHeroes(
    heroes: Hero[],
    page: number = 1,
    pageSize: number = 5
  ): PaginatedHeroes {
    const total = heroes.length;
    const totalPages = Math.ceil(total / pageSize);

    const validPage = Math.max(1, Math.min(page, totalPages || 1));

    const startIndex = (validPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);

    const paginatedHeroes = heroes.slice(startIndex, endIndex).map((hero) => ({
      id: hero.id,
      name: hero.name,
      image: hero.image,
      team: hero.team,
    }));

    return {
      heroes: paginatedHeroes,
      total,
      currentPage: validPage,
      totalPages: totalPages || 1,
    };
  }
}
