import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getTexts } from '../actions'
import { Grid, Row, Col, Table } from 'react-bootstrap';

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
      <Grid>
          <Row> {/* TEXT NAME */}
            <Col sm={12} md={10} mdOffset={1}>
              <p className="welcome">Welcome to TAG-AID</p>
              <p className="welcome-sub">Please select the text you want to explore.<br/> If you need instructions on using the system, visit the <Link to="/help">help</Link> section.<br/>More on the project in the <Link to="/about">about</Link> section.</p>
              <Table responsive>
                <thead>
                  <tr>
                    <th></th>
                    <th>Text name</th>
                    <th>Owner</th>
                    <th>Primary language</th>
                    <th>Nodes</th>
                    <th>Witnesses</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {texts.map((text,index) => (
                    <tr key={text.id}>
                      <td>{index+1}</td>
                      <td className="text-name-home">{text.name}</td>
                      <td>{text.owner}</td>
                      <td>{text.language}</td>
                      <td>{text.max_rank}</td>
                      <td></td>
                      <td className="text-view">
                        <Link to={`/text/${text.id}`}>
                          <span>View this text</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
      </Grid>
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
