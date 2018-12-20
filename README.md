# PlotlyApp
Plotly React App, built using create-react-app

TO INSTALL AND RUN:
1. clone repo into local folder
2. cd into PlotlyApp directory
2. run npm install
3. run npm start
4. wait for development server to start
5. open http://localhost:3000/ in browser

NOTES:

-json data files must be stored in the 'public' folder

-to add new data files, add to the public folder then add the following line to 'public/index.html' <link rel="application/json" href="%PUBLIC_URL%/[name_of_file].json">

-the react component 'AppFinal' is mounted via 'src/App.js', the component takes 2 props:
    
    1. dataFile: json file containing data for a scatter plot trace of each cell, see 'public/striatum_f410_traces.json for example'
    
    2. contourFile: json file containing data to plot contour of each cell, see 'public/striatum_f410_contours.json for example'

-if App is showing loading screen for a long time, refresh page.
