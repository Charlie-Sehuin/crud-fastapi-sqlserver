-- Ya no hace falta: la seguridad de tasks pasa por list_id -> board -> user_id
-- Primero hay que borrar las policies viejas que dependían de esta columna
DROP POLICY IF EXISTS "users_select_own_tasks" ON tasks;
DROP POLICY IF EXISTS "users_insert_own_tasks" ON tasks;
DROP POLICY IF EXISTS "users_update_own_tasks" ON tasks;
DROP POLICY IF EXISTS "users_delete_own_tasks" ON tasks;

-- Ahora sí, se puede quitar la columna
ALTER TABLE tasks DROP COLUMN user_id;

-- Nuevas policies de tasks: el dueño se verifica a través de list_id -> board_id -> user_id
CREATE POLICY "users_select_own_tasks"
ON tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM lists
    JOIN boards ON boards.id = lists.board_id
    WHERE lists.id = tasks.list_id
    AND boards.user_id = auth.uid()
  )
);

CREATE POLICY "users_insert_own_tasks"
ON tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM lists
    JOIN boards ON boards.id = lists.board_id
    WHERE lists.id = tasks.list_id
    AND boards.user_id = auth.uid()
  )
);

CREATE POLICY "users_update_own_tasks"
ON tasks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM lists
    JOIN boards ON boards.id = lists.board_id
    WHERE lists.id = tasks.list_id
    AND boards.user_id = auth.uid()
  )
);

CREATE POLICY "users_delete_own_tasks"
ON tasks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM lists
    JOIN boards ON boards.id = lists.board_id
    WHERE lists.id = tasks.list_id
    AND boards.user_id = auth.uid()
  )
);