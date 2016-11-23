import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { setTexts } from '../actions';

class HomeComponent extends Component {
  componentWillMount() {
    this.props.setTexts([
      {
        id: 1,
        name: 'Parzival',
        chronology: 'medieval'
      }
    ]);
  }

  render() {
    //const { texts } = this.props;
    return (
      <div className="container big-margin">
        <h1>Texts</h1>
        {this.props.texts.map(text => (
          <div key={text.id}>
            <Link to={`/text`}>
              <div>{text.name}</div>
            </Link>
            <div>{text.chronology}</div>
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    texts: state.indexTexts // Mapping dello stato sulla prop Texts
  }
}

const Home = connect(mapStateToProps, {
  setTexts // ACTION CREATOR; una funzione che fa il dispatch di una action
})(HomeComponent); // Crea il componente Home

export default Home;
