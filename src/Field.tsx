import React from 'react'

interface Props {
  key: number
  field: 'mine' | 'flag' | 'closed' | number
  onClick(): void
  onRightClick(): void
}

const Field = ({ field, onClick, onRightClick }: Props) => {
  switch (field) {
    case 'mine':
      return <div>💣</div>

    case 'closed':
      return (
        <button onClick={onClick} onContextMenu={onRightClick}>
          🟪
        </button>
      )

    case 'flag':
      return <button onContextMenu={onRightClick}>🚩</button>

    default:
      return field === 0 ? <div>⬜</div> : <div>{field}</div>
  }
}

export default Field
