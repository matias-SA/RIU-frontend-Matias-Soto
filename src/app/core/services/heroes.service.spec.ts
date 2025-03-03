import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { HeroesService, PaginatedHeroes, HeroCreate } from "./heroes.service";
import { Hero } from "../interfaces/hero.interface";
import { firstValueFrom, of } from "rxjs";

describe("HeroesService", () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  const mockHeroes: Hero[] = [
    {
      id: 1,
      name: "Spiderman",
      image: "spiderman.jpg",
      team: "Marvel",
      powers: ["telaraña", "agilidad", "fuerza"],
      rating: 5,
      realName: "Peter Parker",
      firstAppearance: 1962,
      description: "El amigable vecino Spiderman",
    },
    {
      id: 2,
      name: "Batman",
      image: "batman.jpg",
      team: "DC",
      powers: ["inteligencia", "artes marciales", "tecnología"],
      rating: 4,
      realName: "Bruce Wayne",
      firstAppearance: 1939,
      description: "El caballero de la noche",
    },
    {
      id: 3,
      name: "Superman",
      image: "superman.jpg",
      team: "DC",
      powers: ["vuelo", "superfuerza", "visión de rayos X"],
      rating: 5,
      realName: "Clark Kent",
      firstAppearance: 1938,
      description: "El hombre de acero",
    },
    {
      id: 4,
      name: "Wonder Woman",
      image: "wonderwoman.jpg",
      team: "DC",
      powers: ["fuerza sobrehumana", "vuelo", "lazo de la verdad"],
      rating: 5,
      realName: "Diana Prince",
      firstAppearance: 1941,
      description: "Princesa amazona",
    },
    {
      id: 5,
      name: "Iron Man",
      image: "ironman.jpg",
      team: "Marvel",
      powers: ["armadura tecnológica", "inteligencia", "recursos"],
      rating: 4,
      realName: "Tony Stark",
      firstAppearance: 1963,
      description: "Genio, millonario, playboy, filántropo",
    },
    {
      id: 6,
      name: "Aquaman",
      image: "aquaman.jpg",
      team: "DC",
      powers: ["vuelo", "superfuerza", "visión de rayos X"],
      rating: 5,
      realName: "Arthur Curry",
      firstAppearance: 1941,
      description: "Genio, millonario, playboy, filántropo",
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("debería crearse el servicio", () => {
    expect(service).toBeTruthy();
  });

  it("debería obtener héroes paginados", fakeAsync(() => {
    service.getHeroes(1, 2).subscribe((result) => {
      expect(result.heroes).toBeDefined();
      expect(result.total).toBeDefined();
      expect(result.currentPage).toBeDefined();
      expect(result.totalPages).toBeDefined();
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("GET");
    req.flush(mockHeroes);

    tick();
  }));

  it("debería buscar héroes por nombre", fakeAsync(() => {
    service.searchHeroes("man", 1, 10).subscribe((result) => {
      expect(result.heroes).toBeDefined();
      expect(Array.isArray(result.heroes)).toBeTrue();
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("GET");
    req.flush(mockHeroes);

    tick();
  }));

  it("debería devolver un array vacío cuando la búsqueda no tiene coincidencias", fakeAsync(() => {
    service.searchHeroes("Pato Donald", 1, 10).subscribe((result) => {
      expect(result.heroes).toBeDefined();
      expect(Array.isArray(result.heroes)).toBeTrue();
      expect(result.heroes.length).toBe(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("GET");
    req.flush(mockHeroes);

    tick();
  }));

  it("debería crear un nuevo héroe", fakeAsync(() => {
    const newHero = {
      name: "Flash",
      image: "flash.jpg",
      team: "DC",
      powers: ["velocidad"],
    };

    service.createHero(newHero).subscribe((hero) => {
      expect(hero.id).toBeDefined();
      expect(hero.name).toBe("Flash");
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("POST");
    req.flush({ id: 3, ...newHero });

    tick(1000);
  }));

  it("debería actualizar un héroe existente", fakeAsync(() => {
    const heroUpdate = {
      name: "Batman Actualizado",
    };

    service.updateHero(1, heroUpdate).subscribe((hero) => {
      expect(hero.id).toBe(1);
      expect(hero.name).toBe("Batman Actualizado");
    });

    const getReq = httpMock.expectOne("assets/data/data.json");
    expect(getReq.request.method).toBe("GET");
    getReq.flush(mockHeroes);

    const putReq = httpMock.expectOne("assets/data/data.json");
    expect(putReq.request.method).toBe("PUT");
    putReq.flush({ ...mockHeroes[0], ...heroUpdate });

    tick(1000);
  }));

  it("debería devolver error al actualizar un héroe inexistente", fakeAsync(() => {
    const heroUpdate = {
      name: "Héroe Inexistente",
    };

    let errorMessage = "";

    service.updateHero(999, heroUpdate).subscribe({
      next: () => {
        fail("Debería haber fallado con un error");
      },
      error: (error) => {
        errorMessage = error.message;
      },
    });

    const getReq = httpMock.expectOne("assets/data/data.json");
    expect(getReq.request.method).toBe("GET");
    getReq.flush(mockHeroes);

    tick();

    expect(errorMessage).toContain("no encontrado");
  }));

  it("debería eliminar un héroe", fakeAsync(() => {
    service.deleteHero(1).subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("DELETE");
    req.flush(null);

    tick(1000);
  }));

  it("debería obtener un héroe por su ID", fakeAsync(() => {
    service.getHeroById(1).subscribe((hero) => {
      expect(hero).toBeDefined();
      expect(hero?.id).toBe(1);
      expect(hero?.name).toBe("Spiderman");
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("GET");
    req.flush(mockHeroes);

    tick();
  }));

  it("debería devolver undefined al buscar un héroe inexistente", fakeAsync(() => {
    service.getHeroById(999).subscribe((hero) => {
      expect(hero).toBeUndefined();
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("GET");
    req.flush(mockHeroes);

    tick();
  }));

  it("debería paginar correctamente los resultados", fakeAsync(() => {
    service.getHeroes(1, 2).subscribe((result) => {
      expect(result.heroes.length).toBe(2);
      expect(result.heroes[0].id).toBe(1);
      expect(result.heroes[1].id).toBe(2);
      expect(result.total).toBe(15);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(8);
    });

    const req1 = httpMock.expectOne("assets/data/data.json");
    req1.flush(mockHeroes);
    tick();

    service.getHeroes(2, 2).subscribe((result) => {
      expect(result.heroes.length).toBe(2);
      expect(result.heroes[0].id).toBe(3);
      expect(result.heroes[1].id).toBe(4);
      expect(result.currentPage).toBe(2);
    });

    const req2 = httpMock.expectOne("assets/data/data.json");
    req2.flush(mockHeroes);
    tick();

    service.getHeroes(3, 2).subscribe((result) => {
      expect(result.heroes.length).toBe(2);
      expect(result.heroes[0].id).toBe(5);
      expect(result.heroes[1].id).toBe(6);
      expect(result.currentPage).toBe(3);
    });

    const req3 = httpMock.expectOne("assets/data/data.json");
    req3.flush(mockHeroes);
    tick();
  }));

  it("debería encontrar múltiples héroes con coincidencias parciales", fakeAsync(() => {
    service.searchHeroes("man", 1, 10).subscribe((result) => {
      expect(result.heroes.length).toBe(6);
      expect(result.total).toBe(6);

      const heroNames = result.heroes.map((hero) => hero.name);
      expect(heroNames).toContain("Spiderman");
      expect(heroNames).toContain("Batman");
      expect(heroNames).toContain("Superman");
      expect(heroNames).toContain("Wonder Woman");
      expect(heroNames).toContain("Iron Man");
      expect(heroNames).toContain("Aquaman");
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("GET");
    req.flush(mockHeroes);

    tick();
  }));

  it("debería manejar errores HTTP al cargar héroes", fakeAsync(() => {
    let errorMessage: string | undefined;

    service.getHeroes().subscribe({
      next: () => fail("Debería haber fallado con un error"),
      error: (error) => {
        errorMessage = error.message;
      },
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("GET");

    req.flush("Error 404: Not Found", {
      status: 404,
      statusText: "Not Found",
    });

    tick();

    expect(errorMessage).toBeDefined();
    expect(errorMessage).toContain("404");
  }));

  it("debería manejar errores HTTP al buscar héroes", fakeAsync(() => {
    let errorMessage: string | undefined;

    service.searchHeroes("Superman").subscribe({
      next: () => fail("Debería haber fallado con un error"),
      error: (error) => {
        errorMessage = error.message;
      },
    });

    const req = httpMock.expectOne("assets/data/data.json");
    expect(req.request.method).toBe("GET");

    req.flush("Error 500: Server Error", {
      status: 500,
      statusText: "Server Error",
    });

    tick();

    expect(errorMessage).toBeDefined();
    expect(errorMessage).toContain("500");
  }));
});
