import { supabase } from './supabase'

// Characters used for room codes — no I,O,0,1 to avoid confusion when reading aloud
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6

// Generates a random 6-character alphanumeric room code
function generateRoomCode() {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

// Creates a unique player ID — used as the presence key in Realtime channels
function generatePlayerId() {
  return crypto.randomUUID()
}

// Called when the host clicks "Create Room"
// Inserts a new room row in the DB with the host's chosen settings
// Retries up to 10 times if it generates a duplicate code (extremely rare)
export async function createRoom({ hostName, roundTime = 80, maxRounds = 3, maxPlayers = 8 }) {
  const hostPlayerId = generatePlayerId()
  let code
  let attempts = 0

  // Loop until we find a unique code (codes are 6 chars, collisions are improbable)
  while (attempts < 10) {
    code = generateRoomCode()
    const { data: existing } = await supabase
      .from('rooms')
      .select('code')
      .eq('code', code)
      .maybeSingle()

    if (!existing) break
    attempts++
  }

  // Safety valve — should never hit this in practice
  if (attempts >= 10) {
    throw new Error('Could not generate unique room code')
  }

  // Insert the room into the "rooms" table and return the created row
  const { data: room, error } = await supabase
    .from('rooms')
    .insert({
      code,
      host_name: hostName,
      host_player_id: hostPlayerId,
      round_time: roundTime,
      max_rounds: maxRounds,
      max_players: maxPlayers,
    })
    .select()
    .single()

  if (error) throw error

  return { room, hostPlayerId }
}

// Fetches a room by its code (used when joining to validate it exists)
export async function getRoom(code) {
  const codeUpper = code.toUpperCase()

  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', codeUpper)
    .maybeSingle()

  if (error) throw error
  return room
}

// Validates that a room exists, is still in "waiting" status, and isn't full
// Returns the room data + a new player ID for presence tracking
export async function joinRoom(code, playerName) {
  const codeUpper = code.toUpperCase()

  const room = await getRoom(codeUpper)
  if (!room) throw new Error('Room not found')
  if (room.status !== 'waiting') throw new Error('Game has already started')
  if (room.max_players <= 1) throw new Error('Room is full')

  const playerId = generatePlayerId()

  return { room, playerId, playerName }
}

// Called by the host to transition the room from "waiting" to "playing"
// The WHERE clause includes status='waiting' as a safety check
export async function startGame(code) {
  const codeUpper = code.toUpperCase()

  const { error } = await supabase
    .from('rooms')
    .update({ status: 'playing' })
    .eq('code', codeUpper)
    .eq('status', 'waiting')

  if (error) throw error
}

export { generateRoomCode, generatePlayerId }
