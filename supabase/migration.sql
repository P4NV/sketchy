CREATE TABLE rooms (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  host_name TEXT NOT NULL,
  host_player_id UUID NOT NULL DEFAULT gen_random_uuid(),
  round_time INT NOT NULL DEFAULT 80,
  max_rounds INT NOT NULL DEFAULT 3,
  max_players INT NOT NULL DEFAULT 8,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_code ON rooms(code);
