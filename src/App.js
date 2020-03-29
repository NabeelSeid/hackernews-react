import React, { Component } from "react";
import "./App.css";

const list = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { list, searchTerm: "" };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  // binding and constructor can be avoided by using arrow function
  onDismiss(id) {
    this.setState({
      list: this.state.list.filter(item => item.objectID !== id)
    });
  }

  render() {
    const { list, searchTerm } = this.state;

    return (
      <div className="App">
        <Search value={searchTerm} onChange={this.onSearchChange} />
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const { searchTerm, onChange } = this.props;

    return (
      <form>
        <input type="text" value={searchTerm} onChange={onChange} />
      </form>
    );
  }
}

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;

    return list.filter(isSearched(pattern)).map(item => (
      <div key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
          <button onClick={() => onDismiss(item.objectID)} type="button">
            Dismiss
          </button>
        </span>
      </div>
    ));
  }
}

export default App;
