

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."inventario_categoria_type" AS ENUM (
    'Inventariables',
    'No inventariables'
);


ALTER TYPE "public"."inventario_categoria_type" OWNER TO "postgres";


CREATE TYPE "public"."inventario_tipo_type" AS ENUM (
    'cantidad',
    'gramos'
);


ALTER TYPE "public"."inventario_tipo_type" OWNER TO "postgres";


CREATE TYPE "public"."metodo_pago_type" AS ENUM (
    'efectivo',
    'tarjeta',
    'transferencia',
    'credito_empleados'
);


ALTER TYPE "public"."metodo_pago_type" OWNER TO "postgres";


CREATE TYPE "public"."order_estado_type" AS ENUM (
    'pendiente',
    'preparando',
    'listo',
    'entregado'
);


ALTER TYPE "public"."order_estado_type" OWNER TO "postgres";


CREATE TYPE "public"."unidad_medida_type" AS ENUM (
    'kg',
    'g',
    'mg'
);


ALTER TYPE "public"."unidad_medida_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."actualizar_horas_semanales"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  semana text;
  horas_semana jsonb;
BEGIN
  -- clave de la semana en formato ISO (año‑semana)
  semana := to_char(NEW.fecha, 'IYYY-IW');

  -- crea o actualiza el registro de esa semana
  INSERT INTO employee_weekly_hours (empleado_id, week_key, horas)
  VALUES (NEW.empleado_id, semana, jsonb_build_object(to_char(NEW.fecha, 'YYYY-MM-DD'), NEW.horas_trabajadas))
  ON CONFLICT (empleado_id, week_key) DO
    UPDATE SET horas = employee_weekly_hours.horas ||
                      jsonb_build_object(to_char(NEW.fecha, 'YYYY-MM-DD'), NEW.horas_trabajadas),
           updated_at = NOW();

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."actualizar_horas_semanales"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calc_total_pago"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.total := COALESCE(NEW.pago_efectivo,0) + COALESCE(NEW.pago_nequi,0) + COALESCE(NEW.pago_tarjeta,0);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."calc_total_pago"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_order_number"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_number integer;
    max_attempts integer := 100;
    attempt_count integer := 0;
BEGIN
    LOOP
        -- Generar número aleatorio entre 1000 y 9999
        new_number := floor(random() * 9000 + 1000)::integer;
        
        -- Verificar si ya existe
        IF NOT EXISTS (SELECT 1 FROM orders WHERE numero = new_number) THEN
            RETURN new_number;
        END IF;
        
        attempt_count := attempt_count + 1;
        IF attempt_count >= max_attempts THEN
            RAISE EXCEPTION 'No se pudo generar un número de orden único después de % intentos', max_attempts;
        END IF;
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."generate_order_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insertar_egreso_desde_gasto"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, gasto_id)
  VALUES ('EGRESO', NEW.categoria || ': ' || NEW.descripcion, NEW.monto, NEW.fecha, NEW.metodoPago, NEW.id);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."insertar_egreso_desde_gasto"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insertar_ingreso_desde_order"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, order_id)
  VALUES ('INGRESO', 'Venta #' || NEW.numero, NEW.total, NEW.timestamp::date, NEW.metodoPago, NEW.id);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."insertar_ingreso_desde_order"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insertar_ingreso_desde_order_multi"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF COALESCE(NEW.pago_efectivo, 0) > 0 THEN
    INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, order_id)
    VALUES ('INGRESO', 'Venta #' || NEW.numero, NEW.pago_efectivo, NEW.timestamp::date, 'efectivo', NEW.id);
  END IF;
  IF COALESCE(NEW.pago_nequi, 0) > 0 THEN
    INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, order_id)
    VALUES ('INGRESO', 'Venta #' || NEW.numero, NEW.pago_nequi, NEW.timestamp::date, 'nequi', NEW.id);
  END IF;
  IF COALESCE(NEW.pago_tarjeta, 0) > 0 THEN
    INSERT INTO caja_movimientos (tipo, concepto, monto, fecha, metodoPago, order_id)
    VALUES ('INGRESO', 'Venta #' || NEW.numero, NEW.pago_tarjeta, NEW.timestamp::date, 'tarjeta', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."insertar_ingreso_desde_order_multi"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_employee_weekly_hours_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_employee_weekly_hours_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."caja_movimientos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "fecha" "date" DEFAULT CURRENT_DATE,
    "tipo" "text" NOT NULL,
    "concepto" "text" NOT NULL,
    "monto" numeric NOT NULL,
    "metodopago" "text" DEFAULT 'efectivo'::"text" NOT NULL,
    "order_id" "uuid",
    "gasto_id" "uuid",
    "bolsillo" "text" DEFAULT 'caja_principal'::"text" NOT NULL,
    "transferencia_id" "uuid",
    CONSTRAINT "caja_movimientos_metodopago_check" CHECK (("metodopago" = ANY (ARRAY['efectivo'::"text", 'tarjeta'::"text", 'nequi'::"text"]))),
    CONSTRAINT "caja_movimientos_tipo_check" CHECK (("tipo" = ANY (ARRAY['INGRESO'::"text", 'EGRESO'::"text"])))
);


