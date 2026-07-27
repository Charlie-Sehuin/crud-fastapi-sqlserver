-- Tabla principal de tareas
CREATE TABLE tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  done       BOOLEAN NOT NULL DEFAULT false,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activar seguridad a nivel de fila (nadie ve nada hasta que agreguemos policies)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Un usuario solo puede ver sus propias tareas
CREATE POLICY "users_select_own_tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

-- Un usuario solo puede crear tareas para sí mismo
CREATE POLICY "users_insert_own_tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Un usuario solo puede modificar sus propias tareas
CREATE POLICY "users_update_own_tasks"
ON tasks FOR UPDATE
USING (auth.uid() = user_id);

-- Un usuario solo puede borrar sus propias tareas
CREATE POLICY "users_delete_own_tasks"
ON tasks FOR DELETE
USING (auth.uid() = user_id);