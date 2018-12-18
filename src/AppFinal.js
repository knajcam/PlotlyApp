import React from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';
import {Menu} from 'semantic-ui-react'; 
import PlotComponent from './plot.js';
import shortid from "shortid";

class AppFinal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x:[],
      y:[],
      data:[],  
      cellNames: [],
      individual: 'Collaspe Individual Traces',
      max: '',
      maxy:'',
      miny:'',
      contourX:[],
      contourY:[],
      contourData:[],
      contourHighlight:[]
    };

    this.addComponent = this.addComponent.bind(this);
    this.handleIndividual = this.handleIndividual.bind(this);
    this.findMax = this.findMax.bind(this);
    this.findMin = this.findMin.bind(this);
    this.contour = this.contour.bind(this); 
    this.getFigureData = this.getFigureData.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //Load data from json files and set state varibles
  componentDidMount(){   
    var x = [], y = [],cellNames, colors,max,contourTraces=[],traces=[];    
    Plotly.d3.json(this.props.dataFile, function(data){
      max=Plotly.d3.max(Plotly.d3.values(data.t))
      cellNames=Object.keys(data.traces) //extract the number of object keys in data, each object key is cellName
      x=data.t;
      for(var i=0;i<cellNames.length;i++){
        y[i]=data.traces[cellNames[i]]; //check syntax/form of y
      }
    });
    //because of asynchronity use setTime from(https://reactjs.org/docs/react-component.html#mounting-componentdidmount): If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval, or send AJAX requests, perform those operations in this method.
    //contour data
    setTimeout(() => {
      var x2 = [], y2 = []; 
      var cellNamesCopy=cellNames;  
      Plotly.d3.json(this.props.contourFile, function(data){
        for ( var i = 0; i < cellNamesCopy.length ; i++) {
          if(!x2[i]){
            x2[i] = []
          }
          if(!y2[i]){
            y2[i] = []
          }
          for ( var j = 0; j < data[cellNamesCopy[i]].length ; j++){
            y2[i][j] = data[cellNamesCopy[i]][j][1]
            x2[i].push(data[cellNamesCopy[i]][j][0])
          }
        }
      });
      setTimeout(() => {
        this.setState({contourX:x2,contourY:y2})
        this.setState({x:x,y:[...y],max:max})
        this.setState({cellNames:cellNames},() => {
          for (var i = 0; i < this.state.cellNames.length; i++) {
            //array of all the traces
            contourTraces.push({
              x: this.state.contourX[i], //all traces have the same time scale (x values)
              y: this.state.contourY[i],
              type: 'scatter', //vs. scattergl (if I use scattergl then I can only have about 6-8 plots at a time otherwise you get error about to many active webgl contexts)
              mode: 'lines',
              fill: 'toself',
              line: {width: 1.5},
              name: this.state.cellNames[i], //trace name is cellName
              bgColor: 'white'
            })
          }
        })
        this.setState({contourData: contourTraces})    
      },400)
      
      //for contourHighlighting
      setTimeout(() => {
        window.contourHighlight=[]
        var contourHighlight=[];
        for(var t=0;t<this.state.contourData.length;t++){
          window.contourHighlight[t]='off'
          contourHighlight[t]='off'
        }
        this.setState({contourHighlight: contourHighlight})
      },200)
      //this.contour()
    },400)

    //individual plot data
    setTimeout(() => {
      this.setState({x:x,y:[...y],max:max})
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
            type: 'scatter', //vs. scattergl (if scattergl is used then you can only have about 6-8 plots at a time other wise you get error about to many active webgl contexts)
            mode: 'lines',
            line: {width: 1.5},
            name: this.state.cellNames[i], //trace name is cellName
            color: colors[i], //each trace has unique colour
            bgColor: 'white'
          })
        }
      })
      this.setState({data: traces},()=>{
        this.findMax();
        this.findMin();
      })
    },200) 
  }

 contour(){
    var x = [], y = []; 
    var cellNamesCopy=this.state.cellNames;  

    Plotly.d3.json(this.props.contourFile, function(data){
      for ( var i = 0; i < cellNamesCopy.length ; i++) {
        if(!x[i]){
          x[i] = []
        }
        if(!y[i]){
          y[i] = []
        }
        for ( var j = 0; j < data[cellNamesCopy[i]].length ; j++){
          y[i][j] = data[cellNamesCopy[i]][j][1]
          x[i].push(data[cellNamesCopy[i]][j][0])
        }
      }
    });
    this.setState({contourX:x,contourY:y})
  }

  //find max y value for each trace, used for setting the scale of the individual plots
  findMax(){
    var maxy=[];
    for(var i=0;i<this.state.data.length;i++){
      maxy[i]=Math.max(...this.state.data[i].y)
    }
    this.setState({maxy:maxy})
  }

  //find min y value for each trace, used for setting the scale of the individual plots
  findMin(){
    var miny=[];
    for(var i=0;i<this.state.data.length;i++){
      miny[i]=Math.min(...this.state.data[i].y)
    }
    this.setState({miny:miny})
  }

  //dynamically render PlotComponent
  addComponent(data) {
    return <PlotComponent bgColor={data.bgColor} miny={this.state.miny} maxy={this.state.maxy} max={this.state.max} key={shortid.generate()} color={data.color} title={data.name} data={data} divId={data.name}/>;
  }

  addComponents(plots){
    return plots.map(this.addComponent);
  }

  //handle hiding and showing of individual traces
  handleIndividual(){
    if(this.state.individual==='Plot Individual Traces'){
      document.getElementById("myDiv").style.display = "inline"; 
      this.setState({individual: 'Collapse Individual Traces'})
    }
    else{
      document.getElementById("myDiv").style.display = "none";
      this.setState({individual: 'Plot Individual Traces'})
    }
  }

  getFigureData() {
    var gd = document.getElementById('contourPlot')
    console.log('data',gd)
    console.log('data',gd.layout)
  }

  //handle what happends when a contour is clicked on the main plot
  handleClick(e){
    var cell=e.points[0].data.name; //name of cell selected
    var containingDiv = document.getElementById("myDiv"); //div containing individual traces
    var element=containingDiv.querySelector('#'+CSS.escape(cell)); 
    var etop=element.offsetTop //position of the element w.r.t. top of page
    var traceNumber=e.points[0].curveNumber //number of the trace selected
    
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
              layout={{hovermode:'closest', height:window.innerHeight , autosize:'true', plot_bgcolor:'white', paper_bgcolor:"white", title: 'Contour Plot',titlefont: {size: 15,color: 'white'}, colorway : ['#9CADFF', '#26AAE1', '#F9439E', '#DDA824', '#F9ED32', '#87C635', '#00BCA5', '#EA68D1', '#F42C52', '#AE95F9'], showlegend: true, xaxis:{title:'',range: [0, 601],titlefont: {size: 15,color: 'white'}}, yaxis:{title:'', titlefont: {size: 15,color: 'white'},range: [0, 600]}}}
              config={{displaylogo: false,displayModeBar: false}}
              useResizeHandler={true}
            />
          </div>
          <div id="myDiv" style={{ position:'fixed', display:'inline', float:'right',width:'50%',height:window.innerHeight, overflow:'auto', backgroundColor:"white"}}>
            {this.addComponents(this.state.data)}
          </div>
        </div>
      )
    }
    //if data is not yet ready
    else{
      return(
        <div>
          Loading...
        </div>  
      )
    }
  }  
}

export default AppFinal;