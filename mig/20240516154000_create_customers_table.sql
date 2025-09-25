/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `nombre` (text)
      - `telefono` (text)
  2. Security
    - Enable RLS on `customers` table
    - Add policy for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  telefono text NOT NULL
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform CRUD operations"
  ON customers
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);