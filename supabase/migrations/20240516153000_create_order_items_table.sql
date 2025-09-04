/*
  # Create order_items table

  1. New Tables
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders.id)
      - `menu_item_id` (uuid, foreign key to menu_items.id)
      - `cantidad` (integer)
      - `notas` (text, nullable)
  2. Security
    - Enable RLS on `order_items` table
    - Add policy for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  cantidad integer NOT NULL,
  notas text NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform CRUD operations"
  ON order_items
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);