# PointClustering

User Widget for CMV - The Configurable Map Viewer (version 1.3.4)

https://github.com/odoe/esri-clusterfeaturelayer

Settings:

Assume the sublayers are all points layers.

        operationalLayers: [
        {
            type: 'dynamic',
            url: 'https://gis.AAAAA.net/AAArmgis/rest/services/AAFacilities/Facilities_Prgm/MapServer',
            title: 'Facilities',
            options: {
                id: 'Facilities',
                opacity: 1.0,
                visible: false,
                imageParameters: imageParameters
            },
            identifyLayerInfos: {
                layerIds: [0, 1, 2, 3, 4, 5, 6]
            },
            layerControlLayerInfos: {
                metadataUrl: true,
                menu: [{
                      label: 'PointClustering',
                      topic: 'clusterMap',
                      iconClass: 'fa fa-search fa-fw'
                  },{
                      label: 'Remove PointClustering',
                      topic: 'removeClusterMap',
                      iconClass: 'fa fa-search fa-fw'
                  }]              
            }
        }]

add the invisible widget

            clusterMap: {
                include: true,
                id: 'clusterMap',
                type: 'invisible', //titlePane, invisible
                canFloat: true,
                title: '<i class="icon-large icon-road"></i>&nbsp;&nbsp;clusterMap',
                path: 'widgets/PointClustering',
                position: 30,
                open: false,
                options: {
                    map: true,
                }
            }
            
Copy both PointClustering.js and folder PointClustering to widgets folder.

User should be able to init the method from the sublayer menu item to either create Cluster map to remove it

http://postimg.org/image/5a1geo4yd/
