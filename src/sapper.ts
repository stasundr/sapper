export type Position = {
  x: number
  y: number
}

export type ReactField = {
  field: 'mine' | 'flag' | 'closed' | number
  position: Position
}

export type MinefieldOptions = {
  width: number
  height: number
  minesCount: number
  callback(): void
}

export class Minefield {
  width: number
  height: number
  status: 'win' | 'lost' | 'inProgress'

  private mines: Position[]
  private openFields: Position[]
  private flags: Position[]
  private callback: () => void

  constructor({ width, height, minesCount, callback }: MinefieldOptions) {
    this.width = width
    this.height = height
    this.status = 'inProgress'
    this.mines = []
    this.openFields = []
    this.flags = []
    this.callback = callback

    while (this.mines.length < minesCount) {
      this.addMine({
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height),
      })
    }
  }

  private hasMine(p: Position) {
    for (let m of this.mines) {
      if (m.x === p.x && m.y === p.y) {
        return true
      }
    }
    return false
  }

  private addMine(p: Position) {
    if (!this.hasMine(p)) {
      this.mines.push(p)
    }
  }

  private hasOpenField(p: Position) {
    for (let m of this.openFields) {
      if (m.x === p.x && m.y === p.y) {
        return true
      }
    }
    return false
  }

  private neighborMinesCount(p: Position) {
    let minesCount = 0

    const xStart = Math.max(p.x - 1, 0)
    const xEnd = Math.min(p.x + 1, this.width - 1)
    const yStart = Math.max(p.y - 1, 0)
    const yEnd = Math.min(p.y + 1, this.height - 1)

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        if (p.x == x && p.y == y) {
          continue
        }

        if (this.hasMine({ x, y })) {
          minesCount++
        }
      }
    }

    return minesCount
  }

  openField(p: Position) {
    if (this.hasOpenField(p) || this.status !== 'inProgress') {
      return
    }

    this.openFields.push(p)

    if (this.hasMine(p)) {
      this.status = 'lost'
      for (let m of this.mines) {
        this.openFields.push(m)
      }
      this.callback()
      return
    }

    if (
      this.width * this.height - this.openFields.length ===
      this.mines.length
    ) {
      this.status = 'win'
    }

    if (this.neighborMinesCount(p) === 0) {
      if (this.hasMine(p)) {
        this.callback()
        return
      }

      const xStart = Math.max(p.x - 1, 0)
      const xEnd = Math.min(p.x + 1, this.width - 1)
      const yStart = Math.max(p.y - 1, 0)
      const yEnd = Math.min(p.y + 1, this.height - 1)

      for (let x = xStart; x <= xEnd; x++) {
        for (let y = yStart; y <= yEnd; y++) {
          if (p.x == x && p.y == y) {
            continue
          }

          if (!this.hasFlag({ x, y })) {
            this.openField({ x, y })
          }
        }
      }
    }

    this.callback()
  }

  private hasFlag(p: Position) {
    for (let m of this.flags) {
      if (m.x === p.x && m.y === p.y) {
        return true
      }
    }
    return false
  }

  toggleFlag(p: Position) {
    if (this.hasOpenField(p)) {
      return
    }

    if (this.hasFlag(p)) {
      this.flags = this.flags.filter((m) => !(m.x === p.x && m.y === p.y))
    } else {
      this.flags.push(p)
    }

    this.callback()
  }

  getFlatMinefield() {
    const fields: ReactField[] = []

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const position = { x, y }
        if (this.hasOpenField(position)) {
          if (this.hasMine(position)) {
            fields.push({ position, field: 'mine' })
          } else {
            fields.push({ position, field: this.neighborMinesCount(position) })
          }
        } else if (this.hasFlag(position)) {
          fields.push({ position, field: 'flag' })
        } else {
          fields.push({ position, field: 'closed' })
        }
      }
    }

    return fields
  }
}