ALTER TABLE "public"."caja_movimientos" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."balance_caja" AS
 WITH "resumen" AS (
         SELECT "caja_movimientos"."fecha",
            "sum"(
                CASE
                    WHEN ("caja_movimientos"."tipo" = 'INGRESO'::"text") THEN "caja_movimientos"."monto"
                    ELSE (0)::numeric
                END) AS "ingresos_totales",
            "sum"(
                CASE
                    WHEN ("caja_movimientos"."tipo" = 'EGRESO'::"text") THEN "caja_movimientos"."monto"
                    ELSE (0)::numeric
                END) AS "egresos_totales",
            "sum"(
                CASE
                    WHEN (("caja_movimientos"."tipo" = 'INGRESO'::"text") AND ("caja_movimientos"."metodopago" = 'efectivo'::"text")) THEN "caja_movimientos"."monto"
                    ELSE (0)::numeric
                END) AS "ingresos_efectivo",
            "sum"(
                CASE
                    WHEN (("caja_movimientos"."tipo" = 'EGRESO'::"text") AND ("caja_movimientos"."metodopago" = 'efectivo'::"text")) THEN "caja_movimientos"."monto"
                    ELSE (0)::numeric
                END) AS "egresos_efectivo",
            "sum"(
                CASE
                    WHEN (("caja_movimientos"."tipo" = 'INGRESO'::"text") AND ("caja_movimientos"."metodopago" = 'nequi'::"text")) THEN "caja_movimientos"."monto"
                    ELSE (0)::numeric
                END) AS "ingresos_nequi",
            "sum"(
                CASE
                    WHEN (("caja_movimientos"."tipo" = 'EGRESO'::"text") AND ("caja_movimientos"."metodopago" = 'nequi'::"text")) THEN "caja_movimientos"."monto"
                    ELSE (0)::numeric
                END) AS "egresos_nequi",
            "sum"(
                CASE
                    WHEN (("caja_movimientos"."tipo" = 'INGRESO'::"text") AND ("caja_movimientos"."metodopago" = 'tarjeta'::"text")) THEN "caja_movimientos"."monto"
                    ELSE (0)::numeric
                END) AS "ingresos_tarjeta",
            "sum"(
                CASE
                    WHEN (("caja_movimientos"."tipo" = 'EGRESO'::"text") AND ("caja_movimientos"."metodopago" = 'tarjeta'::"text")) THEN "caja_movimientos"."monto"
                    ELSE (0)::numeric
                END) AS "egresos_tarjeta"
           FROM "public"."caja_movimientos"
          GROUP BY "caja_movimientos"."fecha"
        )
 SELECT "fecha",
    "ingresos_totales",
    "egresos_totales",
    ("ingresos_totales" - "egresos_totales") AS "balance_diario",
    "ingresos_efectivo",
    "egresos_efectivo",
    "ingresos_nequi",
    "egresos_nequi",
    "ingresos_tarjeta",
    "egresos_tarjeta",
    ("ingresos_efectivo" - "egresos_efectivo") AS "saldo_efectivo_dia",
    ("ingresos_nequi" - "egresos_nequi") AS "saldo_nequi_dia",
    ("ingresos_tarjeta" - "egresos_tarjeta") AS "saldo_tarjeta_dia",
    "sum"(("ingresos_totales" - "egresos_totales")) OVER (ORDER BY "fecha") AS "saldo_total_acumulado",
    "sum"(("ingresos_efectivo" - "egresos_efectivo")) OVER (ORDER BY "fecha") AS "saldo_efectivo_acumulado",
    "sum"(("ingresos_nequi" - "egresos_nequi")) OVER (ORDER BY "fecha") AS "saldo_nequi_acumulado",
    "sum"(("ingresos_tarjeta" - "egresos_tarjeta")) OVER (ORDER BY "fecha") AS "saldo_tarjeta_acumulado"
   FROM "resumen"
  ORDER BY "fecha" DESC;


