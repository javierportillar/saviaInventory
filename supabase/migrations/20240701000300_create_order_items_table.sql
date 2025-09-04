/*
  # Create order_items table

  1. New Tables
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders.id)
      - `menu_item_id` (uuid, foreign key to menu_items.id)
      - `cantidad` (integer, not null)
      - `notas` (text)
  2. Security
    - Enable RLS on `order_items` table
    - Add policy for authenticated users to perform all actions
*/

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  menu_item_id uuid REFERENCES menu_items(id),
  cantidad integer NOT NULL,
  notas text
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can perform all actions"
  ON order_items
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);