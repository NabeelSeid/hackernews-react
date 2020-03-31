import React, { Component } from 'react'
import axios from 'axios'
import './App.css'

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '50'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

class App extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    }

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(
      this,
    )
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm]
  }

  setSearchTopStories(result) {
    const { hits, page } = result
    const { searchKey, results } = this.state

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : []

    const updatedHits = [...oldHits, ...hits]

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    })
  }

  fetchSearchTopStories(searchTerm, page = 0, hpp = DEFAULT_HPP) {
    const url =
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}` +
      `${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${hpp}`

    axios(url)
      .then(
        result =>
          this._isMounted && this.setSearchTopStories(result.data),
      )
      .catch(error => this._isMounted && this.setState({ error }))
  }

  componentDidMount() {
    this._isMounted = true

    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })

    if (this.needsToSearchTopStories(searchTerm))
      this.fetchSearchTopStories(searchTerm)

    event.preventDefault()
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value })
  }

  // binding and constructor can be avoided by using arrow function
  onDismiss(id) {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey]

    const updatedHits = hits.filter(item => item.objectID !== id)

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    })
  }

  render() {
    const { results, searchKey, searchTerm, error } = this.state

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0

    const list =
      (results && results[searchKey] && results[searchKey].hits) || []

    return (
      <div className="App page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            {/* Components can also be passed to another Component via props */}
            Search
          </Search>
          {error ? (
            <div className="interactions">
              <p>Something went wrong.</p>
            </div>
          ) : (
            <Table list={list} onDismiss={this.onDismiss} />
          )}
          <div className="interactions">
            <Button
              onClick={() =>
                this.fetchSearchTopStories(searchKey, page + 1)
              }>
              More
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const Search = ({ searchTerm, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={searchTerm} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
)

const largeColumn = {
  width: '40%',
}
const midColumn = {
  width: '30%',
}
const smallColumn = {
  width: '10%',
}

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map(item => (
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline">
            Dismiss
          </Button>
        </span>
      </div>
    ))}
  </div>
)

const Button = ({ onClick, className = '', children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
)

export default App
