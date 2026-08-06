// Paleta de colores de la aplicación.
// Aquí se define TODA la paleta (modo claro y modo oscuro).
// El resto de la app NUNCA debe usar colores "hardcodeados": siempre debe
// consumirlos desde aquí, a través de `useTheme()` (ver ThemeContext.tsx).

export interface AppColors {
  background: string;
  surface: string;
  surfaceAlt: string;

  primary: string;
  primaryDark: string;

  textPrimary: string;
  textSecondary: string;

  border: string;

  navBackground: string;
  navInactive: string;
  navActive: string;

  danger: string;
  warning: string;
  info: string;
}

// Paleta original de la app (modo claro)
export const lightColors: AppColors = {
  background: '#F6F8FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F2F6',

  primary: '#0E9F6E',
  primaryDark: '#0B815A',

  textPrimary: '#1F2430',
  textSecondary: '#7C8493',

  border: '#E5E7EB',

  navBackground: '#1F2430',
  navInactive: '#8A93A6',
  navActive: '#FFFFFF',

  danger: '#F4573D',
  warning: '#F59E0B',
  info: '#3B82F6',
};

// Paleta equivalente para el modo oscuro, manteniendo la identidad visual
// (mismo verde primario) pero con superficies y textos adaptados.
export const darkColors: AppColors = {
  background: '#12141C',
  surface: '#1C2028',
  surfaceAlt: '#242938',

  primary: '#12B981',
  primaryDark: '#0E9F6E',

  textPrimary: '#F2F4F8',
  textSecondary: '#9AA3B5',

  border: '#2E3442',

  navBackground: '#0C0E14',
  navInactive: '#6B7383',
  navActive: '#FFFFFF',

  danger: '#F4573D',
  warning: '#F5A623',
  info: '#5B9BF6',
};

// Se mantiene este export para no romper compatibilidad con código que
// todavía importe `colors` directamente (siempre en su versión clara).
export const colors = lightColors;
