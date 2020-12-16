import React from "react";
import { Button,Badge,Collapse } from "shards-react";
import Highlighter from "react-highlight-words";

import "./Publications.css"


const Publication = ({title,abstract,tags,year,publisher,authors,fields,url,doi,species}) => {

    const [open,setOpen] = React.useState(false);

    return (
        <div className="science-publication">
            <h5><a href={url} target="_blank" rel="noopener noreferrer">{title}</a></h5>
            <p className="pub-subtitle">
                <i>{year}</i> - {fields.join(", ")} - <b>{publisher}</b> - <a className="pub-more" onClick={() => setOpen(!open)}>{open? "Close":"More"}</a>
                {/* <Button className="button-more button-collapse" onClick={() => setOpen(!open)}>+</Button> */}
                {/* {fields.map(el => (<Badge className="badge-field">{el}</Badge>))} */}
            </p>
            <p className="pub-abstract">
                {open || abstract.slice(0,200)+" ..."}
            </p>
            <Collapse open={open}>
                <p className="pub-abstract">
                    <Highlighter
                        highlightClassName="pub-highlight-tags"
                        searchWords={species.map(el => el.canonical_name)}
                        autoEscape={true}
                        textToHighlight={abstract}
                    />,

                </p>
                {/* <p className="pub-doi"><a href={url} ref="_noopener" target="_blank">{doi}</a></p> */}
            </Collapse>
        </div>
    )
}

export default Publication;