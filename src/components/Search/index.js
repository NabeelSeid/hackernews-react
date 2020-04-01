import React from 'react'

export default ({ searchTerm, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={searchTerm} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
)
