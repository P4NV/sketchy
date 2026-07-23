// Main menu — three buttons that navigate to different game modes
export default function StartMenu({ onNavigate }) {
  const buttons = [
    { title: 'Create Room', page: 'create', key: 1 },
    { title: 'Join a Room', page: 'join', key: 2 },
    { title: 'Single Room', page: 'single_room', key: 3 },
  ]

  return (
    <main className='h-svh w-svw flex bg-blue-600/70 justify-center items-center'>
      <div className='flex flex-col justify-start items-center shadow-[0px_5px_25px_rgba(0,0,0,0.6)] inset-shadow-[0px_5px_30px_rgba(255,255,255,0.8)] rounded-3xl gap-12 px-5 py-12 max-w-[380px] max-h-[550px]'>
        <h1 className='text-8xl text-white text-shadow-black text-shadow-md tracking-tight font-bold'>Sketchy</h1>
        {buttons.map((button) => (
          <button
            className='flex flex-col items-center w-4/6 h-16 border rounded-2xl hover:bg-blue-200/40 cursor-pointer'
            key={button.key}
            onClick={() => onNavigate(button.page)}
          >
            <h1 className='text-xl text-white text-shadow-black text-shadow-xs font-semibold tracking-wide'>{button.title}</h1>
          </button>
        ))}
      </div>
    </main>
  )
}
