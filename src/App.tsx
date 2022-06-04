import Field from 'Field'
import React, { useCallback, useRef, useState } from 'react'
import { Minefield } from 'sapper'

const App = () => {
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const minefield = useRef(
    new Minefield({
      width: 10,
      height: 10,
      minesCount: 10,
      callback: forceUpdate,
    })
  )

  if (minefield.current.status !== 'inProgress') {
    alert(minefield.current.status === 'lost' ? 'Game Over!' : 'You Win!')
  }

  return (
    <div>
      <h1 className="p-8 text-3xl font-bold">Sapper</h1>
      <div className={`inline-grid grid-cols-10 gap-1 px-8`}>
        {minefield.current
          .getFlatMinefield()
          .map(({ field, position }, index) => (
            <Field
              key={index}
              field={field}
              onClick={() => minefield.current.openField(position)}
              onRightClick={() => minefield.current.toggleFlag(position)}
            />
          ))}
      </div>
    </div>
  )
}

export default App
