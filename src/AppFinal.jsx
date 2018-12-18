import React from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';
import {Menu,Dimmer,Loader,Segment} from 'semantic-ui-react'; 
import PlotComponent from './plot';
import shortid from "shortid";
import {findMin} from './AppService'
import findMax from './AppService';

class AppFinal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x:[],
      y:[],
      data:[],  
      cellNames: [],
      contourCellNames: [],
      individual: 'Collaspe Individual Traces',
      max_x: '',
      maxy:'',
      miny:'',
      contourX:[],
      contourY:[],
      contourData:[],
      contourHighlight:[]
    };

    this.addComponent = this.addComponent.bind(this);
    this.handleIndividual = this.handleIndividual.bind(this);
    this.getFigureData = this.getFigureData.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //Load data from json files and set state varibles
  componentDidMount(){ 
    //TRACE DATA  
    var x = [], y = [],cellNames, colors,max_x,contourTraces=[],traces=[];    
    //load individuial data file
    Plotly.d3.json(this.props.dataFile, function(data){
      max_x=Plotly.d3.max(Plotly.d3.values(data.t))
      cellNames=Object.keys(data.traces) //extract the number of object keys in data, each object key is cellName
      x=data.t;
      for(var i=0;i<cellNames.length;i++){
        y[i]=data.traces[cellNames[i]];
      }
    });
    //because of asynchronity use setTimeout, individual trace data
    setTimeout(() => {
      this.setState({x:x,y:[...y],max_x:max_x})
      colors = ['#9CADFF', '#26AAE1', '#F9439E', '#DDA824', '#F9ED32', '#87C635', '#00BCA5', '#EA68D1', '#F42C52', '#AE95F9']
      var colorsBase = ['#9CADFF', '#26AAE1',  '#F9439E', '#DDA824', '#F9ED32', '#87C635', '#00BCA5', '#EA68D1', '#F42C52', '#AE95F9']
      var colorsNewLength=colors.length;
      var count=0;

      //list of cellnames is json files, length of this varible is the number of cells aka the number of traces needed
      this.setState({cellNames:cellNames},() => {
        //Allow individual trace colors to repeat
        while(colorsNewLength<this.state.cellNames.length){
          colorsNewLength=colorsNewLength*2;
          count++
        }
        for(var q=0;q<count;q++){
          colors.push(...colorsBase)
        }

        for (var i = 0; i < this.state.cellNames.length; i++) {
          //array of all the traces
          traces.push({
            x: this.state.x, //all traces have the same time scale (x values)
            y: this.state.y[i],
            type: 'scatter', //vs. scattergl (if scattergl is used then you can only have about 6-8 plots at a time otherwise you get error about to many active webgl contexts)
            mode: 'lines',
            line: {width: 1.5},
            name: this.state.cellNames[i], //trace name is cellName
            color: colors[i], //each trace has unique colour
            bgColor: 'white'
          })
        }
      })
      this.setState({data: traces},()=>{
        this.setState({maxy:findMax(this.state.data,this.state.data.length)});
        this.setState({miny:findMin(this.state.data,this.state.data.length)});
      })
    },400) 

    //CONTOUR DATA
    var contourX = [], contourY = [],contourCellNames;
    //load contour data file 
    Plotly.d3.json(this.props.contourFile, function(data){
      contourCellNames=Object.keys(data) //extract the object keys in data, each object key is cellName
      for ( var i = 0; i < contourCellNames.length ; i++) {
        if(!contourX[i]){
          contourX[i] = []
        }
        if(!contourY[i]){
          contourY[i] = []
        }
        for ( var j = 0; j < data[contourCellNames[i]].length; j++){
          contourY[i][j] = data[contourCellNames[i]][j][1]
          contourX[i].push(data[contourCellNames[i]][j][0])
        }
      }
    });
    //because of asynchronity use setTimeout, contour plot data
    setTimeout(() => {
      this.setState({contourX:contourX,contourY:contourY,contourCellNames:contourCellNames},()=>{
        //create array of all the contour traces, each contour is a seperate trace
        for (var i = 0; i < this.state.cellNames.length; i++) {
          contourTraces.push({
            x: this.state.contourX[i],
            y: this.state.contourY[i],
            type: 'scatter',
            mode: 'lines',
            fill: 'toself',
            line: {width: 1.5},
            name: this.state.cellNames[i], //trace name is cellName
          })
        }
      })
      this.setState({contourData: contourTraces},()=>{
        //used for highlighting contours when clicked
        window.contourHighlight=[]
        for(var t=0;t<this.state.contourData.length;t++){
          window.contourHighlight[t]='off' //all contours start off unclicked i.e. off
        }
      })    
    },400)   
  }

  componentWillUnmount() {
   //Clean up Plotly instances when component is about to unmount
   Plotly.purge('contourPlot')
   for(var t=0;t<this.state.data.length;t++){
     var traceDivName=this.state.contourCellNames[t]
     Plotly.purge(traceDivName)
   }
  }

  //dynamically render PlotComponent
  addComponent(data) {
    return <PlotComponent bgColor={data.bgColor} miny={this.state.miny} maxy={this.state.maxy} max_x={this.state.max_x} key={shortid.generate()} color={data.color} title={data.name} data={data} divId={data.name}/>;
  }

  addComponents(plots){
    return plots.map(this.addComponent);
  }

  //handle hiding and showing of traces
  handleIndividual(){
    if(this.state.individual==='Plot Individual Traces'){
      //document.getElementById('contourPlot').style.width='50%'
      window.contourHighlight.fill('off') //if individual traces are hidden, reset contourHighlights to off
      document.getElementById("myDiv").style.display = "inline"; 
      this.setState({individual: 'Collaspe Individual Traces'})
    }
    else{
     // document.getElementById('contourPlot').style.width='100%'
      document.getElementById("myDiv").style.display = "none";
      this.setState({individual: 'Plot Individual Traces'})
    }
  }

  getFigureData() {
    var gd = document.getElementById('contourPlot')
    console.log('data',gd)
    console.log('data',gd.layout)
  }

  //handle what happens when a contour is clicked
  handleClick(e){
    var cell=e.points[0].data.name; //name of cell selected
    var containingDiv = document.getElementById("myDiv"); //div containing individual traces
    var element=containingDiv.querySelector('#'+CSS.escape(cell)); 
    var etop=element.offsetTop //position of the element w.r.t. top of page
    var traceNumber=e.points[0].curveNumber //number of the trace selected

    //if traces are displayed
    if(this.state.individual==='Collaspe Individual Traces'){
      var updateHighlight = {
        plot_bgcolor:'#dedfe0',
      };

      var updateNoHighlight = {
        plot_bgcolor:'white',
      };

      containingDiv.scrollTop = etop //scroll to selected contour div
      
      //if trace is unselected, highlight plot corresponding to that trace
      if(window.contourHighlight[traceNumber]==='off'){
        Plotly.relayout(element, updateHighlight,0)
        window.contourHighlight[traceNumber]='on'
      }
      //if trace is already selected, unhighlight it
      else{
        Plotly.relayout(element, updateNoHighlight,0)
        window.contourHighlight[traceNumber]='off'
      }
    }
  }

  render() {
    //if data has been loaded
    if(this.state.contourData.length!==0){
      return(
        <div>
          <Menu borderless fixed='top'>
            <Menu.Item onClick={this.getFigureData}>Get Figure Data</Menu.Item>
            <Menu.Item onClick={this.handleIndividual} content={this.state.individual}/>
          </Menu>
          <br/>
          <br/> 
          <div>
            <Plot
              divId='contourPlot'
              onClick={this.handleClick}
              data={[
                ...this.state.contourData
              ]}
              style={{width: '50%', float: 'left'}}
              layout={{hovermode:'closest', height:window.innerHeight-50 , autosize:'true', title: 'Contour Plot',titlefont: {size: 15,color: 'white'}, colorway : ['#9CADFF', '#26AAE1', '#F9439E', '#DDA824', '#F9ED32', '#87C635', '#00BCA5', '#EA68D1', '#F42C52', '#AE95F9'], showlegend: true, xaxis:{title:'',range: [0, 601],titlefont: {size: 15,color: 'white'}}, yaxis:{title:'', titlefont: {size: 15,color: 'white'},range: [0, 600]}}}
              config={{displaylogo: false,displayModeBar: false}}
              useResizeHandler={true}
            />
          </div>
          <div id="myDiv" style={{ position:'fixed', display:'inline', float:'right',width:'50%',height:window.innerHeight-50, overflow:'auto', backgroundColor:"white"}}>
            {this.addComponents(this.state.data)}
          </div>
        </div>
      )
    }
    //if data is not yet ready
    else{
      return(
        <div>
          <Segment style={{height:window.innerHeight}}>
            <Dimmer active>
              <Loader content='Loading' />
            </Dimmer>
          </Segment>
        </div>  
      )
    }
  }  
}

export default AppFinal;