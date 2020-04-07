import React, { Component } from 'react'

class Search extends Component {
  componentDidMount() {
    if (this.input) this.input.focus()
  }

  setTextInputRef = node => (this.input = node)

  render() {
    const { searchTerm, onChange, onSubmit, children } = this.props

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={onChange}
          ref={this.setTextInputRef}
        />
        <button type="submit">{children}</button>
      </form>
    )
  }
}

export default Search
