import React, {Component} from 'react'
import './App.css'

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '100'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitPerPage='

// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {result: null, searchTerm: DEFAULT_QUERY}

    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  setSearchTopStories(result) {
    const {hits, page} = result

    const oldHits = page !== 0 ? this.state.result.hits : []

    result = {...result, hits: [...oldHits, ...hits]}

    this.setState({result})
  }

  fetchSearchTopStories(searchTerm, page = 0, hpp = DEFAULT_HPP) {
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&
      ${PARAM_PAGE}${page}&${PARAM_HPP}${hpp}`

    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(err => err)
  }

  componentDidMount() {
    const {searchTerm} = this.state
    this.fetchSearchTopStories(searchTerm)
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state
    this.fetchSearchTopStories(searchTerm)
    event.preventDefault()
  }

  onSearchChange = event => {
    this.setState({searchTerm: event.target.value})
  }

  // binding and constructor can be avoided by using arrow function
  onDismiss(id) {
    const updatedHits = this.state.result.hits.filter(
      item => item.objectID !== id,
    )
    this.setState({
      result: {...this.state.result, hits: updatedHits},
    })
  }

  render() {
    const {result, searchTerm} = this.state
    const page = (result && result.page) || 0

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
          {result && (
            <Table list={result.hits} onDismiss={this.onDismiss} />
          )}
          <div className="interactions">
            <Button
              onClick={() =>
                this.fetchSearchTopStories(searchTerm, page + 1)
              }>
              More
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const Search = ({searchTerm, onChange, onSubmit, children}) => (
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

const Table = ({list, onDismiss}) => (
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

const Button = ({onClick, className = '', children}) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
)

export default App
