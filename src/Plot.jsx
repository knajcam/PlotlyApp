import React from 'react';
import Plot from 'react-plotly.js';

//component to generate scatter plots for each cell in the 'dataFile' prop
class PlotComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      layout:{
        autosize:'true',
        height: 120, 
        title:this.props.title, 
        titlefont: {
          family: 'Courier New, monospace',
          size: 9,
          color: 'black'
        },
        showlegend: true,
        colorway : [this.props.color], 
        xaxis:{
          range: [0, this.props.max_x],
        }, 
        yaxis:{
          range: [this.props.miny, this.props.maxy],
        },
        margin: {
          l: 40,
          r: 40,
          b: 40,
          t: 40,
          pad: 4
        },
        plot_bgcolor:this.props.bgColor, 
        //paper_bgcolor:"rgba(0,0,0,0)"
      },
    };
  }

  render(){
    return(
      <div>
        <Plot
          divId={this.props.divId}
          data={[
            this.props.data,
          ]}
          style={{width: '100%', float: 'right'}}
          layout={this.state.layout}
          config={{displaylogo: false}}
          useResizeHandler={true}
        />
      </div>   
    );
  }
}
export default PlotComponent