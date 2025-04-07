import React from 'react'

function FormError({text}:{text:string}) {
  return (
    <p className="text-xs text-red-500 pl-2">{text}</p>
  )
}

export default FormError