import React, { useState, useEffect} from 'react';
import { Container, Row, Col } from "shards-react";
import { Card, CardBody} from "shards-react";
import { Button, ButtonGroup,ButtonToolbar } from "shards-react";
import { Badge,Collapse } from "shards-react";

// Icons
import { ImTree } from 'react-icons/im';
import { VscDebugRestart } from 'react-icons/vsc'
import { BiNetworkChart,BiVector } from 'react-icons/bi'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs';
import { BiLinkExternal } from 'react-icons/bi';
import { ImEarth } from 'react-icons/im';
import { BsLayoutTextSidebarReverse } from 'react-icons/bs';
// Carousel
import Carousel from 'react-elastic-carousel'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// https://reacttraining.com/blog/react-router-v5-1/#useroutematch
import { useHistory,useLocation,useParams } from 'react-router-dom';

import SpeciesGraph from "./SpeciesGraph";
import Network from "./ExploreNetwork";
import MapView from "./Map";
import TitleCard from "./TitleCard";
import Publications from "./Publications"


import './Explore.css'

var _ = require('lodash')
var qs = require("qs")
const axios = require('axios');
const cheerio = require('cheerio');


const scrapWikipediaDescription = async (species) => {
  try {
		const { data } = await axios.get(`https://en.wikipedia.org/wiki/${encodeURI(species)}`);
		const $ = cheerio.load(data);
		const wiki = [];

		$('div.mw-parser-output').find("span.mw-headline,p").each((_idx, el) => {
      let content = $(el)
      let text = content.text()
      if (text.length > 2){
        wiki.push({
          text:content.text(),
          tag:content[0].name,
        })
      }

    });
    
    console.log(wiki)
		return wiki;
	} catch (error) {
		throw error;
	}
}


const COLORS = {
  SPECIES:"#fb2056",
  GENUS:"#fc8f5b",
  FAMILY:"#ffd055",
  ORDER:"#8dd58c",
  CLASS:"#38c9b1",
  PHYLUM:"#1798c3",
  KINGDOM:"#182573",
}


const SmartLinks = ({key,nodeFocus}) => {
  return (
    <div>
    <h5>Smart links</h5>
    <h5 className="card-text-subtitle">Learn more about the species</h5>
    <ul>
      <li><a href={`https://www.gbif.org/fr/species/${key}`} target="_blank" rel="noopener noreferrer">Open GBIF Page</a></li>
      <li><a href={`https://www.gbif.org/fr/occurrence/gallery?taxon_key=${key}`} target="_blank" rel="noopener noreferrer">See images on GBIF</a></li>
      <li><a href={`https://en.wikipedia.org/wiki/${encodeURI(nodeFocus)}`} target="_blank" rel="noopener noreferrer">Search on Wikipedia</a></li>
      <li><a href={`https://www.youtube.com/results?search_query=${encodeURI(nodeFocus)}`} target="_blank" rel="noopener noreferrer">Search on Youtube</a></li>
    </ul>
    <h5 className="card-text-subtitle">Find scientific publications on the species</h5>
    <ul>
      <li><a href={`https://scholar.google.com/scholar?q=${encodeURI(nodeFocus)}`} target="_blank" rel="noopener noreferrer">Search on Google Scholar</a></li>
      <li><a href={`https://www.semanticscholar.org/search?q=${encodeURI(nodeFocus)}`} target="_blank" rel="noopener noreferrer">Search on Semantic Scholar</a></li>
      <li><a href={`https://academic.microsoft.com/search?${encodeURI(nodeFocus)}&f=&orderBy=0&skip=0&take=10`} target="_blank" rel="noopener noreferrer">Search on Microsoft Academic Portal</a></li>
    </ul>
    <h5 className="card-text-subtitle">Explore other interesting sources</h5>
    <ul>
      <li><a href={`https://www.onezoom.org/life.html`} target="_blank" rel="noopener noreferrer">OneZoom Tree Of Life</a></li>
      <li><a href={`https://eol.org/`} target="_blank" rel="noopener noreferrer">Encyclopedia Of Life</a></li>
      <li><a href={`https://www.bbcearth.com/`} target="_blank" rel="noopener noreferrer">BBC Earth</a></li>
    </ul>
  </div>
  )
}



