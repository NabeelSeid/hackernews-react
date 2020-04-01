import React from 'react'

// BUTTON COMPONENT
export default ({ onClick, className = '', children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
)
