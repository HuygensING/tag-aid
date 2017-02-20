import React from 'react';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import textSankey from "../images/textSankey.png";

const About = () => {
  return (
    <Grid>
        <Row> {/* TEXT NAME */}
          <Col sm={12} md={8} mdOffset={2}>
              <h1>About</h1>
              <p>TAG-AID is a project for the development of a scalable and intuitive graphical interface enabling the interaction with graph models of texts.</p>
              <p>The project was inspired by research on <strong>variant graphs</strong> that were first introduced by <a href="http://www.sciencedirect.com/science/article/pii/S1071581909000214">Schmidt and Colomb (2009)</a> to
              solve &ldquo;the problem of how to represent overlapping structures arising from different markup perspectives (‘overlapping hierarchies’) or from different versions of the same work (‘textual variation’)&rdquo;. This problem is particularly relevant in the context of <strong>textual criticism and collation</strong>, where specific libraries and interfaces exploring the ideas of variant graphs have been already developed, such as <a href="http://www.traviz.vizcovery.org/">TRAViz</a>.</p>

              <p>Our effort aims to improve the ways we visually represent and interact with this kind of information, supporting the possibility to searching, filter and compare data in easy ways. A first proof of concept was developed during a <a href="http://huygensing.github.io/tag-aid-poc/"><strong>design sprint</strong></a>, and it is the basis of the new system made in collaboration between <a href="https://www.huygens.knaw.nl/?lang=en">Huygens-ING</a>, <a href="http://www.glaucomantegari.com">Glauco Mantegari</a>,
              and <a href="https://www.inmagik.com/">Inmagik</a>.</p>
              <h2>The visual model</h2>
              <p>Crucial to our work has been the definition of key requirements for the visual model:</p>
                <ul>
                  <li>See the general scenario and the details of witnesses using the same model</li>
                  <li>Understand the paths connected to the majority of witnesses</li>
                  <li>Understand the weight of nodes based on their frequency in a specific position, and the weight of edges in an easy way</li>
                  <li>Compare the differences both between specific witnesses and the majority</li>
                  <li>Design a light visual model where the details can be activated at need to improve readability and browsing</li>
                </ul>
              <p>The solution we explored is based on <a href="https://en.wikipedia.org/wiki/Sankey_diagram">Sankey diagrams</a>, which allow to effectively visualize flows (connections) and their intensity in acyclic directed graphs.</p>
              <figure id="fig. 1"><img src={textSankey} alt="A Sankey diagram showing the sequence of a text according to different witnesses." />
                  <figcaption><strong>Figure 1.</strong> A Sankey diagram showing the sequence of a short text according to different witnesses.</figcaption>
              </figure>
              <p>Each bar in the diagram represents a <strong>node</strong>; the height of the bar is proportional to the number of instances of that node. In our case the height is the number of witnesses containing that word in that position. The height of the <strong>edges</strong> connecting the nodes left to right shows which are the most attested and least attested paths in the variations of the text.</p>
              <p>For example, fig. 1 represents a simple sequence of nodes starting from &ldquo;Verbum&rdquo; and ending in &ldquo;facta.&rdquo;. From the diagram we can easily see that:</p>
              <ul>
                <li>All the witnesses follow the sequence &ldquo;Verbum&rdquo; > &ldquo;Ista&rdquo; > &ldquo;sequencia&rdquo;</li>
                <li>From &ldquo;sequencia&rdquo; the majority follows the path &ldquo;sequencia&rdquo; > &ldquo;due&rdquo; > &ldquo;de&rdquo;</li>
                <li>From &ldquo;sequencia&rdquo; a few follow the path &ldquo;sequencia&rdquo; > &ldquo;ecclesia&rdquo; > &ldquo;de&rdquo;</li>
              </ul>
              <h2>The technologies</h2>
              <p>At the current state of development, the front-end of TAG-AID is based on:</p>
              <ul>
                <li><strong><a href="https://facebook.github.io/react/">React</a></strong> for the general implementation of the user interface</li>
                <li><strong><a href="https://github.com/reactjs/react-redux">React-Redux</a></strong> for containing and managing states</li>
                <li><strong><a href="https://github.com/redux-saga/redux-saga">Redux-Saga</a></strong> for managing side effects</li>
                <li><strong><a href="https://d3js.org/">D3.js</a></strong> for the visualization of the Sankey diagrams</li>
                <li><strong><a href="https://react-bootstrap.github.io/">React-Bootstrap</a></strong> for the general layout</li>
              </ul>
          </Col>
        </Row>
      </Grid>
  )
}

export default About;
