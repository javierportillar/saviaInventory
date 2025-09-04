/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `numero` (integer, not null)
      - `total` (numeric, not null)
      - `estado` (text, not null)
      - `timestamp` (timestamp, not null)
      - `cliente_id` (uuid, foreign key to customers.id)
      - `metodoPago` (text)
  2. Security
    - Enable RLS on `orders` table
    - Add policy for authenticated users to perform all actions
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero integer NOT NULL,
  total numeric NOT NULL,
  estado text NOT NULL,
  "timestamp" timestamp NOT NULL,
  cliente_id uuid REFERENCES customers(id),
  metodoPago text
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions"
  ON orders
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);