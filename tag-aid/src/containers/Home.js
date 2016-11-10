import React, { Component } from 'react';
import { connect } from 'react-redux';
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
          <div key={text.id}>{text.name}</div>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    texts: state.texts
  }
}

export default connect(mapStateToProps, {
  setTexts
})(Home);