ALTER VIEW "public"."balance_caja" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."caja_bolsillos" (
    "codigo" "text" NOT NULL,
    "nombre" "text" NOT NULL,
    "descripcion" "text",
    "metodo_pago" "public"."metodo_pago_type" NOT NULL,
    "es_principal" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."caja_bolsillos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."caja_transferencias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "fecha" "date" DEFAULT CURRENT_DATE NOT NULL,
    "monto" numeric NOT NULL,
    "descripcion" "text",
    "bolsillo_origen" "text" NOT NULL,
    "bolsillo_destino" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "caja_transferencias_monto_check" CHECK (("monto" > (0)::numeric))
);


ALTER TABLE "public"."caja_transferencias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "telefono" "text" NOT NULL
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."empleados" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "telefono" "text",
    "email" "text",
    "horas_dia" integer DEFAULT 8,
    "dias_semana" integer DEFAULT 5,
    "salario_hora" numeric DEFAULT 0,
    "activo" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "horario_base" "jsonb"
);


ALTER TABLE "public"."empleados" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employee_credit_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "empleado_id" "uuid" NOT NULL,
    "order_id" "uuid",
    "order_numero" integer,
    "monto" numeric NOT NULL,
    "tipo" "text" NOT NULL,
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "employee_credit_history_tipo_check" CHECK (("tipo" = ANY (ARRAY['cargo'::"text", 'abono'::"text"])))
);


ALTER TABLE "public"."employee_credit_history" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."employee_credit_totals" AS
 SELECT "empleado_id",
    "sum"(
        CASE
            WHEN ("tipo" = 'cargo'::"text") THEN "monto"
            ELSE (- "monto")
        END) AS "total"
   FROM "public"."employee_credit_history"
  GROUP BY "empleado_id";


ALTER VIEW "public"."employee_credit_totals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employee_shifts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "empleado_id" "uuid" NOT NULL,
    "fecha" "date" NOT NULL,
    "hora_llegada" time without time zone NOT NULL,
    "hora_salida" time without time zone NOT NULL,
    "novedad" boolean DEFAULT false NOT NULL,
    "novedad_inicio" time without time zone,
    "novedad_fin" time without time zone,
    "horas_trabajadas" numeric GENERATED ALWAYS AS (((EXTRACT(epoch FROM ("hora_salida" - "hora_llegada")) / (3600)::numeric) - COALESCE((EXTRACT(epoch FROM ("novedad_fin" - "novedad_inicio")) / (3600)::numeric), (0)::numeric))) STORED,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."employee_shifts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employee_weekly_hours" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "empleado_id" "uuid" NOT NULL,
    "week_key" "text" NOT NULL,
    "horas" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."employee_weekly_hours" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gastos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "descripcion" "text" NOT NULL,
    "monto" numeric NOT NULL,
    "categoria" "text" NOT NULL,
    "fecha" "date" DEFAULT CURRENT_DATE,
    "metodopago" "text" DEFAULT 'efectivo'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "gastos_metodopago_check" CHECK (("metodopago" = ANY (ARRAY['efectivo'::"text", 'tarjeta'::"text", 'nequi'::"text"])))
);


ALTER TABLE "public"."gastos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."menu_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "codigo" "text" NOT NULL,
    "nombre" "text" NOT NULL,
    "precio" numeric NOT NULL,
    "descripcion" "text",
    "keywords" "text",
    "categoria" "text" NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "inventariocategoria" "text" NOT NULL,
    "inventariotipo" "text",
    "unidadmedida" "text"
);


ALTER TABLE "public"."menu_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "menu_item_id" "uuid",
    "cantidad" integer NOT NULL,
    "notas" "text"
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "numero" integer NOT NULL,
    "total" numeric NOT NULL,
    "estado" "text" NOT NULL,
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "cliente_id" "uuid",
    "pago_efectivo" numeric DEFAULT 0 NOT NULL,
    "pago_nequi" numeric DEFAULT 0 NOT NULL,
    "pago_tarjeta" numeric DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_suggestions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "product_name" "text" NOT NULL,
    "image_base64" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."product_suggestions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."caja_bolsillos"
    ADD CONSTRAINT "caja_bolsillos_pkey" PRIMARY KEY ("codigo");



