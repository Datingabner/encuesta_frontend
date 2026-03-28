# Sistema de Encuestas de Evaluación Psicosocial

Frontend de una aplicación web para la gestión y respuesta de encuestas de evaluación de riesgos psicosociales en el trabajo. Permite a los empleados completar encuestas de forma segura y a los administradores (RRHH) visualizar resultados y estadísticas.

## Características

### Para Empleados
- **Autenticación segura**: Inicio de sesión con número de empleado
- **Dashboard personal**: Visualización del estado de todas las encuestas asignadas
- **Encuestas interactivas**: Formularios con preguntas tipo Likert, respuestas abiertas y opción múltiple
- **Seguimiento de progreso**: Control del estado de cada encuesta (pendiente, en progreso, completada)
- **Cálculo automático de riesgo**: Interpretación de resultados basada en puntajes

### Para Administradores (RRHH)
- **Panel de administración**: Acceso seguro con API Key
- **Resultados detallados**: Visualización de respuestas de cada empleado
- **Estadísticas globales**: Distribución de riesgo, promedio de puntajes, total de encuestas completadas
- **Gestión de empleados**: CRUD completo (crear, leer, actualizar, desactivar empleados)
- **Exportación de datos**: Información estructurada para análisis

## Requisitos Previos

- **Node.js** versión 18 o superior
- **npm** versión 9 o superior (o yarn/pnpm)
- **Backend API**: Este frontend requiere un backend compatible (ver [encuesta_backend](https://github.com/tu-backend))

## Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd encuesta_frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env
```

Edita el archivo `.env` con la URL de tu backend:

```env
VITE_API_URL=https://tu-backend-production.onrender.com/api
```

## Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base del backend API | `https://encuesta-backend-dkqg.onrender.com/api` |

### Estructura del Proyecto

```
encuesta_frontend/
├── public/                  # Archivos estáticos públicos
├── src/
│   ├── components/          # Componentes reutilizables
│   │   └── ui/              # Componentes de interfaz de usuario
│   ├── context/             # Contextos de React (Auth, AdminAuth)
│   ├── lib/                 # Configuración de axios y utilidades
│   ├── pages/               # Páginas principales de la app
│   │   ├── Login.tsx        # Página de login de empleados
│   │   ├── Dashboard.tsx    # Dashboard del empleado
│   │   ├── Survey.tsx       # Página de respuesta de encuestas
│   │   ├── Progress.tsx     # Página de progreso del empleado
│   │   ├── AdminLogin.tsx   # Login de administradores
│   │   └── AdminDashboard.tsx # Panel de administración
│   ├── services/            # Servicios API
│   ├── types/               # Definiciones de tipos TypeScript
│   ├── utils/               # Funciones utilitarias
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Punto de entrada
├── .env.example             # Ejemplo de variables de entorno
├── package.json             # Dependencias y scripts
├── vite.config.ts           # Configuración de Vite
├── tsconfig.json            # Configuración de TypeScript
└── vercel.json              # Configuración de despliegue Vercel
```

## Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## Despliegue a Producción

### Opción 1: Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en el panel de Vercel:
   - `VITE_API_URL`: URL del backend en producción
3. El archivo `vercel.json` ya está configurado para manejar rutas SPA

### Opción 2: Netlify

1. Configura el comando de build: `npm run build`
2. Configura el directorio de salida: `dist`
3. Añade las variables de entorno necesarias

### Opción 3: Servidor Propio (Nginx/Apache)

1. Construye el proyecto:
```bash
npm run build
```

2. Los archivos generados estarán en la carpeta `dist/`
3. Configura tu servidor web para servir los archivos estáticos y redirigir todas las rutas a `index.html` (necesario para SPA)

#### Ejemplo Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/encuesta_frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cacheo de archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool y servidor de desarrollo
- **Tailwind CSS 4** - Framework de estilos
- **React Router DOM 7** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Hook Form** - Gestión de formularios
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

## Endpoints de API Esperados

El frontend espera que el backend proporcione los siguientes endpoints:

### Autenticación
- `POST /api/auth/validar-empleado` - Validar empleado por número

### Encuestas
- `GET /api/encuestas/:id` - Obtener encuesta por ID
- `POST /api/encuestas/:id/submit` - Enviar respuestas de encuesta

### Empleado
- `GET /api/empleado/progress` - Obtener progreso del empleado

### Administración
- `POST /api/admin/validate-key` - Validar API Key de admin
- `GET /api/admin/results` - Obtener resultados (requiere header x-api-key)

### Gestión de Empleados (Admin)
- `GET /api/empleados` - Listar todos los empleados (soporta filtros `?activo=true`, `?departamento=1`, `?search=texto`)
- `POST /api/empleados` - Crear nuevo empleado
- `GET /api/empleados/<id>` - Obtener empleado por ID
- `PUT /api/empleados/<id>` - Actualizar empleado completo
- `PATCH /api/empleados/<id>` - Actualizar empleado parcialmente
- `DELETE /api/empleados/<id>` - Desactivar empleado (soft delete)

## Autenticación

### Empleados
- El token JWT se almacena en `localStorage`
- Se incluye en el header `Authorization: Bearer <token>`

### Administradores
- La API Key se almacena en `sessionStorage`
- Se envía en el header `x-api-key`

## Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

MIT License - Ver archivo LICENSE para más detalles.

## Soporte

Para problemas o preguntas:
- Abre un issue en el repositorio
- Contacta al equipo de desarrollo

---

Desarrollado con ❤️ para la evaluación de riesgos psicosociales laborales
