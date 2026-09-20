# TareaX

Gestor de tareas para Android construido con **React Native + Expo**, con persistencia local
offline-first en **SQLite** y sincronización en la nube con **Firebase** (Authentication,
Firestore y Storage). Pensado para no depender de conexión constante: la app funciona con la
base local y sincroniza en segundo plano cuando hay internet.

![Expo SDK 54](https://img.shields.io/badge/Expo%20SDK-54-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Storage-FFCA28?logo=firebase&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-offline--first-07405E?logo=sqlite&logoColor=white)
![Reanimated](https://img.shields.io/badge/Reanimated-4-FF6B6B)

📱 **[Descargar el APK](https://github.com/zasesinox242/GestorDeTareas/releases/download/v1.0.0/application-5b9aa227-aae8-4a80-980f-27b2f68a16a5.apk)** · [Ver todos los releases](https://github.com/zasesinox242/GestorDeTareas/releases)

---

## Capturas

<!--
  Reemplaza estos 4 placeholders por capturas reales de la app ya instalada
  (con el ícono y nombre "TareaX" actuales). Guárdalas en docs/screenshots/
  con estos nombres exactos, o cambia las rutas de abajo si usas otros.
-->

| Login | Lista de tareas | Detalle | Crear tarea |
|---|---|---|---|
| ![Login](docs/screenshots/login.png) | ![Lista](docs/screenshots/lista.png) | ![Detalle](docs/screenshots/detalle.png) | ![Crear tarea](docs/screenshots/crear.png) |

## Funcionalidades

- **Autenticación**: correo/contraseña y Google Sign-In, con Firebase Authentication.
- **Tareas**: crear, editar, completar, eliminar, prioridad (baja/media/alta), imagen adjunta,
  y fecha/hora límite opcional.
- **Recordatorios reales**: notificación local programada automáticamente para la fecha límite
  de cada tarea; se cancela sola si la tarea se completa o se borra, y se reprograma si cambia
  la fecha.
- **Offline-first**: SQLite como fuente de verdad local; las tareas se crean y editan sin
  conexión y se sincronizan con Firestore y Storage en segundo plano.
- **Seguridad de datos**: reglas de Firestore y Storage que restringen cada tarea a su propio
  dueño (`ownerId`), validado en el servidor, no solo en el cliente.
- **Animaciones e interacción**: entrada escalonada de las tarjetas, swipe para eliminar,
  check animado al completar, barra de progreso, celebración al terminar todas las tareas del
  día, pantalla de bienvenida animada, haptic feedback en las acciones principales.
- **Feedback propio**: sistema de notificaciones "toast" y modales de confirmación con la
  paleta de la app, en vez de las alertas nativas del sistema operativo.
- **Modo claro/oscuro.**

## Arquitectura

Clean Architecture por módulos, separando claramente UI, lógica de negocio y acceso a datos:

```
src/
├── app/                    # Rutas (Expo Router, file-based)
├── config/
│   ├── firebase/           # Inicialización de Firebase (auth, firestore, storage)
│   └── database/           # Migraciones de SQLite
├── core/                   # Componentes, contexts y servicios compartidos
│   ├── components/         # Botones, inputs, AppSplash, etc.
│   ├── contexts/           # Theme, Toast, Confirm
│   └── services/           # Notificaciones locales
└── modules/
    ├── Auth/
    │   ├── domain/          # Entidades y casos de uso (independientes de Firebase)
    │   ├── data/            # Implementación con Firebase Auth + Google Sign-In
    │   ├── presentation/    # Pantallas y hooks
    │   └── di/              # Inyección de dependencias del módulo
    └── Tasks/
        ├── domain/          # TaskEntity, casos de uso (getTasks, createTask, ...)
        ├── data/            # SQLite (fuente local) + Firestore (respaldo/sync)
        ├── presentation/    # Pantallas, hooks y componentes
        └── di/
```

Cada módulo depende de sus propias interfaces de dominio, no directamente de Firebase o
SQLite — eso es lo que permite que, por ejemplo, `Tasks` sincronice con la nube sin que la
capa de presentación sepa nada de Firestore.

## Stack técnico

| Categoría | Tecnología |
|---|---|
| Framework | React Native · Expo SDK 54 · Expo Router |
| Lenguaje | TypeScript |
| Backend | Firebase (Authentication, Firestore, Storage) |
| Base local | Expo SQLite |
| Animaciones | React Native Reanimated 4 · Gesture Handler |
| Notificaciones | Expo Notifications |
| Build | EAS Build |

## Integrantes

- Daybreak Villarroel
- Abigail Solis
- Renato Aurora
- Junior Carrion

---

# Guía de instalación y desarrollo

> El resto de este documento es para quien quiera correr el proyecto localmente o generar su
> propio build — no es necesario para solo probar la app (usa el APK de arriba para eso).

## 1. Configuración del entorno

### Requisitos previos

- Node.js 20 o superior y npm.
- Android Studio con Android SDK instalado (necesario para compilar la app nativa).
- Variable de entorno `ANDROID_HOME` apuntando a la carpeta del SDK.
- JDK 17 instalado. Si el sistema tiene otra versión de Java por defecto, apunta `JAVA_HOME`
  al JDK 17 (por ejemplo, el que trae Android Studio en `Android Studio/jbr`, o uno instalado
  por separado).
- Un dispositivo Android físico (con **Depuración USB** activada) o un emulador de Android
  Studio.
- Cuenta de Expo y `eas-cli` instalado globalmente (para generar el APK):

```bash
npm install -g eas-cli
eas login
```

> Google Sign-In, Firestore y SQLite requieren una compilación de desarrollo nativa — **no
> funcionan dentro de Expo Go**, solo en un dev client propio o en el APK final.

### Instalación del proyecto

```bash
git clone https://github.com/zasesinox242/GestorDeTareas.git
cd GestorDeTareas
npm install
```

---

## 2. Credenciales de Firebase (variables de entorno)

### 2.1 Crear el proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto.
2. Habilita los siguientes servicios:
   - **Authentication** → Sign-in method → habilita **Correo/Contraseña** y **Google**.
   - **Firestore Database** → crea la base de datos en modo producción.
   - **Storage** → crea el bucket (requiere el proyecto en plan **Blaze**; el uso de un
     proyecto académico se mantiene dentro de la cuota gratuita incluida).
3. En **Configuración del proyecto → Tus apps**, registra una app **Web** y copia su
   configuración (`firebaseConfig`).

### 2.2 Configurar el archivo `.env`

Copia la plantilla:

```bash
cp .env.example .env        # macOS / Linux
Copy-Item .env.example .env # PowerShell
```

Completa `.env` con los valores de tu proyecto de Firebase:

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

El archivo `.env` no se sube al repositorio (está en `.gitignore`). Reinicia el servidor de
Expo después de modificarlo (`npx expo start --clear`).

### 2.3 Configurar Google Sign-In (Android)

1. En Firebase, registra una app **Android** con el package `com.zasesinox242.gestordetareas`.
2. Obtén el SHA-1 de la firma de desarrollo local:

```bash
cd android
./gradlew signingReport
```

3. Registra ese SHA-1 (y, para el APK final, también el SHA-1 del keystore de EAS — ver
   `eas credentials`) como cliente OAuth de tipo **Android** en Google Cloud Console, con el
   mismo package name.
4. Copia el **Client ID de tipo Web** (no el de Android) en `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

### 2.4 Reglas de seguridad

**Firestore** (Firestore Database → Reglas) — ya incluidas en `firestore.rules` en este
repositorio; cada tarea solo puede ser leída/editada/borrada por su propio dueño:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, update, delete: if request.auth != null
        && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.ownerId;
    }
  }
}
```

**Storage**: publica el contenido de `storage.rules` (incluido en este repositorio) en
Storage → Reglas.

---

## 3. Ejecutar en modo desarrollo

Con un dispositivo conectado por USB (o un emulador activo):

```bash
npx expo run:android
```

Este comando compila la app nativa (incluye Firebase, SQLite, Google Sign-In, notificaciones y
animaciones) y la instala en el dispositivo. Solo es necesario correrlo de nuevo si cambias
dependencias nativas.

Para las siguientes sesiones, con la app ya instalada, basta con levantar el servidor:

```bash
npx expo start --dev-client
```

Si el dispositivo y la computadora no están en la misma red:

```bash
npx expo start --dev-client --tunnel
```

## 4. Generar el APK instalable

1. Configura el proyecto para EAS (una sola vez):

```bash
eas build:configure
```

2. Sube las variables del `.env` local al ambiente de build (EAS compila en sus propios
   servidores, no lee el `.env` de tu máquina):

```bash
cp .env .env.local
eas env:push --environment preview
```

3. Genera el instalable:

```bash
eas build --platform android --profile preview
```

El perfil `preview` (definido en `eas.json`) genera un `.apk` firmado, listo para instalar en
cualquier dispositivo Android (activando "orígenes desconocidos"), a diferencia de un `.aab`
que solo sirve para publicar en Play Store.

Al finalizar el build (10-20 minutos), la terminal entrega un enlace de descarga directo; el
archivo también queda disponible en [expo.dev](https://expo.dev) → tu proyecto → **Builds**
(por tiempo limitado). Para un link permanente, súbelo como asset de un
[GitHub Release](https://github.com/zasesinox242/GestorDeTareas/releases) — así es como se
generó el link de descarga de la sección de arriba.
