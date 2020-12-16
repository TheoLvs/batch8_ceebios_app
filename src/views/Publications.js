import React from "react";
import { Badge,Collapse } from "shards-react";

import Publication from "./Publication";

import SAMPLEPUBS from "./ArticleSample.json";


const Publications = ({pubs}) => {

    return (
        <div className="science-publications">
        {
            pubs.map(el => {
                return <Publication 
                    title={el.title}
                    abstract={el.abstract}
                    tags={el.tags}
                    publisher={el.publisher}
                    year={el.publication_year}
                    url={el.url}
                    doi={el.doi}
                    species={el.dict_species}
                    authors={el.authors}
                    fields={el.scientific_fields}
                />
            })
        }
        </div>
    )
}

export default Publications;