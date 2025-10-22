-- Gestionar provisiones de caja mediante bolsillos y transferencias internas

-- Catálogo de bolsillos de caja
CREATE TABLE IF NOT EXISTS caja_bolsillos (
  codigo text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  metodo_pago text NOT NULL,
  es_principal boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Semillas iniciales para bolsillos principales
INSERT INTO caja_bolsillos (codigo, nombre, descripcion, metodo_pago, es_principal)
VALUES
  ('caja_principal', 'Caja principal', 'Bolsillo principal de efectivo disponible', 'efectivo', true),
  ('provision_caja', 'Provisión de caja', 'Reservas de efectivo apartadas del punto de venta', 'efectivo', false)
ON CONFLICT (codigo) DO UPDATE
SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  metodo_pago = EXCLUDED.metodo_pago,
  es_principal = EXCLUDED.es_principal;

-- Tabla de transferencias internas entre bolsillos
CREATE TABLE IF NOT EXISTS caja_transferencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  monto numeric NOT NULL CHECK (monto > 0),
  descripcion text,
  bolsillo_origen text NOT NULL REFERENCES caja_bolsillos(codigo),
  bolsillo_destino text NOT NULL REFERENCES caja_bolsillos(codigo),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Relacionar movimientos de caja con bolsillos y transferencias
ALTER TABLE caja_movimientos
  ADD COLUMN IF NOT EXISTS bolsillo text,
  ADD COLUMN IF NOT EXISTS transferencia_id uuid;

UPDATE caja_movimientos
SET bolsillo = 'caja_principal'
WHERE bolsillo IS NULL;

ALTER TABLE caja_movimientos
  ALTER COLUMN bolsillo SET DEFAULT 'caja_principal',
  ALTER COLUMN bolsillo SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE caja_movimientos
    ADD CONSTRAINT caja_movimientos_bolsillo_fkey
      FOREIGN KEY (bolsillo) REFERENCES caja_bolsillos(codigo);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE caja_movimientos
    ADD CONSTRAINT caja_movimientos_transferencia_id_fkey
      FOREIGN KEY (transferencia_id) REFERENCES caja_transferencias(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- Índices de apoyo para consultas por bolsillo/transferencia
CREATE INDEX IF NOT EXISTS idx_caja_movimientos_bolsillo ON caja_movimientos (bolsillo);
CREATE INDEX IF NOT EXISTS idx_caja_movimientos_transferencia ON caja_movimientos (transferencia_id);

-- Sincronizar movimientos al crear o actualizar transferencias
CREATE OR REPLACE FUNCTION sync_caja_transferencia_movimientos()
RETURNS trigger AS $$
DECLARE
  datos_origen RECORD;
  datos_destino RECORD;
  descripcion_base text;
BEGIN
  SELECT nombre, metodo_pago INTO datos_origen
  FROM caja_bolsillos
  WHERE codigo = NEW.bolsillo_origen;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El bolsillo de origen % no existe', NEW.bolsillo_origen;
  END IF;

  SELECT nombre, metodo_pago INTO datos_destino
  FROM caja_bolsillos
  WHERE codigo = NEW.bolsillo_destino;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El bolsillo de destino % no existe', NEW.bolsillo_destino;
  END IF;

  descripcion_base := NULLIF(TRIM(NEW.descripcion), '');

  DELETE FROM caja_movimientos
  WHERE transferencia_id = NEW.id;

  INSERT INTO caja_movimientos (fecha, tipo, concepto, monto, metodoPago, transferencia_id, bolsillo)
  VALUES (
    NEW.fecha,
    'EGRESO',
    COALESCE(descripcion_base, 'Transferencia a ' || datos_destino.nombre),
    NEW.monto,
    datos_origen.metodo_pago,
    NEW.id,
    NEW.bolsillo_origen
  );

  INSERT INTO caja_movimientos (fecha, tipo, concepto, monto, metodoPago, transferencia_id, bolsillo)
  VALUES (
    NEW.fecha,
    'INGRESO',
    COALESCE(descripcion_base, 'Transferencia desde ' || datos_origen.nombre),
    NEW.monto,
    datos_destino.metodo_pago,
    NEW.id,
    NEW.bolsillo_destino
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_caja_transferencias ON caja_transferencias;

CREATE TRIGGER trg_sync_caja_transferencias
AFTER INSERT OR UPDATE ON caja_transferencias
FOR EACH ROW
EXECUTE FUNCTION sync_caja_transferencia_movimientos();

-- Vista de balance extendida con provisión de caja
CREATE OR REPLACE VIEW balance_caja AS
WITH resumen AS (
  SELECT
    fecha,
    SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) AS ingresos_totales,
    SUM(CASE WHEN tipo = 'EGRESO' THEN monto ELSE 0 END) AS egresos_totales,
    SUM(CASE WHEN tipo = 'INGRESO' AND metodoPago = 'efectivo' THEN monto ELSE 0 END) AS ingresos_efectivo,
    SUM(CASE WHEN tipo = 'EGRESO' AND metodoPago = 'efectivo' THEN monto ELSE 0 END) AS egresos_efectivo,
    SUM(CASE WHEN tipo = 'INGRESO' AND metodoPago = 'nequi' THEN monto ELSE 0 END) AS ingresos_nequi,
    SUM(CASE WHEN tipo = 'EGRESO' AND metodoPago = 'nequi' THEN monto ELSE 0 END) AS egresos_nequi,
    SUM(CASE WHEN tipo = 'INGRESO' AND metodoPago = 'tarjeta' THEN monto ELSE 0 END) AS ingresos_tarjeta,
    SUM(CASE WHEN tipo = 'EGRESO' AND metodoPago = 'tarjeta' THEN monto ELSE 0 END) AS egresos_tarjeta,
    SUM(CASE WHEN tipo = 'INGRESO' AND bolsillo = 'provision_caja' THEN monto ELSE 0 END) AS ingresos_provision_caja,
    SUM(CASE WHEN tipo = 'EGRESO' AND bolsillo = 'provision_caja' THEN monto ELSE 0 END) AS egresos_provision_caja
  FROM caja_movimientos
  GROUP BY fecha
)
SELECT
  fecha,
  ingresos_totales,
  egresos_totales,
  ingresos_totales - egresos_totales AS balance_diario,
  ingresos_efectivo,
  egresos_efectivo,
  ingresos_nequi,
  egresos_nequi,
  ingresos_tarjeta,
  egresos_tarjeta,
  ingresos_provision_caja,
  egresos_provision_caja,
  ingresos_efectivo - egresos_efectivo AS saldo_efectivo_dia,
  ingresos_nequi - egresos_nequi AS saldo_nequi_dia,
  ingresos_tarjeta - egresos_tarjeta AS saldo_tarjeta_dia,
  ingresos_provision_caja - egresos_provision_caja AS saldo_provision_caja_dia,
  SUM(ingresos_totales - egresos_totales) OVER (ORDER BY fecha) AS saldo_total_acumulado,
  SUM(ingresos_efectivo - egresos_efectivo) OVER (ORDER BY fecha) AS saldo_efectivo_acumulado,
  SUM(ingresos_nequi - egresos_nequi) OVER (ORDER BY fecha) AS saldo_nequi_acumulado,
  SUM(ingresos_tarjeta - egresos_tarjeta) OVER (ORDER BY fecha) AS saldo_tarjeta_acumulado,
  SUM(ingresos_provision_caja - egresos_provision_caja) OVER (ORDER BY fecha) AS saldo_provision_caja_acumulado
FROM resumen
ORDER BY fecha DESC;

-- RLS y permisos para las nuevas tablas
ALTER TABLE caja_bolsillos ENABLE ROW LEVEL SECURITY;
ALTER TABLE caja_transferencias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_all_caja_bolsillos ON caja_bolsillos;
CREATE POLICY public_all_caja_bolsillos ON caja_bolsillos USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS public_all_caja_transferencias ON caja_transferencias;
CREATE POLICY public_all_caja_transferencias ON caja_transferencias USING (true) WITH CHECK (true);

GRANT ALL ON TABLE caja_bolsillos TO anon, authenticated, service_role;
GRANT ALL ON TABLE caja_transferencias TO anon, authenticated, service_role;
