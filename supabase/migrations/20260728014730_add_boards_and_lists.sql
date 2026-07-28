-- Tabla de tableros
CREATE TABLE boards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de listas (columnas dentro de un tablero, ej: "Por hacer", "Haciendo", "Listo")
CREATE TABLE lists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  board_id   UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  position   INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ahora una tarea pertenece a una lista, ya no directamente a un usuario
ALTER TABLE tasks ADD COLUMN list_id UUID REFERENCES lists(id) ON DELETE CASCADE;

-- RLS de boards: mismo patrón que ya usaste en tasks
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_boards"
ON boards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_boards"
ON boards FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_boards"
ON boards FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "users_delete_own_boards"
ON boards FOR DELETE
USING (auth.uid() = user_id);

-- RLS de lists: acá la regla es distinta, porque lists no tiene user_id directo.
-- Hay que verificar el dueño a través del board al que pertenece.
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_lists"
ON lists FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = lists.board_id
    AND boards.user_id = auth.uid()
  )
);

CREATE POLICY "users_insert_own_lists"
ON lists FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = lists.board_id
    AND boards.user_id = auth.uid()
  )
);

CREATE POLICY "users_update_own_lists"
ON lists FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = lists.board_id
    AND boards.user_id = auth.uid()
  )
);

CREATE POLICY "users_delete_own_lists"
ON lists FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = lists.board_id
    AND boards.user_id = auth.uid()
  )
);