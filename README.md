# 📋 GestorDeTareas

## NOMBRE DE LA APP
**GestorDeTareas** - Aplicación móvil para la gestión de tareas personales, con autenticación de usuario, modo oscuro y persistencia local.

---

## VERSIONADO DE LA APP
- **Versión Actual:** 1.0.0
- **Estado:** Estable
- **Última Actualización:** 2024

---

## COMANDOS INICIALES PARA LEVANTAR EL PROYECTO

### Requisitos Previos
- Node.js (v18 o superior recomendado)
- npm
- Expo CLI (se ejecuta con `npx`, no requiere instalación global)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/zasesinox242/GestorDeTareas.git
cd GestorDeTareas

# Instalar dependencias
npm install
```

### Ejecutar la Aplicación
```bash
# Sin túnel (conexión local, misma red WiFi)
npx expo start

# Con túnel (para acceso remoto o redes restringidas)
npx expo start --tunnel
```

Una vez ejecutado el comando, escanea el código QR con la app **Expo Go** en tu dispositivo móvil (Android/iOS).

También puedes usar:
```bash
npm run android   # Abrir directamente en emulador/dispositivo Android
npm run ios       # Abrir directamente en simulador iOS
npm run web       # Abrir en el navegador
```

---

## ESTRUCTURA DEL PROYECTO

```
GestorDeTareas/
├── App.tsx                          # Punto de entrada: envuelve la app con los providers y la navegación
├── index.ts                         # Registro de la app para Expo
├── app.json                         # Configuración de Expo (nombre, íconos, splash, etc.)
├── package.json                     # Dependencias y scripts del proyecto
├── tsconfig.json                    # Configuración de TypeScript
└── src/
    ├── assets/                      # Recursos estáticos (íconos, splash screen)
    │
    ├── components/                  # Componentes reutilizables de UI
    │   ├── BackButton.component.tsx
    │   ├── BottomNavBar.component.tsx
    │   ├── FabButton.component.tsx
    │   ├── PrimaryButton.component.tsx
    │   ├── ScreenHeader.component.tsx
    │   └── TaskCard.component.tsx
    │
    ├── context/                      # Contextos globales de la app (React Context API)
    │   ├── AuthContext.tsx          # Estado de sesión: login, registro, logout, cambio de contraseña
    │   └── TasksContext.tsx         # Estado global de las tareas (CRUD compartido entre pantallas)
    │
    ├── data/
    │   └── sampleTasks.ts           # Datos de ejemplo/semilla usados al iniciar la app
    │
    ├── models/                       # Interfaces TypeScript que definen las entidades
    │   ├── Task.ts                  # Estructura de una tarea
    │   └── User.ts                  # Estructura de un usuario
    │
    ├── navigation/                   # Configuración de la navegación (React Navigation)
    │   ├── RootNavigator.tsx        # Stack principal: Login, Register, MainTabs, CreateTask, EditTask, ChangePassword
    │   ├── MainTabs.tsx              # Navegación por pestañas inferiores (tareas / ajustes)
    │   ├── CustomTabBar.tsx          # Barra de pestañas personalizada
    │   └── types.ts                  # Tipos centralizados de las rutas (RootStackParamList, MainTabsParamList)
    │
    ├── screens/                       # Pantallas completas de la aplicación
    │   ├── Login.screen.tsx
    │   ├── RegisterScreen.tsx
    │   ├── Home.screen.tsx           # Listado principal de tareas
    │   ├── CreateTask.screen.tsx
    │   ├── EditTask.screen.tsx
    │   ├── Settings.screen.tsx
    │   └── ChangePassword.screen.tsx
    │
    ├── services/                      # Lógica de negocio y acceso a datos (AsyncStorage)
    │   ├── authService.ts            # Validación de credenciales, registro, cambio de contraseña
    │   ├── taskService.ts             # Operaciones CRUD de tareas sobre AsyncStorage
    │   └── storageKeys.ts             # Claves usadas para guardar datos en AsyncStorage
    │
    └── theme/                         # Estilos y tema visual de la app
        ├── ThemeContext.tsx           # Provider de modo claro/oscuro, consumido también por React Navigation
        └── colors.ts                  # Paleta de colores de la app
