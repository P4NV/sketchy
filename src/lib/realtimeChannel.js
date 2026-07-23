import { supabase } from './supabase'

// Creates a Realtime channel for a room — does NOT subscribe yet
// Call subscribeToRoom() later after attaching any additional callbacks
export function createRoomChannel(code, playerId) {
  return supabase.channel(`room:${code}`, {
    config: {
      presence: {
        key: playerId,
      },
    },
  })
}

// Attaches listeners and subscribes to the channel
// Must be called AFTER createRoomChannel() — do not call subscribe() before this
// callbacks: { onPresence, onPlayerJoin, onPlayerLeave, onGameMove, onGameStart, onChatMessage }
export function subscribeToRoom(channel, playerName, isHost, callbacks = {}) {
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const players = Object.entries(state).map(([id, presences]) => ({
        id,
        name: presences[0]?.name,
        isHost: presences[0]?.isHost ?? false,
      }))
      callbacks.onPresence?.(players)
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      callbacks.onPlayerJoin?.({
        id: key,
        name: newPresences[0]?.name,
        isHost: newPresences[0]?.isHost ?? false,
      })
    })
    .on('presence', { event: 'leave' }, ({ key }) => {
      callbacks.onPlayerLeave?.(key)
    })
    .on('broadcast', { event: 'game-move' }, ({ payload }) => {
      callbacks.onGameMove?.(payload)
    })
    .on('broadcast', { event: 'game-start' }, ({ payload }) => {
      callbacks.onGameStart?.(payload)
    })
    .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
      callbacks.onChatMessage?.(payload)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ name: playerName, isHost, joinedAt: Date.now() })
        callbacks.onSubscribed?.()
      }
    })

  return channel
}

// Use httpSend() instead of send() to avoid deprecation warnings
export function sendGameMove(channel, move) {
  channel.httpSend({ type: 'broadcast', event: 'game-move', payload: move })
}

export function sendChatMessage(channel, message) {
  channel.httpSend({ type: 'broadcast', event: 'chat-message', payload: message })
}

export function broadcastGameStart(channel, gameConfig) {
  channel.httpSend({ type: 'broadcast', event: 'game-start', payload: gameConfig })
}
