define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/_base/Color',
    'dojo/dom', 
    'dojo/domReady!',
    'dojo/on',
    'dojo/topic',
    'dojo/text!./PointClustering/templates/PointClustering.html',
    'esri/layers/FeatureLayer',
    'esri/InfoTemplate',
    'dojo/_base/array',
    'dojo/dom-construct',
    'xstyle/css!./PointClustering/css/PointClustering.css',

    'esri/request',
    'esri/graphic',
    'esri/geometry/Extent',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/PictureMarkerSymbol',
    'esri/renderers/ClassBreaksRenderer',
    'esri/layers/GraphicsLayer',
    'esri/SpatialReference',
    'esri/dijit/PopupTemplate',
    'esri/geometry/Point',
    'esri/geometry/webMercatorUtils',

    './PointClustering/ClusterFeatureLayer'

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, Color, dom, ready, on, topic, Template, FeatureLayer, InfoTemplate, arrayUtils, domConstruct, css, esriRequest, graphic, Extent, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, PictureMarkerSymbol, ClassBreaksRenderer, GraphicsLayer, SpatialReference, PopupTemplate, Point, webMercatorUtils, ClusterFeatureLayer) 
{
    var clusterLayer;
    var popupOptions = {
        "markerSymbol": new SimpleMarkerSymbol("circle", 20, null, new Color([0, 0, 0, 0.25])),
        "marginLeft": "20",
        "marginTop": "20"
    };

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: Template,

        postCreate: function(){
            this.inherited(arguments);
            this.initClusterLayer(this.map);
        },

        initClusterLayer: function (map) {
            topic.subscribe('LayerControl/clusterMap', function (r) {
                console.log(r.layer.url); //layer id
                console.log(r.subLayer.id); //array of set visible layer ids

                if (clusterLayer)
                    map.removeLayer(clusterLayer);

                var popupTemplate = PopupTemplate({
                    'title': ''
                    /*,
                    'fieldInfos': [{
                        'fieldName': 'TRACTCE10',
                        'label': 'Tract: ',
                        visible: true
                    }, {
                        'fieldName': 'NAME10',
                        'label': 'Name: ',
                        visible: true
                    }]
                    */
                });

                clusterLayer = new ClusterFeatureLayer({
                    'url': r.layer.url + '/' + r.subLayer.id,
                    'distance': 100,
                    'id': 'clusters',
                    'labelColor': '#fff',
                    'resolution': map.extent.getWidth() / map.width,
                    'singleColor': '#888',
                    'singleTemplate': popupTemplate,
                    'useDefaultSymbol': true,
                    'objectIdField': 'OBJECTID' // define the objectid field
                });

                var picBaseUrl = 'http://static.arcgis.com/images/Symbols/Shapes/';
                var defaultSym = new PictureMarkerSymbol(picBaseUrl + 'BluePin1LargeB.png', 32, 32).setOffset(0, 15);
                var renderer = new ClassBreaksRenderer(defaultSym, 'clusterCount');
                var sls = SimpleLineSymbol;
                var sms = SimpleMarkerSymbol;
                var small = new sms('circle', 20,
                            new sls(sls.STYLE_SOLID, new Color([255,191,0,0.25]), 15),
                            new Color([255,191,0,0.5]));
                var medium = new sms('circle', 30,
                                          new sls(sls.STYLE_SOLID, new Color([148,0,211,0.25]), 15),
                                          new Color([148,0,211,0.5]));
                var large = new sms('circle', 50,
                            new sls(sls.STYLE_SOLID, new Color([255,0,0,0.25]), 15),
                            new Color([255,0,0,0.5]));
                renderer.addBreak(2, 10, small);
                renderer.addBreak(10, 25, medium);
                renderer.addBreak(25, 5000, large);
                // Providing a ClassBreakRenderer is also optional
                //clusterLayer.setRenderer(renderer);
                map.addLayer(clusterLayer);
                // close the info window when the map is clicked
                map.on('click', cleanUp);
                // close the info window when esc is pressed
                map.on('key-down', function(e) {
                    if (e.keyCode === 27) {
                        cleanUp();
                    }
                });

                function cleanUp() {
                    map.infoWindow.hide();
                //clusterLayer.clearSingles();
                }
                function error(err) {
                    console.log('something failed: ', err);
                }
              // show cluster extents...
              // never called directly but useful from the console 
                window.showExtents = function() {
                    var extents = map.getLayer('clusterExtents');
                    if ( extents ) {
                        map.removeLayer(extents);
                    }
                    extents = new GraphicsLayer({ id: 'clusterExtents' });
                    var sym = new SimpleFillSymbol().setColor(new Color([205, 193, 197, 0.5]));
                    arrayUtils.forEach(clusterLayer._clusters, function(c, idx) {
                        var e = c.attributes.extent;
                        extents.add(new Graphic(new Extent(e[0], e[1], e[2], e[3], map.spatialReference), sym));
                    }, this);
                    map.addLayer(extents, 0);
                }


            });  

            topic.subscribe('LayerControl/removeClusterMap', function (r) {
                if (clusterLayer)
                    map.removeLayer(clusterLayer);
            }); 
                    
        },

    });
});
