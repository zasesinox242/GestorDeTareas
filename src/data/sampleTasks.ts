import { Task } from '../models/Task';

// Datos de ejemplo en memoria, usados únicamente como "semilla" la primera
// vez que un usuario entra a la app (no existen tareas guardadas todavía).
// Vivían antes dentro de Home.screen.tsx; se separaron para no mezclar
// datos de demostración con la lógica visual de la pantalla.
export const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Comprar víveres',
    description: 'Ir al mercado y comprar frutas, verduras y pan.',
    status: 'PENDIENTE',
    priority: 'MEDIA',
  },
  {
    id: '2',
    title: 'Entregar informe de sprint',
    description: 'Terminar el documento y subirlo al repositorio.',
    status: 'PENDIENTE',
    priority: 'ALTA',
  },
];