```

### Descripción de Carpetas

- **assets/** — Íconos de la app, ícono adaptativo (Android) y splash screen, usados en `app.json`.
- **components/** — Piezas de interfaz reutilizables (botones, tarjeta de tarea, header, barra inferior) usadas en varias pantallas para evitar duplicar código.
- **context/** — Estado global de la app mediante React Context. `AuthContext` maneja la sesión del usuario (login, registro, logout, cambio de contraseña) y `TasksContext` centraliza las tareas para que cualquier pantalla pueda leerlas/actualizarlas sin pasar props manualmente.
- **data/** — Datos de ejemplo (`sampleTasks.ts`) usados para poblar la app en desarrollo o como estado inicial.
- **models/** — Interfaces de TypeScript (`Task`, `User`) que definen la forma de los datos en toda la app, garantizando tipado consistente.
- **navigation/** — Toda la configuración de rutas con **React Navigation**: el stack raíz (`RootNavigator`), la navegación por pestañas (`MainTabs` + `CustomTabBar`) y los tipos de parámetros de cada ruta (`types.ts`) para tener autocompletado al navegar.
- **screens/** — Cada archivo es una pantalla completa: login, registro, listado de tareas, crear/editar tarea, ajustes y cambio de contraseña.
- **services/** — Funciones que hablan directamente con `AsyncStorage`: autenticación (`authService`), CRUD de tareas (`taskService`) y las claves de almacenamiento centralizadas (`storageKeys`) para no repetir strings sueltos.
- **theme/** — Define la paleta de colores (`colors.ts`) y el `ThemeContext`, que controla el modo claro/oscuro y se sincroniza también con los colores de React Navigation (fondo, texto, bordes) en `App.tsx`.

---

## LIBRERÍAS QUE ESTÁN UTILIZANDO Y PORQUÉ

| Librería | Versión | Propósito |
|----------|---------|----------|
| **expo** | ~54.0.34 | Plataforma base para desarrollar, compilar y ejecutar la app sin configurar nativamente Android/iOS |
| **react** | 19.1.0 | Librería de UI basada en componentes y hooks |
| **react-native** | 0.81.5 | Framework para construir la interfaz nativa multiplataforma |
| **@react-navigation/native** | ^7.3.8 | Motor base de navegación entre pantallas |
| **@react-navigation/native-stack** | ^7.17.10 | Navegación tipo stack (Login → MainTabs → CreateTask, etc.) |
| **@react-navigation/bottom-tabs** | ^7.18.8 | Navegación por pestañas inferiores (Tareas / Ajustes) |
| **@react-native-async-storage/async-storage** | 2.2.0 | Persistencia local de usuarios y tareas en el dispositivo |
| **react-native-safe-area-context** | ~5.6.0 | Manejo correcto de áreas seguras (notch, barras del sistema) |
| **react-native-screens** | ~4.16.0 | Optimiza el rendimiento de las pantallas nativas usadas por React Navigation |
| **expo-status-bar** | ~3.0.9 | Control del estilo de la barra de estado (clara/oscura) según el tema |
| **typescript** | ~5.9.2 | Tipado estático para todo el proyecto |

### Justificación de Tecnologías

- **Expo:** permite levantar el proyecto y probarlo en un dispositivo real con Expo Go en minutos, sin necesidad de Android Studio ni Xcode.
- **React Navigation (stack + bottom-tabs):** se usa para separar el flujo de autenticación (Login/Registro) del flujo principal de la app (Tareas/Ajustes con pestañas), tal como se ve en `RootNavigator.tsx` y `MainTabs.tsx`.
- **AsyncStorage:** al no haber backend, es la solución oficial y más simple para persistir usuarios y tareas directamente en el dispositivo.
- **Context API (Auth, Tasks, Theme):** evita el "prop drilling" y centraliza tres responsabilidades claras: sesión, datos de tareas y tema visual, cada una en su propio contexto.
- **TypeScript:** los `models/` (`Task`, `User`) y `navigation/types.ts` garantizan que la data y las rutas estén correctamente tipadas en toda la app.

---

## INTEGRANTES DEL GRUPO

- **Daybreak Villarroel**
- **Abigail Solis**
- **Renato Aurora**
- **Junior Carrion**

---

## FUNCIONALIDADES PRINCIPALES

✅ **Autenticación de Usuario**
- Login, registro y cambio de contraseña (`AuthContext` + `authService`)

✅ **CRUD Completo de Tareas**
- Crear, editar, listar y eliminar tareas (`TasksContext` + `taskService`)

✅ **Modo Oscuro**
- Tema claro/oscuro sincronizado con React Navigation (`ThemeContext`)

✅ **Persistencia Local**
- Usuarios y tareas guardados con AsyncStorage

✅ **Navegación por Pestañas**
- Barra inferior personalizada entre Tareas y Ajustes

✅ **TypeScript**
- Tipado seguro en modelos, contextos y rutas de navegación

---

## NOTAS DE DESARROLLO

- El proyecto sigue las mejores prácticas enseñadas en el curso.
- No se utilizan librerías externas no cubiertas en clase.
- La estructura está organizada por responsabilidad (componentes, contexto, navegación, servicios, modelos, etc).
- Se recomienda usar Expo Go para pruebas rápidas durante el desarrollo.

---

## LICENCIA
Este proyecto es académico y está disponible para propósitos educativos.

---

**¿Preguntas?** Consulta la documentación de [Expo](https://docs.expo.dev/) y [React Navigation](https://reactnavigation.org/)
