# GestorDeTareas

Aplicación móvil de gestión de tareas construida con React Native (Expo), con persistencia
local en SQLite y sincronización en la nube con Firebase (Authentication, Firestore y Storage).

## Integrantes

- Daybreak Villarroel
- Abigail Solis
- Renato Aurora
- Junior Carrion

---

## 1. Configuración del entorno

### Requisitos previos

- Node.js 20 o superior y npm.
- Android Studio con Android SDK instalado (necesario para compilar la app nativa).
- Variable de entorno `ANDROID_HOME` apuntando a la carpeta del SDK.
- JDK 17 instalado. Si el sistema tiene otra versión de Java por defecto, fuerza JDK 17
  agregando esta línea a `android/gradle.properties` (ruta según tu instalación):
```properties
  org.gradle.java.home=C:\\Program Files\\Microsoft\\jdk-17.x.x.x-hotspot
```
- Un dispositivo Android físico (con **Depuración USB** activada) o un emulador de Android
  Studio.
- Cuenta de Expo y `eas-cli` instalado globalmente (para generar el APK):
```bash
  npm install -g eas-cli
  eas login
```

> Google Sign-In, Firestore y SQLite requieren una compilación de desarrollo nativa — **no
> funcionan dentro de Expo Go**.

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

**Firestore** (Firestore Database → Reglas):
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

**Storage**: publica el contenido de `storage.rules` (incluido en este repositorio) en
Storage → Reglas.

---

## 3. Pasos para ejecutar y generar el APK

### 3.1 Ejecutar en modo desarrollo

Con un dispositivo conectado por USB (o un emulador activo):

```bash
npx expo run:android
```

Este comando compila la app nativa (incluye Firebase, SQLite y Google Sign-In) y la instala en
el dispositivo. Solo es necesario correrlo de nuevo si cambias dependencias nativas.

Para las siguientes sesiones, con la app ya instalada, basta con levantar el servidor:

```bash
npx expo start --dev-client
```

Si el dispositivo y la computadora no están en la misma red:

```bash
npx expo start --dev-client --tunnel
```

### 3.2 Generar el APK instalable

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

Al finalizar el build (5-15 minutos), la terminal entrega un enlace de descarga directo; también
queda disponible en [expo.dev](https://expo.dev) → tu proyecto → **Builds**.