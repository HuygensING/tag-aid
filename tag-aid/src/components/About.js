import React from 'react';
import { Grid, Row, Col, Image } from 'react-bootstrap';

const About = () => {
  return (
    <Grid>
        <Row> {/* TEXT NAME */}
          <Col sm={12} md={8} mdOffset={2}>
              <h1>About</h1>
              <p>TAG-AID is a project for the development of a scalable and intuitive graphical interface enabling the interaction with graph models of texts.</p>
              <p>The project was inspired by research on variant graphs XXXXXX. During a <a href="http://huygensing.github.io/tag-aid-poc/">design sprint</a>, a proof-of-concept system for visualizing and interacting with information coming from different witnesses of a text was developed,
              exploring ways of presenting variations and providing useful context for the study of the text's transmission</p>
              <p>The new TAG-AID interface is made in collaboration between <a href="https://www.huygens.knaw.nl/?lang=en">Huygens-ING</a>, <a href="http://www.glaucomantegari.com">Glauco Mantegari</a>,
              and <a href="https://www.inmagik.com/">Inmagik</a>.</p>
              <h2>The visual model</h2>
              <p>The main requirements we have identified for the view were:</p>
                <ul>
                  <li>See the general scenario as well as the details of specific witnesses using the same visual model Understand the paths of the majority of witnesses</li>
                  <li>Understand the relative weight of tokens based on their frequency in a specific position Understand the relative weight of sequences (token > token)</li>
                  <li>Compare where specific witnesses differ one from the other and from the majority</li>
                  <li>Have a light visual model where the details can be activated/deactivated at need to improve readability and browsing</li>
                </ul>
              <p>The solution we explored is based on <a href="https://en.wikipedia.org/wiki/Sankey_diagram">Sankey diagrams</a>. This kind of diagram allows to visualize flows and their intensity in effective ways.
              The following image represents a few nodes and their quantified connections.</p>
              <figure>
                <img src="http://2.bp.blogspot.com/-PjsOnlKGgq8/USSJN84rD0I/AAAAAAAAAGQ/jsF8CQIFZA0/s1600/sankey04.png" responsive/>
                <figcaption>An example of a simple Sankey diagram. <a href="http://2.bp.blogspot.com/-PjsOnlKGgq8/USSJN84rD0I/AAAAAAAAAGQ/jsF8CQIFZA0/s1600/sankey04.png">Source</a>.</figcaption>
              </figure>
              <p>Each bar of the diagram corresponds to a node. The height of the bar is proportional to the number of instances of that node, in our case the number of witnesses containing that word in that position.
              The edges connect the lines in a flow, showing how many words forming a specific node are sequentially followed by a certain number of words in the next node.</p>
              <p>The example in the following image represents a sequence of nodes starting from “Verbum” and ending in “facta.”.
              From the diagram we can see e.g. that:</p>
              <ul>
                <li>All the witnesses follow the sequence "Verbum > Ista > sequencia</li>
                <li>From “sequencia”:</li>
                <ul>
                  <li>The majority follows the path sequencia > due > de</li>
                  <li>A few follow the path sequencia > ecclesia > de</li>
                </ul>
              </ul>
              <figure>
                <img src="" responsive/>
                <figcaption>An example of a Sankey diagram from TAG-AID with a short sequence of a text and its variations.</figcaption>
              </figure>
              <h2>The technologies</h2>
              <p>abc def ghi.</p>
          </Col>
        </Row>
      </Grid>
  )
}

export default About;
