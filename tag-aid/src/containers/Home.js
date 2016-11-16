import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setTexts } from '../actions';

class Home extends Component {
  componentWillMount() {
    this.props.setTexts([
      {
        id: 1,
        name: 'Parzival'
      }
    ]);
  }

  render() {
    const { texts } = this.props;
    return (
      <div>
        <h1>Texts</h1>
        {texts.map(text => (
          <Link to={`/tag-aid`}>
            <div key={text.id}>{text.name}</div>
          </Link>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    texts: state.indexTexts
  }
}

export default connect(mapStateToProps, {
  setTexts
})(Home);
