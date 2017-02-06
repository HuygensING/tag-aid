import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getTexts } from '../actions'

class Home extends Component {
  componentWillMount() {
    this.props.getTexts()
  }

  render() {
    const { texts } = this.props

    if (!texts) {
      return (
        <div>Loading texts...</div>
      )
    }

    return (
      <div className="container big-margin">
        <h1>Texts</h1>
        {texts.map(text => (
          <div key={text.id}>
            <Link to={`/text/${text.id}`}>
              <div>{text.name}</div>
            </Link>
            <div>{text.chronology}</div>
          </div>
        ))}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    texts: state.indexTexts
  }
}

export default connect(mapStateToProps, {
  getTexts,
})(Home)
