import React, { Component } from 'react'
import { sortBy } from 'lodash'
import classNames from 'classnames'

import Button from '../Button'

import {
  faSortUp,
  faSortDown,
  faAngleUp,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const largeColumn = {
  width: '40%',
}
const midColumn = {
  width: '30%',
}
const smallColumn = {
  width: '10%',
}

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
}

const Sort = ({
  sortKey,
  activeSortKey,
  onSort,
  isSortReverse,
  children,
}) => {
  const sortClass = classNames('button-inline', {
    'button-active': sortKey === activeSortKey,
  })

  const sortIcon = (
    <FontAwesomeIcon
      icon={isSortReverse ? faAngleUp : faAngleDown}
      size="lg"
      fixedWidth
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
      color="green"
    />
  )

  return (
    <div>
      <Button onClick={() => onSort(sortKey)} className={sortClass}>
        {children}
      </Button>
      {sortKey === activeSortKey && sortIcon}
    </div>
  )
}
class Table extends Component {
  state = {
    sortKey: 'NONE',
    isSortReverse: false,
  }

  onSort = sortKey => {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse
    this.setState({ sortKey, isSortReverse })
  }

  render() {
    const { list, onDismiss } = this.props
    const { sortKey, onSort, isSortReverse } = this.state

    // Reverse reverse list if isSortReverse TRUE
    const sortedList = SORTS[sortKey](list)
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList

    return (
      <div className="table">
        <div className="table-header">
          <span style={largeColumn}>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}>
              Title
            </Sort>
          </span>
          <span style={midColumn}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}>
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}>
              Comments
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}>
              Points
            </Sort>
          </span>
          <span style={{ width: '10%' }}>Archive</span>
        </div>
        {reverseSortedList.map(item => (
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
  }
}

export default Table
