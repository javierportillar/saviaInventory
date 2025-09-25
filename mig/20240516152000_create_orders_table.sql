/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `numero` (integer)
      - `total` (numeric)
      - `estado` (text)
      - `timestamp` (timestamp)
      - `cliente_id` (uuid, foreign key to customers.id, nullable)
      - `metodoPago` (text, nullable)
  2. Security
    - Enable RLS on `orders` table
    - Add policy for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero integer NOT NULL,
  total numeric NOT NULL,
  estado text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  cliente_id uuid NULL REFERENCES customers(id),
  metodoPago text NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform CRUD operations"
  ON orders
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);