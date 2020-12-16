import React from "react";
import { Badge,Collapse } from "shards-react";


const TitleCard = ({nodeFocus,G}) => {

    if (nodeFocus === ""){
        return "";
    } else {
        let {rank,rankColor,key} = G.getFromName(nodeFocus)

        return (
            <div>
                <h5><b>{nodeFocus}</b> - {key} - <span><Badge style={{backgroundColor:rankColor,fontSize:12}}>{rank}</Badge></span></h5>
            </div>
        )

    }
}

export default TitleCard;