# GestorDeTareas

Aplicación móvil académica para gestionar tareas personales. Usa Expo Router, TypeScript,
Firebase Authentication para las cuentas y AsyncStorage para la persistencia local de tareas.

## Integrantes

- Daybreak Villarroel
- Abigail Solis
- Renato Aurora
- Junior Carrion

## Funcionalidades actuales

- Registro e inicio de sesión con correo y contraseña mediante Firebase Authentication.
- Acceso con Google en Android/iOS mediante una compilación de desarrollo y en la versión web.
- Restauración automática de la sesión al volver a abrir la app.
- Perfil con foto, nombre, correo y método de acceso en la pestaña Ajustes.
- Creación, consulta, edición y eliminación de tareas.
- Imagen opcional por tarea, subida a Firebase Storage (`tasks/{uid}/...`) y visible en el detalle.
- Separación local de tareas por identificador de usuario.
- Tema claro y oscuro.
- Rutas protegidas con Expo Router.

## Requisitos

- Node.js 20 o superior.
- npm.
- Expo Go para probar correo/contraseña.
- Una compilación de desarrollo para probar Google en Android/iOS.
- Un proyecto propio en Firebase.

## Instalación

```bash
git clone https://github.com/zasesinox242/GestorDeTareas.git
cd GestorDeTareas
npm install
```

## Configuración de Firebase Authentication

1. Abre [Firebase Console](https://console.firebase.google.com/) y crea un proyecto.
2. En **Authentication → Sign-in method**, habilita **Correo electrónico/Contraseña** y
   **Google**.
3. En **Configuración del proyecto → Tus apps**, registra una app **Web**.
4. Copia `.env.example` como `.env`.
5. Completa las variables con la configuración de la app Web que entrega Firebase.

En macOS o Linux:

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Contenido esperado:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=....apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=....apps.googleusercontent.com
```

El archivo `.env` no se confirma en Git. Reinicia Expo después de modificarlo. La configuración
pública de Firebase identifica el proyecto; la autorización real debe controlarse mediante
Firebase Authentication y las reglas de cada servicio.

### Configuración de Google en Android

1. En Firebase, registra una app Android con el package
   `com.zasesinox242.gestordetareas`.
2. Agrega la huella SHA-1 de la firma de desarrollo. Para entregas o publicación agrega también
   las huellas de EAS/Play App Signing.
3. En Google Cloud/Firebase, identifica el cliente OAuth de tipo **Web** y copia su Client ID en
   `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
4. Vuelve a generar la compilación de desarrollo después de cambiar la configuración nativa.

Android usa el Web Client ID de forma explícita, por lo que este avance no requiere confirmar un
`google-services.json`. El package y la huella SHA deben coincidir con el cliente Android creado
en Firebase.

### Configuración de Google en iOS

Registra una app iOS con el bundle ID `com.zasesinox242.gestordetareas` y copia su Client ID en
`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`. `app.config.ts` deriva el URL scheme requerido y activa el
plugin nativo al crear la compilación.

> Google no funciona dentro de Expo Go porque necesita código nativo. El botón informa esta
> condición sin impedir que correo/contraseña continúe funcionando.

## Ejecutar la aplicación

Para probar registro e inicio de sesión por correo dentro de Expo Go:

```bash
npm install
npx expo start --go
```

Comandos alternativos:

```bash
npm run android
npm run ios
npm run web
npm run typecheck
```

Para redes donde el dispositivo no puede alcanzar directamente la computadora:

```bash
npx expo start --tunnel
```

## Generar un instalable

Para crear e instalar una compilación de desarrollo compatible con Google:

```bash
npx expo run:android
```

Después de instalarla una vez, las siguientes sesiones pueden iniciarse con:

```bash
npx expo start --dev-client
```

## Estructura

```text
GestorDeTareas/
├── app.config.ts                    # Configuración condicional de Google para iOS
├── app.json                         # Configuración de Expo
├── package.json                     # Scripts y dependencias
├── .env.example                     # Plantilla de configuración Firebase
└── src/
    ├── app/                         # Rutas de Expo Router
    │   ├── _layout.tsx              # Providers y navegación raíz
    │   ├── index.tsx                # Entrada e inicio de sesión
    │   ├── register.tsx             # Registro
    │   └── (tabs)/                  # Tareas y Ajustes
    ├── config/
    │   ├── firebase/                # App, Auth y persistencia por plataforma
    │   └── theme/                   # Paletas, textos y sombras
    ├── core/                        # Componentes, contextos y utilidades comunes
    └── modules/
        ├── Auth/                    # Domain, data, DI y presentation de cuentas
        └── Tasks/                   # Domain, data, DI y presentation de tareas
```

El proyecto conserva la separación por capas:

```text
presentation → use-cases → repositories → data-sources
```

La implementación `AuthFirebaseDataSourceImpl` reemplaza el almacenamiento local de usuarios sin
cambiar los contratos del dominio. Firebase mantiene la sesión con AsyncStorage en Android/iOS y
el contexto escucha `onAuthStateChanged` para reconstruir el perfil.

## Dependencias principales

| Librería | Versión | Uso |
|---|---:|---|
| Expo | ~54.0.34 | Runtime, desarrollo y builds |
| Expo Router | ~6.0.24 | Navegación basada en archivos |
| React Native | 0.81.5 | Interfaz móvil |
| Firebase | ^12.17.1 | Autenticación, sesión y almacenamiento de imágenes (Storage) |
| Expo Image Picker | ~17.0.11 | Selección de imágenes de la galería para adjuntarlas a una tarea |
| React Native Nitro Google Sign-In | ^1.3.0 | Cuenta Google mediante APIs nativas modernas |
| React Native Nitro Modules | ^0.36.5 | Puente nativo requerido por Google Sign-In |
| Expo Dev Client | ~6.0.21 | Pruebas de módulos nativos fuera de Expo Go |
| AsyncStorage | 2.2.0 | Persistencia de Firebase en React Native y tareas locales |
| TypeScript | ~5.9.2 | Tipado estático |

## Alcance de esta integración

Esta etapa modifica únicamente autenticación y perfil. Las tareas continúan usando su data source
local; SQLite y Firestore quedan fuera de este avance para no mezclar el trabajo asignado a los
siguientes integrantes. Como excepción, las tareas ahora pueden tener una imagen opcional
(`imagenUrl`) subida a Firebase Storage: requiere haber habilitado Storage en modo producción con
las reglas de `storage.rules` y completar `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` en `.env`.
