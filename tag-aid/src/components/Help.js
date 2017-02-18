import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

const Help = () => {
  return (
    <Grid>
        <Row> {/* TEXT NAME */}
          <Col sm={12} md={8} mdOffset={2}>
            <h1>Help</h1>
            <p>The application is divided into two main areas. In the <a href="">homepage</a> it is possible to select a text among the ones
            contained in the repository and available as graphs.</p>
            <p>Once a text is selected, users will be presented with an interface making it possible to explore, filter and search for specific data, and compare witnesses.</p>
            <h2>Overview of the text interface</h2>
            <p>ABC DEF GHI</p>
            <h2>Graph area</h2>
            <p>ABC DEF GHI</p>
            <p>abc def ghi</p>
            <h2>Text area</h2>
            <p>ABC DEF GHI</p>
            <h2>Filters</h2>
            <p>ABC DEF GHI</p>
            <h2>Search</h2>
            <p>ABC DEF GHI</p>
            <h2>Visualization controls</h2>
            <p>ABC DEF GHI</p>
          </Col>
        </Row>
      </Grid>
  )
}

export default Help;