ALTER TABLE ONLY "public"."caja_movimientos"
    ADD CONSTRAINT "caja_movimientos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."caja_transferencias"
    ADD CONSTRAINT "caja_transferencias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."empleados"
    ADD CONSTRAINT "empleados_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_credit_history"
    ADD CONSTRAINT "employee_credit_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_shifts"
    ADD CONSTRAINT "employee_shifts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_weekly_hours"
    ADD CONSTRAINT "employee_weekly_hours_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_weekly_hours"
    ADD CONSTRAINT "employee_weekly_hours_unique" UNIQUE ("empleado_id", "week_key");



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "gastos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_suggestions"
    ADD CONSTRAINT "product_suggestions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



CREATE INDEX "idx_product_suggestions_created_at" ON "public"."product_suggestions" USING "btree" ("created_at" DESC);



CREATE OR REPLACE TRIGGER "trg_actualizar_horas_semanales" AFTER INSERT OR UPDATE ON "public"."employee_shifts" FOR EACH ROW EXECUTE FUNCTION "public"."actualizar_horas_semanales"();



CREATE OR REPLACE TRIGGER "trg_gasto_to_caja" AFTER INSERT ON "public"."gastos" FOR EACH ROW EXECUTE FUNCTION "public"."insertar_egreso_desde_gasto"();



CREATE OR REPLACE TRIGGER "trg_order_to_caja" AFTER INSERT ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."insertar_ingreso_desde_order_multi"();



CREATE OR REPLACE TRIGGER "trg_update_employee_weekly_hours_updated_at" BEFORE UPDATE ON "public"."employee_weekly_hours" FOR EACH ROW EXECUTE FUNCTION "public"."update_employee_weekly_hours_updated_at"();



CREATE OR REPLACE TRIGGER "update_empleados_updated_at" BEFORE UPDATE ON "public"."empleados" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_total_pago" BEFORE INSERT OR UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."calc_total_pago"();



ALTER TABLE ONLY "public"."caja_movimientos"
    ADD CONSTRAINT "caja_movimientos_bolsillo_fkey" FOREIGN KEY ("bolsillo") REFERENCES "public"."caja_bolsillos"("codigo");



ALTER TABLE ONLY "public"."caja_movimientos"
    ADD CONSTRAINT "caja_movimientos_gasto_id_fkey" FOREIGN KEY ("gasto_id") REFERENCES "public"."gastos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."caja_movimientos"
    ADD CONSTRAINT "caja_movimientos_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."caja_movimientos"
    ADD CONSTRAINT "caja_movimientos_transferencia_id_fkey" FOREIGN KEY ("transferencia_id") REFERENCES "public"."caja_transferencias"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."caja_transferencias"
    ADD CONSTRAINT "caja_transferencias_bolsillo_destino_fkey" FOREIGN KEY ("bolsillo_destino") REFERENCES "public"."caja_bolsillos"("codigo");



ALTER TABLE ONLY "public"."caja_transferencias"
    ADD CONSTRAINT "caja_transferencias_bolsillo_origen_fkey" FOREIGN KEY ("bolsillo_origen") REFERENCES "public"."caja_bolsillos"("codigo");



ALTER TABLE ONLY "public"."employee_credit_history"
    ADD CONSTRAINT "employee_credit_history_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "public"."empleados"("id");



ALTER TABLE ONLY "public"."employee_credit_history"
    ADD CONSTRAINT "employee_credit_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."employee_shifts"
    ADD CONSTRAINT "employee_shifts_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "public"."empleados"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."employee_weekly_hours"
    ADD CONSTRAINT "employee_weekly_hours_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "public"."empleados"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."customers"("id");



ALTER TABLE ONLY "public"."product_suggestions"
    ADD CONSTRAINT "product_suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE "public"."caja_movimientos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."empleados" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gastos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."menu_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_suggestions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "product_suggestions_insert" ON "public"."product_suggestions" FOR INSERT WITH CHECK (true);



CREATE POLICY "product_suggestions_select" ON "public"."product_suggestions" FOR SELECT USING (true);



CREATE POLICY "public_all_caja_movimientos" ON "public"."caja_movimientos" USING (true) WITH CHECK (true);



CREATE POLICY "public_all_customers" ON "public"."customers" USING (true) WITH CHECK (true);



