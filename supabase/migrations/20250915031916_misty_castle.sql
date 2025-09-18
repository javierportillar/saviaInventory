/*
  # Crear tabla de gastos

  1. Nueva tabla
    - `gastos`
      - `id` (uuid, primary key)
      - `descripcion` (text)
      - `monto` (numeric)
      - `categoria` (text)
      - `fecha` (date)
      - `created_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en tabla `gastos`
    - Agregar políticas para usuarios autenticados
*/

CREATE TABLE IF NOT EXISTS gastos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  monto numeric NOT NULL,
  categoria text NOT NULL,
  fecha date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver gastos"
  ON gastos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar gastos"
  ON gastos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar gastos"
  ON gastos
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden eliminar gastos"
  ON gastos
  FOR DELETE
  TO authenticated
  USING (true);