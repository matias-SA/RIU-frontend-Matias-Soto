# RIUFrontendMatiasSoto

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 18.2.14.

## Requisitos Previos

- Node.js (versión 20 o superior)
- Angular CLI
- Docker y Docker Compose (opcional, para ejecutar con Docker)

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd RIU-frontend-Matias-Soto
```

2. Instalar dependencias:
```bash
npm install
```

## Ejecutar el Proyecto

### Opción 1: Desarrollo Local

1. Iniciar el servidor de desarrollo:
```bash
ng serve
```

2. Navegar a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

### Opción 2: Usando Docker

1. Construir la imagen Docker:
```bash
docker compose build
```

2. Iniciar la aplicación:
```bash
docker compose up -d
```

3. Navegar a `http://localhost` para ver la aplicación.

4. Para detener la aplicación:
```bash
docker compose down
```

## Comandos Útiles

### Desarrollo Local
- `ng serve`: Iniciar servidor de desarrollo
- `ng build`: Construir el proyecto
- `ng test`: Ejecutar pruebas unitarias
- `ng e2e`: Ejecutar pruebas end-to-end

### Docker
- `docker compose ps`: Ver estado de los contenedores
- `docker compose logs -f`: Ver logs en tiempo real
- `docker compose restart`: Reiniciar la aplicación
- `docker stats`: Monitorear uso de recursos

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/           # Servicios, interceptores, guards
│   ├── pages/          # Componentes de páginas
│   └── shared/         # Componentes, directivas y pipes compartidos
├── assets/            # Recursos estáticos
└── environments/      # Configuraciones de entorno
```

## Tecnologías Utilizadas

- Angular 18
- Angular Material
- RxJS
- Docker
- Nginx

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Construye el proyecto para producción
- `npm test`: Ejecuta las pruebas unitarias
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código

## Ayuda Adicional

Para obtener más ayuda sobre Angular CLI usa `ng help` o visita la [página de documentación de Angular CLI](https://angular.dev/tools/cli).
