/*
  # Crear tabla de empleados

  1. Nueva tabla
    - `empleados`
      - `id` (uuid, primary key)
      - `nombre` (text)
      - `telefono` (text, opcional)
      - `email` (text, opcional)
      - `horas_dia` (integer, horas por día)
      - `dias_semana` (integer, días por semana)
      - `salario_hora` (numeric, salario por hora)
      - `activo` (boolean, si está activo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en tabla `empleados`
    - Agregar políticas para usuarios autenticados
*/

CREATE TABLE IF NOT EXISTS empleados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  telefono text,
  email text,
  horas_dia integer DEFAULT 8,
  dias_semana integer DEFAULT 5,
  salario_hora numeric DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver empleados"
  ON empleados
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar empleados"
  ON empleados
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar empleados"
  ON empleados
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden eliminar empleados"
  ON empleados
  FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER update_empleados_updated_at
  BEFORE UPDATE ON empleados
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();