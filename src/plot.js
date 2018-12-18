import React from 'react';
import Plot from 'react-plotly.js';

class PlotComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title:this.props.title,
      layout:{
        autosize:'true',
        height: 140, 
        title:this.props.title, 
        titlefont: {
          family: 'Courier New, monospace',
          size: 12,
          color: 'white'
        },
        showlegend: true,
        //fix
        colorway : [this.props.color], 
        xaxis:{
          title:'Time (s)',
          range: [0, this.props.max],
          titlefont: {
            family: 'Courier New, monospace',
            size: 10,
            color: 'white'
          }
        }, 
        yaxis:{
          title:'Calcium Level?',
          range: [this.props.miny, this.props.maxy],
          titlefont: {
            family: 'Courier New, monospace',
            size: 10,
            color: 'white'
          }
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
      display: 'inline'
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(){
    this.setState({display: 'none'})
    console.log('colorway',this.state.layout.colorway)
  }

  render(){
    return(
      <div>
        <Plot
          divId={this.props.divId}
          data={[
            this.props.data,
          ]}
          style={{display: this.state.display,width: '100%', float: 'right'}}
          layout={this.state.layout}
          config={{displaylogo: false}}
          useResizeHandler={true}
        />
      </div>   
    );
  }
}
export default PlotComponent
/*
      <div>
        <Button style={{display: this.state.display,backgroundColor:'white'}} icon compact size='mini' onClick={this.handleClose}>
          <Icon name='close'/>
        </Button>
        <Plot
          divId={this.props.divId}
          data={[
            this.props.data,
          ]}
          style={{display: this.state.display,width: '100%', float: 'right'}}
          layout={this.state.layout}
          config={{displaylogo: false}}
          useResizeHandler={true}
        /> 
      </div>
      */