CREATE POLICY "public_all_empleados" ON "public"."empleados" USING (true) WITH CHECK (true);



CREATE POLICY "public_all_gastos" ON "public"."gastos" USING (true) WITH CHECK (true);



CREATE POLICY "public_all_menu_items" ON "public"."menu_items" USING (true) WITH CHECK (true);



CREATE POLICY "public_all_order_items" ON "public"."order_items" USING (true) WITH CHECK (true);



CREATE POLICY "public_all_orders" ON "public"."orders" USING (true) WITH CHECK (true);



CREATE POLICY "public_delete_users" ON "public"."users" FOR DELETE USING (true);



CREATE POLICY "public_insert_users" ON "public"."users" FOR INSERT WITH CHECK (true);



CREATE POLICY "public_select_users" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "public_update_users" ON "public"."users" FOR UPDATE USING (true) WITH CHECK (true);



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."actualizar_horas_semanales"() TO "anon";
GRANT ALL ON FUNCTION "public"."actualizar_horas_semanales"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."actualizar_horas_semanales"() TO "service_role";



GRANT ALL ON FUNCTION "public"."calc_total_pago"() TO "anon";
GRANT ALL ON FUNCTION "public"."calc_total_pago"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calc_total_pago"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_order_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insertar_egreso_desde_gasto"() TO "anon";
GRANT ALL ON FUNCTION "public"."insertar_egreso_desde_gasto"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insertar_egreso_desde_gasto"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insertar_ingreso_desde_order"() TO "anon";
GRANT ALL ON FUNCTION "public"."insertar_ingreso_desde_order"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insertar_ingreso_desde_order"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insertar_ingreso_desde_order_multi"() TO "anon";
GRANT ALL ON FUNCTION "public"."insertar_ingreso_desde_order_multi"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insertar_ingreso_desde_order_multi"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_employee_weekly_hours_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_employee_weekly_hours_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_employee_weekly_hours_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."caja_movimientos" TO "anon";
GRANT ALL ON TABLE "public"."caja_movimientos" TO "authenticated";
GRANT ALL ON TABLE "public"."caja_movimientos" TO "service_role";



GRANT ALL ON TABLE "public"."balance_caja" TO "anon";
GRANT ALL ON TABLE "public"."balance_caja" TO "authenticated";
GRANT ALL ON TABLE "public"."balance_caja" TO "service_role";



GRANT ALL ON TABLE "public"."caja_bolsillos" TO "anon";
GRANT ALL ON TABLE "public"."caja_bolsillos" TO "authenticated";
GRANT ALL ON TABLE "public"."caja_bolsillos" TO "service_role";



GRANT ALL ON TABLE "public"."caja_transferencias" TO "anon";
GRANT ALL ON TABLE "public"."caja_transferencias" TO "authenticated";
GRANT ALL ON TABLE "public"."caja_transferencias" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";



GRANT ALL ON TABLE "public"."empleados" TO "anon";
GRANT ALL ON TABLE "public"."empleados" TO "authenticated";
GRANT ALL ON TABLE "public"."empleados" TO "service_role";



GRANT ALL ON TABLE "public"."employee_credit_history" TO "anon";
GRANT ALL ON TABLE "public"."employee_credit_history" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_credit_history" TO "service_role";



GRANT ALL ON TABLE "public"."employee_credit_totals" TO "anon";
GRANT ALL ON TABLE "public"."employee_credit_totals" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_credit_totals" TO "service_role";



GRANT ALL ON TABLE "public"."employee_shifts" TO "anon";
GRANT ALL ON TABLE "public"."employee_shifts" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_shifts" TO "service_role";



GRANT ALL ON TABLE "public"."employee_weekly_hours" TO "anon";
GRANT ALL ON TABLE "public"."employee_weekly_hours" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_weekly_hours" TO "service_role";



GRANT ALL ON TABLE "public"."gastos" TO "anon";
GRANT ALL ON TABLE "public"."gastos" TO "authenticated";
GRANT ALL ON TABLE "public"."gastos" TO "service_role";



GRANT ALL ON TABLE "public"."menu_items" TO "anon";
GRANT ALL ON TABLE "public"."menu_items" TO "authenticated";
GRANT ALL ON TABLE "public"."menu_items" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."product_suggestions" TO "anon";
GRANT ALL ON TABLE "public"."product_suggestions" TO "authenticated";
GRANT ALL ON TABLE "public"."product_suggestions" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






RESET ALL;