const ExploreView = ({  }) => {


  // const G = new SpeciesGraph();

  const [G,setG] = useState(new SpeciesGraph())

  const [nodeFocus, setNodeFocus] = useState("");
  const [nodeData, setNodeData] = useState({});
  const [imagesSpecies, setImageSpecies] = useState([]);
  const [graphData, setGraphData] = useState({nodes:[],edges:[]});
  const [graphLayout, setGraphLayout] = useState("cola"); // grid,circle,random,concentric,breadthfirst,dagre,cola
  const [wikiDescription,setWikiDescription] = useState([]);
  const [wikiCollapse,setWikiCollapse] = useState(false);
  const [pubs,setPubs] = useState([]);


  let key;

  let {search} = useLocation()


  const handleSearchGBIF = (species) => {

    fetch(`https://api.gbif.org/v1/species/search?q=${encodeURI(species)}`)
      .then(results => results.json())
      .then(data => {
        let res = data.results.filter(el => el.rank !== "SUBSPECIES" && el.rank !== "VARIETY" && el.rank !== undefined && !("taxonID" in el) && !("nubKey" in el))
        res = _.uniqBy(res,"canonicalName")
        G.addSpeciesSearchGBIF(res);
        handleUpdateGraph(G);


      });

    // fetch(`https://api.gbif.org/v1/species/match?q=${encodeURI(species)}`)
    //   .then(results => results.json())
    //   .then(data => {
    //     let res = data.results.filter(el => el.rank !== "SUBSPECIES" && el.rank !== "VARIETY" && el.rank !== undefined && !("taxonID" in el) && !("nubKey" in el))
    //     res = _.uniqBy(res,"canonicalName")
    //     G.addSpeciesSearchGBIF(res);
    //     handleUpdateGraph(G);
    // });


    fetch(`https://api.gbif.org/v1/species/search?q=${encodeURI(species)}&qField=VERNACULAR`)
      .then(results => results.json())
      .then(data => {
        let res = data.results.filter(el => el.rank !== "SUBSPECIES" && el.rank !== "VARIETY" && el.rank !== undefined && !("taxonID" in el) && !("nubKey" in el))
        res = _.uniqBy(res,"canonicalName")
        G.addSpeciesSearchGBIF(res);
        handleUpdateGraph(G);
      });
  }


  const handleSearchPublications = (species) => {
    fetch(`http://165.22.121.95/documents/search/${encodeURI(species)}`)
    .then(results => results.json())
    .then(data => {
      setPubs(data);
    });
  }

  const handleUpdateGraph = (G) => {
    setG(G);
    setGraphData(G.toJson());
  }


  const handleSearchWikipedia = (species) => {

    scrapWikipediaDescription(species).then(results => {
      setWikiDescription(results)
    })

  }


  const fetchImagesGBIF = (key) => {

    // var headers = new Headers();
    // var init = { 
    //   method: 'GET',
    //   headers: headers,
    //   mode: 'no-cors',
    //   cache: 'default'
    // };

    if (key !== undefined){

      // Get interal state if already fetched
      let images = G.getProperty(nodeFocus,"img");

      // Fetch GBIF if no images is already stored as state 
      if (images === undefined){

        fetch(`https://api.gbif.org/v1/occurrence/search?limit=5&media_type=stillImage&taxon_key=${key}`)//,init)
        .then(results => results.json())
        .then(data => {

          // Parse result and store as state
          let images = data.results.map(el => el["media"][0]["identifier"])
          setImageSpecies(images);
          
          // Set property images
          G.setProperty(nodeFocus,"img",images)

          // var img = new Image();
          // img.src = images[0].split("?")[0]
          // img.crossOrigin = null

          G.setImage(nodeFocus,images[1])
          handleUpdateGraph(G);
        });

      // Just retrieve internal images
      } else {
        setImageSpecies(images);
      }

    }

  }

  const fetchSpeciesInfo = (key) => {
    if (key !== undefined){
      fetch(`https://api.gbif.org/v1/species/${key}`)
      .then(results => results.json())
      .then(data => {
        let numDescendants = data["numDescendants"]
        setNodeData({
          numDescendants:numDescendants
        })
      });
    }

  }

  const handleAddChildren = (name,limit=5) => {

    if (name !== ""){
    let {key} = G.getFromName(name)
      fetch(`https://api.gbif.org/v1/species/${key}/children?limit=${limit}`)
      .then(results => results.json())
      .then(data => {
        G.addSpeciesSearchGBIF(data.results)
        handleUpdateGraph(G);
      });
    }

  }


  const handleResetGraph = () => {
    setNodeFocus("")
    setNodeData({})
    setImageSpecies([])
    setWikiDescription([])
    let newG = new SpeciesGraph();
    handleUpdateGraph(newG);
  }


  React.useEffect(() => {
    // This effect uses the `value` variable,
    // so it "depends on" `value`.
    // handleSearchGBIF("vespa ducalis");
    // handleSearchGBIF("ailurus fulgens");
    // handleSearchGBIF("blue whale");
    let searchValue = qs.parse(search)["?q"]
    if (searchValue !== undefined){
      handleSearchGBIF(searchValue);
    }
  }, [search])  // pass `value` as a dependency


  React.useEffect(() => {
    if (nodeFocus !== ""){
      setImageSpecies([])
      let {rank,rankColor,key} = G.getFromName(nodeFocus)
      fetchSpeciesInfo(key)
      handleSearchWikipedia(nodeFocus)
      handleSearchPublications(nodeFocus)

      if (rank === "SPECIES" || rank === "GENUS" || rank == "FAMILY" || rank == "ORDER"){
        fetchImagesGBIF(key)
      }
    }
  }, [nodeFocus])  // pass `value` as a dependency



  const handleChangeLayout = (layout) => {
    setGraphLayout(layout);
  }


  const handleSearchCOREAC = (name) => {

  }


  let cardContent;
  let carousel
  let rank,rankColor


  // NODE FOCUS
  if (nodeFocus !== ""){

    let {rank,rankColor,key} = G.getFromName(nodeFocus)

    if (rank === "SPECIES" || rank === "GENUS" || rank == "FAMILY" || rank == "ORDER"){
      carousel = (
        <div className="div-carousel">
        <Carousel itemsToShow={2} itemsToScroll={2} enableAutoPlay autoPlaySpeed={3000}>
          {imagesSpecies.map(el => {
            return (<img src={el} className="img-carousel"/>)
          })}
        </Carousel>
      </div>
      )
    } else {
      carousel = ""
    }


    cardContent = (
      <div style={{paddingBottom:10}}>
        <TitleCard G={G} nodeFocus={nodeFocus}/>
        {carousel}
        <h5>Species Information</h5>
        <p><b>Number of children:</b> {nodeData["numDescendants"]}</p>
        <div className="wiki-description">
          {
            wikiDescription.slice(0,3).map(el => {
              if (el.tag == "span"){
                return <h5>{el.text}</h5>
              } else {
                return <p>{el.text}</p>
              }
            })
          }
          <Button className="button-collapse" onClick={() => setWikiCollapse(!wikiCollapse)}>More from Wikipedia</Button>
          <Collapse open={wikiCollapse}>
            <div className="wiki-collapse-description">
            {
              wikiDescription.slice(3).map(el => {
                if (el.tag == "span"){
                  return <h5>{el.text}</h5>
                } else {
                  return <p>{el.text}</p>
                }
              })
            }
            </div>
          </Collapse>
        </div>
      </div>
    )
  } else {
    cardContent = (
      <div>
      <h5><b>Explore species</b></h5>
      <p>In this view, you can explore all animal and plant species by searching using latin or vernacular name</p>
      <p>Click on the node to learn more about the species and get more in-depth information</p>
      </div>
    )
  }

  return (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    {/* <Row noGutters className="page-header py-4">
      <PageTitle title="Explore" subtitle="Explore species and learn everything about them" className="text-sm-left mb-3" />
    </Row> */}

    {/* Small Stats Blocks */}
    <Row className="py-4">
      <Col lg="6" md="12">
        <Row>
          <Network onClick={setNodeFocus} data={graphData} layout={graphLayout}/>
        </Row>
        <Row>
          <Col sm="12" lg="12" className="control-panel">
          {/* <p><Button }>Open children</Button></p>
        <p><Button onClick={() => handleSearchCOREAC(nodeFocus)}>Search scientific publications on CoreAC</Button></p>
        <p><Button onClick={() => fetchImagesGBIF(key)}>Add images</Button></p>
         */}
            <ButtonToolbar>
            <ButtonGroup className="controls-graph">
              <Button active={graphLayout==="cola"} onClick={() => handleChangeLayout("cola")}><BiNetworkChart/></Button>
              <Button active={graphLayout==="cose-bilkent"} onClick={() => handleChangeLayout("cose-bilkent")}><BiVector/></Button>
              <Button active={graphLayout==="dagre"}onClick={() => handleChangeLayout("dagre")}><ImTree/></Button>
              <Button onClick={() => handleResetGraph()}><VscDebugRestart/></Button>
            </ButtonGroup>
            <ButtonGroup className="controls-children">
              <Button disabled={nodeFocus===""} onClick={() => handleAddChildren(nodeFocus,5)}><AiOutlinePlusCircle/> Find 5 children</Button>
              <Button disabled={nodeFocus===""} onClick={() => handleAddChildren(nodeFocus,20)}><AiOutlinePlusCircle/> Find 20 children</Button>
            </ButtonGroup>
            {/* // <Button className="controls-children" disabled={nodeFocus===""} onClick={() => handleAddChildren(nodeFocus)}></Button> */}
            {/* <Button className="controls-children" disabled={nodeFocus===""} onClick={() => handleSearchWikipedia(nodeFocus)}><AiOutlinePlusCircle/> Search Wikipedia</Button> */}
            </ButtonToolbar>
          </Col>
        </Row>
      </Col>
      <Col lg="6" md="12">
        <Tabs>
          <TabList>
            <Tab><BsInfoCircle className="button-tabs"/><span>Info</span></Tab>
            <Tab><BiLinkExternal className="button-tabs"/><span>Smart Links</span></Tab>
            <Tab><ImEarth className="button-tabs"/><span>Maps</span></Tab>
            <Tab><BsLayoutTextSidebarReverse className="button-tabs"/><span>Publications</span><Badge pill theme="primary" className="mx-2">{pubs.length}</Badge></Tab>
          </TabList>

          <TabPanel>
            <Card className="card-info-species">
              <CardBody>
              {cardContent}
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="card-info-species">
                <CardBody>
                  <TitleCard G={G} nodeFocus={nodeFocus}/>
                  <SmartLinks key={key} nodeFocus={nodeFocus}/>
                </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="card-info-species">
                <CardBody>
                  <TitleCard G={G} nodeFocus={nodeFocus}/>
                  <MapView nodeFocus={nodeFocus} G={G}/>
                </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="card-info-species">
                <CardBody>
                  <TitleCard G={G} nodeFocus={nodeFocus}/>
                  <Publications pubs={pubs}/>
                </CardBody>
            </Card>
          </TabPanel>
        </Tabs>
        {/* <Card className="card-info-species">
          <CardBody>
          {cardContent}
          </CardBody>
        </Card> */}
      </Col>
    </Row>

  </Container>
)};

export default ExploreView;
