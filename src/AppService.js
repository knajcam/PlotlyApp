//find max y value for each trace, used for setting the scale of the individual plots
export default function findMax(data,dataLength){
  var maxy=[];
  for(var i=0;i<dataLength;i++){
    maxy[i]=Math.max(...data[i].y)
  }
  return maxy;
};

//find min y value for each trace, used for setting the scale of the individual plots
export const findMin=(data,dataLength)=>{
  var miny=[];
  for(var i=0;i<dataLength;i++){
    miny[i]=Math.min(...data[i].y)
  }
  return miny
}