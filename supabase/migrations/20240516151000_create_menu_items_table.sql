/*
  # Create menu_items table

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key)
      - `nombre` (text)
      - `precio` (numeric)
      - `descripcion` (text, nullable)
      - `keywords` (text, nullable)
      - `categoria` (text)
      - `stock` (integer)
      - `inventarioCategoria` (text)
      - `inventarioTipo` (text, nullable)
      - `unidadMedida` (text, nullable)
  2. Security
    - Enable RLS on `menu_items` table
    - Add policy for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  precio numeric NOT NULL,
  descripcion text NULL,
  keywords text NULL,
  categoria text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  inventarioCategoria text NOT NULL,
  inventarioTipo text NULL,
  unidadMedida text NULL
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform CRUD operations"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);