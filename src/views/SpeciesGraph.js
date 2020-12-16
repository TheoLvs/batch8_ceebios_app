
const COLORS = {
    SPECIES:"#fb2056",
    GENUS:"#fc8f5b",
    FAMILY:"#ffd055",
    ORDER:"#8dd58c",
    CLASS:"#38c9b1",
    PHYLUM:"#1798c3",
    KINGDOM:"#182573",
  }

export default class SpeciesGraph{
    constructor(){
      this.nodes = {}
      this.edges = {}
      this.hierarchy = ["kingdom","phylum","class","order","family","genus","species"]
    }
  
    addNode(id,meta={},override=false){
        if (!(id in this.nodes) || override === true){

            if (id !== undefined){
                this.nodes[id] = {
                    id:id,
                    label:id,
                    meta:meta,
                    rank:meta.rank !== undefined ? meta.rank.toUpperCase() : "UNKNOWN",
                }
            }
        }
    }
  
    addEdge(source,target,meta={}){
        if (source !== undefined && target !== undefined){
            let id = source + "->" + target;
            if (!(id in this.edges)){
                this.addNode(source)
                this.addNode(target)
                this.edges[id] = {source:source,target:target,label:id,meta:meta}
            }
        }
    }


    addNodes(nodes){
        nodes.forEach(el => {
            if (typeof el === "string"){
                this.addNode(el)
            } else {
                this.addNode(...el)
            }
        })
    }

    addOneSpeciesSearchGBIF(el){
        if (el["rank"] === "SPECIES"){
            this.addNode(el.canonicalName,el)
            this.addNode(el["genus"],{rank:"genus",key:el["genusKey"]})
            this.addEdge(el.canonicalName,el["genus"])
        }

        for (let i = 0;i<this.hierarchy.length-1;i++){
            let rank = this.hierarchy[i];
            this.addNode(el[rank],{rank:rank,key:el[rank+"Key"]})
        }
        for (let i = 0;i<this.hierarchy.length-2;i++){
            let rank = this.hierarchy[i];
            let subRank = this.hierarchy[i+1];
            this.addEdge(el[rank],el[subRank])
        }
    }

    addSpeciesSearchGBIF(data){
        data.forEach(el => {
            this.addOneSpeciesSearchGBIF(el);
        })
    }

  
    toJson(){
      return {
        nodes:Object.values(this.nodes).map(el => ({data:el})),
        edges:Object.values(this.edges).map(el => ({data:el})),
      }
    }

    getFromName(name){
        let nodeData = this.nodes[name]
        let rank = nodeData.rank.toUpperCase()

        return {
            name:name,
            rank:rank,
            rankColor:COLORS[rank],
            key:nodeData.meta["key"],
        }
    }


    getFromKey(key){
    }


    setProperty(name,key,value){
        this.nodes[name]["meta"][key] = value
    }


    setImage(name,src){
        this.nodes[name]["img"] = src
    }

    getProperty(name,key){
        return this.nodes[name]["meta"][key]
    }


  }