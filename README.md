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
- Restauración automática de la sesión al volver a abrir la app.
- Perfil con nombre y correo en la pestaña Ajustes.
- Creación, consulta, edición y eliminación de tareas.
- Separación local de tareas por identificador de usuario.
- Tema claro y oscuro.
- Rutas protegidas con Expo Router.

## Requisitos

- Node.js 20 o superior.
- npm.
- Expo Go para probar correo/contraseña en un dispositivo, o un emulador Android/iOS.
- Un proyecto propio en Firebase.

## Instalación

```bash
git clone https://github.com/zasesinox242/GestorDeTareas.git
cd GestorDeTareas
npm install
```

## Configuración de Firebase Authentication

1. Abre [Firebase Console](https://console.firebase.google.com/) y crea un proyecto.
2. En **Authentication → Sign-in method**, habilita **Correo electrónico/Contraseña**.
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
```

El archivo `.env` no se confirma en Git. Reinicia Expo después de modificarlo. La configuración
pública de Firebase identifica el proyecto; la autorización real debe controlarse mediante
Firebase Authentication y las reglas de cada servicio.

## Ejecutar la aplicación

```bash
npm install
npx expo start
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

Para un build local con las herramientas nativas configuradas:

```bash
npx expo run:android
```

Para generar un APK de prueba mediante EAS:

```bash
eas build -p android --profile preview
```

## Estructura

```text
GestorDeTareas/
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
| Firebase | ^12.17.1 | Autenticación y sesión |
| AsyncStorage | 2.2.0 | Persistencia de Firebase en React Native y tareas locales |
| TypeScript | ~5.9.2 | Tipado estático |

## Alcance de esta integración

Esta etapa modifica únicamente autenticación y perfil. Las tareas continúan usando su data source
local; SQLite, Firestore, Storage e imágenes quedan fuera de este avance para no mezclar el trabajo
asignado a los siguientes integrantes.
