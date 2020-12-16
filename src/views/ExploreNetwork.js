import React, { useState, useEffect} from 'react';

// Cytoscape
// https://medium.com/better-programming/interactive-data-graphing-in-react-95d7963247ff
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from "cytoscape";
import COSEBilkent from 'cytoscape-cose-bilkent';
import DagreLayout from 'cytoscape-dagre';
import ColaLayout from 'cytoscape-cola';

import './Explore.css'

var _ = require('lodash')
var qs = require("qs")

// https://designrevision.com/docs/shards-react/getting-started

Cytoscape.use(COSEBilkent);
Cytoscape.use(DagreLayout);
Cytoscape.use(ColaLayout);


const COLORS = {
  SPECIES:"#fb2056",
  GENUS:"#fc8f5b",
  FAMILY:"#ffd055",
  ORDER:"#8dd58c",
  CLASS:"#38c9b1",
  PHYLUM:"#1798c3",
  KINGDOM:"#182573",
}


const LAYOUTOPTIONS = {
  "cola":{animate:true},
  "cose-bilkent":{animate:true},
  "dagre":{rankDir:"LR",animate:true,nodeDimensionsIncludeLabels: true},
}


export default class Network extends React.Component {


  componentDidMount = () => {
    this.setState({
      w: window.innerWidth,
      h:window.innerHeight,
      data:this.props.data,
    })
    this.setUpListeners()
  }


  componentDidUpdate = () => {
    this.changeLayout(this.props.layout)
  }


  changeLayout = (layout) => {


    this.cy.layout({ name: layout,...LAYOUTOPTIONS[layout]}).run() // grid,circle,random,concentric,breadthfirst,dagre,cola
  }

  // componentDidUpdate = () => {
  //   this.setState({
  //     layout:this.props.layout
  //   })
  // }

  setUpListeners = () => {
    this.cy.on('click', 'node', (event) => {
      this.props.onClick(event.target._private.data["label"])
    //   console.log(event.target)
    })
  }

  render() {
    const layout = {name: 'random'}

    // console.log(this.props.data)

    // let img = "https://live.staticflickr.com/7272/7633179468_3e19e45a0c_b.jpg";
    let img = "https://dogtime.com/assets/uploads/gallery/samoyed-dogs-and-puppies/samoyed-dogs-puppies-1.jpg"

    return (<CytoscapeComponent 
      cy={(cy) => { 
        this.cy = cy;
        // https://blog.js.cytoscape.org/2020/05/11/layouts/
        cy.layout({ name: this.props.layout,...LAYOUTOPTIONS[this.props.layout]}).run() // grid,circle,random,concentric,breadthfirst,dagre,cola
      }}
      elements={CytoscapeComponent.normalizeElements(this.props.data)}
      style={ { width: '100%', height: 'calc(100vh - 190px)' } } 
      stylesheet={[
        {
          selector: 'node',
          style: {width: 40,height: 40,shape: 'ellipse',label: 'data(id)'}
        },
        {
          selector: 'node[img]',
          style: {'background-image':'data(img)','background-fit': 'cover',"border-width":3}//"https://live.staticflickr.com/7272/7633179468_3e19e45a0c_b.jpg"}
        },  
        {
          selector: 'node[rank="SPECIES"]',
          style: {'background-color': '#fb2056',"border-color":'#fb2056'}//"https://live.staticflickr.com/7272/7633179468_3e19e45a0c_b.jpg"}
        },  
        {
          selector: 'node[rank="GENUS"]',
          style: {'background-color': '#fc8f5b','border-color': '#fc8f5b'}
        },  
        {
          selector: 'node[rank="FAMILY"]',
          style: {'background-color': '#ffd055','border-color': '#ffd055'}
        },  
        {
          selector: 'node[rank="ORDER"]',
          style: {'background-color': '#8dd58c','border-color': '#8dd58c'}
        },  
        {
          selector: 'node[rank="CLASS"]',
          style: {'background-color': '#38c9b1'}
        },  
        {
          selector: 'node[rank="PHYLUM"]',
          style: {'background-color': '#1798c3'}
        },  
        {
          selector: 'node[rank="KINGDOM"]',
          style: {shape: 'rectangle','background-color': '#182573'}
        }, 
        {
          selector: 'edge',
          style: {
            width:1,
          }
        },  
      ]}
      />);
  }
}
