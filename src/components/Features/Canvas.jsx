import { useRef, useState, useEffect, useCallback } from 'react'

const COLORS = ['#000000', '#ffffff', '#ff4444', '#ff8800', '#ffdd44', '#44ff44', '#4488ff', '#8844ff', '#ff44ff', '#44dddd', '#888888', '#664422']
const BRUSH_SIZES = [2, 4, 8, 12, 18, 26]

export default function Canvas() {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(4)
  const [tool, setTool] = useState('pen')
  const lastPoint = useRef(null)
  const undoStack = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctxRef.current = ctx

    if (canvas) undoStack.current.push(canvas.toDataURL())
  }, [])

  const saveState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    undoStack.current.push(canvas.toDataURL())
    if (undoStack.current.length > 30) undoStack.current.shift()
  }, [])

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }, [])

  const startDraw = useCallback((e) => {
    e.preventDefault()
    const pos = getPos(e)
    lastPoint.current = pos
    setIsDrawing(true)
  }, [getPos])

  const draw = useCallback((e) => {
    if (!isDrawing) return
    e.preventDefault()
    const pos = getPos(e)
    const ctx = ctxRef.current
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize
    ctx.stroke()

    lastPoint.current = pos
  }, [isDrawing, color, brushSize, tool, getPos])

  const endDraw = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)
    lastPoint.current = null
    saveState()
  }, [isDrawing, saveState])

  const undo = useCallback(() => {
    if (undoStack.current.length < 2) return
    undoStack.current.pop()
    const prev = undoStack.current[undoStack.current.length - 1]
    const img = new Image()
    img.onload = () => {
      const ctx = ctxRef.current
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = prev
  }, [])

  const clearCanvas = useCallback(() => {
    const ctx = ctxRef.current
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    saveState()
  }, [saveState])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] border-b border-white/10 shrink-0 flex-wrap">
        <div className="flex items-center gap-1">
          <button className={`w-8 h-8 flex items-center justify-center rounded-md text-sm border border-transparent cursor-pointer transition-all hover:bg-white/10 ${tool === 'pen' ? 'border-[#e94560] bg-white/10' : ''}`} onClick={() => setTool('pen')} title="Pen">✏️</button>
          <button className={`w-8 h-8 flex items-center justify-center rounded-md text-sm border border-transparent cursor-pointer transition-all hover:bg-white/10 ${tool === 'eraser' ? 'border-[#e94560] bg-white/10' : ''}`} onClick={() => setTool('eraser')} title="Eraser">🧹</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm border border-transparent cursor-pointer transition-all hover:bg-white/10" onClick={undo} title="Undo">↩️</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-sm border border-transparent cursor-pointer transition-all hover:bg-white/10" onClick={clearCanvas} title="Clear">🗑️</button>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`w-5 h-5 rounded-full border cursor-pointer transition-transform hover:scale-110 ${color === c ? 'border-[#e94560] scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="flex items-center gap-1">
          {BRUSH_SIZES.map((s) => (
            <button
              key={s}
              className={`w-7 h-7 flex items-center justify-center rounded-full border cursor-pointer transition-all hover:bg-white/10 ${brushSize === s ? 'border-[#e94560] bg-white/10' : 'border-transparent'}`}
              onClick={() => setBrushSize(s)}
            >
              <span className="block rounded-full bg-gray-300" style={{ width: s, height: s }} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>
    </div>
  )
}
