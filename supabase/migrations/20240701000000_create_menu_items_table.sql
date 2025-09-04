/*
  # Create menu_items table

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key)
      - `nombre` (text, not null)
      - `precio` (numeric, not null)
      - `descripcion` (text)
      - `keywords` (text)
      - `categoria` (text, not null)
      - `stock` (integer, not null)
      - `inventarioCategoria` (text, not null)
      - `inventarioTipo` (text)
      - `unidadMedida` (text)
  2. Security
    - Enable RLS on `menu_items` table
    - Add policy for authenticated users to perform all actions
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  precio numeric NOT NULL,
  descripcion text,
  keywords text,
  categoria text NOT NULL,
  stock integer NOT NULL,
  inventarioCategoria text NOT NULL,
  inventarioTipo text,
  unidadMedida text
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);