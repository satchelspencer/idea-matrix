## installation/usage
 - make sure you have node and npm installed ([same package](https://nodejs.org/en/)). 
 - Include the [data directory](https://drive.google.com/open?id=0B6Fbio-CF-r8SmItTkRCakdhMDQ) in `./data`
 - in the project directory run `sudo npm install`
 - `npm run prep` at first start or whenever data changes run to generate the geojson to be consumed by the app
 - `npm run start-prod` *reccomended* builds and serves optimized version
 - `npm run build` bundles the data and app and resources into './build' (ready to put on a static webserver)
 - `npm start` creates a local webpack dev server at localhost:9999. Is not minimized and includes source map for debugging so it run very slowly


## tooling overview
[webpack](https://webpack.github.io/) is the module bundler and development server tool. It creates the distribution bundle, and runs a development server with hot module reload (when a local script changes, the app is updated in real time without refresh or a change of state). React for the UI, integrating with [react-leaflet](https://github.com/PaulLeCam/react-leaflet) for maps support. [redux](https://github.com/reactjs/redux) is the state manager for the webapp. The app is written in [es6 javascript](https://babeljs.io/docs/learn-es2015/) using babel as the transpiler.

## project structure
~~~
 -src/      react source for visualizer
  - lib/    reusable helper scripts
  - redux/  redux reducers, stores, and selectors
 -prep/     scripts for managing the data input
 -conf/     webpack configuration files and scripts
 -serve.js  runs the dev server and handles hot module reload
~~~
