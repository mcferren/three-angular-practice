System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FDirectionService, Drawing, _self, Layout;
    function Graph(options) {
        this.options = options || {};
        this.nodeSet = {};
        this.nodes = [];
        this.edges = [];
        this.layout;
    }
    function Node(node_id) {
        this.id = node_id;
        this.nodesTo = [];
        this.nodesFrom = [];
        this.position = {};
        this.data = {};
    }
    function Edge(source, target) {
        this.source = source;
        this.target = target;
        this.data = {};
    }
    return {
        setters:[],
        execute: function() {
            THREE = THREE;
            // import Chance = Chance;
            FDirectionService = (function () {
                function FDirectionService() {
                }
                FDirectionService.prototype.init = function (container, emitter) {
                    // console.log("CHANCE WORKS?", chance.ip());
                    new Drawing.SimpleGraph({
                        layout: '3d',
                        selection: true,
                        numNodes: 30,
                        graphLayout: { attraction: 5, repulsion: 0.5 },
                        showInfo: true,
                        container: container,
                        emitter: emitter
                    });
                };
                FDirectionService.prototype.rollWhiteList = function (label) {
                    var cur = [];
                    _self.graphstore.nodes.map(function (outer_element) {
                        cur.push(outer_element.id.indexOf(label) + ":::" + outer_element.id + " indexOf " + label);
                        if (!outer_element.id.includes(label)) {
                            // if( parseInt( outer_element.id.indexOf( label )) < 0 ) {
                            // _self.scene.remove( outer_element.data.draw_object );
                            outer_element.data.draw_object.visible = false;
                            // cur.push( outer_element );
                            outer_element.nodesTo.map(function (inner_element) {
                                // cur.push( _self.graphstore.edges[ inner_element.edge_index ].target.data.draw_object );
                                // _self.scene.remove( _self.graphstore.edges[ inner_element.edge_index ].target.draw_object );
                            });
                        }
                        else {
                            // _self.scene.add( outer_element.data.draw_object ); 
                            outer_element.data.draw_object.visible = true;
                            outer_element.nodesTo.map(function (inner_element) {
                                // _self.scene.add( _self.graphstore.edges[ inner_element.edge_index ].target.data.draw_object );
                            });
                        }
                    });
                    // console.log("TRAIN label", label);
                    console.log("CUR", cur);
                    console.log("TRAIN graphstore", _self.graphstore);
                };
                return FDirectionService;
            }());
            exports_1("FDirectionService", FDirectionService);
            Graph.prototype.addNode = function (node) {
                if (this.nodeSet[node.id] == undefined && !this.reached_limit()) {
                    this.nodeSet[node.id] = node;
                    this.nodes.push(node);
                    return true;
                }
                return false;
            };
            Graph.prototype.getNode = function (node_id) {
                return this.nodeSet[node_id];
            };
            Graph.prototype.addEdge = function (source, target) {
                var edge = new Edge(source, target);
                if (source.addConnectedTo(target, edge, this.edges.length) === true) {
                    this.edges.push(edge);
                    return this.edges.length; // index
                }
                return false;
            };
            Graph.prototype.reached_limit = function () {
                if (this.options.limit != undefined)
                    return this.options.limit <= this.nodes.length;
                else
                    return false;
            };
            Node.prototype.addConnectedTo = function (node, edge, edge_index) {
                if (this.connectedTo(node) === false) {
                    this.nodesTo.push({
                        node: node,
                        edge: edge,
                        edge_index: edge_index
                    });
                    return true;
                }
                return false;
            };
            Node.prototype.connectedTo = function (node) {
                for (var i = 0; i < this.nodesTo.length; i++) {
                    var connectedNode = this.nodesTo[i];
                    if (connectedNode.id == node.id) {
                        return true;
                    }
                }
                return false;
            };
            Drawing = Drawing || {};
            _self = this;
            Drawing.SimpleGraph = function (options) {
                var options = options || {};
                this.layout = options.layout || "2d";
                this.layout_options = options.graphLayout || {};
                this.show_info = options.showInfo || false;
                this.show_labels = options.showLabels || false;
                this.selection = options.selection || false;
                this.limit = options.limit || 10;
                this.nodes_count = options.numNodes || 20;
                this.edges_count = options.numEdges || 10;
                var camera, controls, renderer, interaction, geometry, object_selection;
                var info_text = {};
                _self.graphstore = new Graph({ limit: options.limit });
                var geometries = [];
                var that = this;
                init();
                createGraph();
                console.log("PSEUDO GRAPHSTORE", _self.graphstore);
                animate();
                function init() {
                    // Three.js initialization
                    renderer = new THREE.WebGLRenderer({ alpha: true });
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000000);
                    camera.position.z = 5000;
                    options.container.appendChild(renderer.domElement);
                    controls = new THREE.TrackballControls(camera, renderer.domElement);
                    controls.rotateSpeed = 0.5;
                    controls.zoomSpeed = 5.2;
                    controls.panSpeed = 1;
                    controls.noZoom = false;
                    controls.noPan = false;
                    controls.staticMoving = false;
                    controls.dynamicDampingFactor = 0.3;
                    controls.keys = [65, 83, 68];
                    controls.addEventListener('change', render);
                    _self.scene = new THREE.Scene();
                    // Node geometry
                    if (that.layout === "3d") {
                        geometry = new THREE.BoxGeometry(25, 25, 25);
                    }
                    else {
                        geometry = new THREE.BoxGeometry(50, 50, 0);
                    }
                    // Create node selection, if set
                    if (that.selection) {
                        object_selection = new THREE.ObjectSelection({
                            domElement: renderer.domElement,
                            selected: function (obj) {
                                // display info
                                if (obj != null) {
                                    if (_self.graphstore.nodes[parseInt(obj.id)] != null) {
                                        info_text.select = _self.graphstore.nodes[parseInt(obj.id)].id;
                                    }
                                }
                                else {
                                    delete info_text.select;
                                }
                            },
                            clicked: function (obj) {
                                // options.emitter.next( obj.id );
                            },
                            rightclicked: function (obj) {
                                if (_self.graphstore.nodes[parseInt(obj.id)]) {
                                    options.emitter.next(_self.graphstore.nodes[parseInt(obj.id)].id);
                                }
                                else {
                                    console.log("ip wasn't printed");
                                }
                            }
                        });
                    }
                    // Create info box
                    if (that.show_info) {
                        var info = document.createElement("div");
                        var id_attr = document.createAttribute("id");
                        id_attr.nodeValue = "graph-info";
                        info.setAttributeNode(id_attr);
                        document.body.appendChild(info);
                    }
                }
                /**
                 *  Creates a graph with random nodes and edges.
                 *  Number of nodes and edges can be set with
                 *  numNodes and numEdges.
                 */
                function createGraph() {
                    var rootip_string = chance.ip();
                    var node = new Node(rootip_string);
                    node.data.title = "This is node " + node.id;
                    _self.graphstore.addNode(node);
                    drawNode(node);
                    var nodes = [];
                    nodes.push(node);
                    var steps = 1;
                    while (nodes.length != 0 && steps < that.nodes_count) {
                        var node = nodes.shift();
                        var numEdges = randomFromTo(1, that.edges_count);
                        for (var i = 1; i <= numEdges; i++) {
                            var ipaddress_string = chance.ip();
                            var target_node = new Node(ipaddress_string);
                            if (_self.graphstore.addNode(target_node)) {
                                target_node.data.title = "This is node " + target_node.id;
                                drawNode(target_node);
                                nodes.push(target_node);
                                var edge_index = _self.graphstore.addEdge(node, target_node);
                                if (edge_index != false) {
                                    drawEdge(node, target_node, edge_index);
                                }
                            }
                        }
                        steps++;
                    }
                    that.layout_options.width = that.layout_options.width || 2000;
                    that.layout_options.height = that.layout_options.height || 2000;
                    that.layout_options.iterations = that.layout_options.iterations || 100000;
                    that.layout_options.layout = that.layout_options.layout || that.layout;
                    _self.graphstore.layout = new Layout.ForceDirected(_self.graphstore, that.layout_options);
                    _self.graphstore.layout.init();
                    info_text.nodes = "Nodes " + _self.graphstore.nodes.length;
                    info_text.edges = "Edges " + _self.graphstore.edges.length;
                }
                /**
                 *  Create a node object and add it to the scene.
                 */
                function drawNode(node) {
                    var draw_object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, opacity: 0.5 }));
                    if (that.show_labels) {
                        if (node.data.title != undefined) {
                            var label_object = new THREE.Label(node.data.title);
                        }
                        else {
                            var label_object = new THREE.Label(node.id);
                        }
                        node.data.label_object = label_object;
                        _self.scene.add(node.data.label_object);
                    }
                    var area = 5000;
                    draw_object.position.x = Math.floor(Math.random() * (area + area + 1) - area);
                    draw_object.position.y = Math.floor(Math.random() * (area + area + 1) - area);
                    if (that.layout === "3d") {
                        draw_object.position.z = Math.floor(Math.random() * (area + area + 1) - area);
                    }
                    draw_object.userData.id = node.id;
                    node.data.draw_object = draw_object;
                    node.position = draw_object.position;
                    _self.scene.add(node.data.draw_object);
                }
                /**
                 *  Create an edge object (line) and add it to the scene.
                 */
                function drawEdge(source, target, index) {
                    var material = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: 1, linewidth: 0.5 });
                    var tmp_geo = new THREE.Geometry();
                    tmp_geo.vertices.push(source.data.draw_object.position);
                    tmp_geo.vertices.push(target.data.draw_object.position);
                    var line = new THREE.Line(tmp_geo, material, THREE.LinePieces);
                    line.scale.x = line.scale.y = line.scale.z = 1;
                    line.originalScale = 1;
                    // debugger;
                    //           _self.graphstore.edges[index].draw_object = line;
                    geometries.push(tmp_geo);
                    _self.scene.add(line);
                }
                function animate() {
                    requestAnimationFrame(animate);
                    controls.update();
                    render();
                    if (that.show_info) {
                        printInfo();
                    }
                }
                function render() {
                    // Generate layout if not finished
                    if (!_self.graphstore.layout.finished) {
                        // info_text.calc = "<span style='color: red'>Calculating layout...</span>";
                        _self.graphstore.layout.generate();
                    }
                    else {
                    }
                    // Update position of lines (edges)
                    for (var i = 0; i < geometries.length; i++) {
                        geometries[i].verticesNeedUpdate = true;
                    }
                    // Show labels if set
                    // It creates the labels when this options is set during visualization
                    if (that.show_labels) {
                        var length = _self.graphstore.nodes.length;
                        for (var i = 0; i < length; i++) {
                            var node = _self.graphstore.nodes[i];
                            if (node.data.label_object != undefined) {
                                node.data.label_object.position.x = node.data.draw_object.position.x;
                                node.data.label_object.position.y = node.data.draw_object.position.y - 100;
                                node.data.label_object.position.z = node.data.draw_object.position.z;
                                node.data.label_object.lookAt(camera.position);
                            }
                            else {
                                if (node.data.title != undefined) {
                                    var label_object = new THREE.Label(node.data.title, node.data.draw_object);
                                }
                                else {
                                    var label_object = new THREE.Label(node.id, node.data.draw_object);
                                }
                                node.data.label_object = label_object;
                                _self.scene.add(node.data.label_object);
                            }
                        }
                    }
                    else {
                        var length = _self.graphstore.nodes.length;
                        for (var i = 0; i < length; i++) {
                            var node = _self.graphstore.nodes[i];
                            if (node.data.label_object != undefined) {
                                _self.scene.remove(node.data.label_object);
                                node.data.label_object = undefined;
                            }
                        }
                    }
                    // render selection
                    if (that.selection) {
                        object_selection.render(scene, camera);
                    }
                    // render scene
                    renderer.render(_self.scene, camera);
                }
                /**
                 *  Prints info from the attribute info_text.
                 */
                function printInfo(text) {
                    var str = '';
                    for (var index in info_text) {
                        if (str != '' && info_text[index] != '') {
                            str += " - ";
                        }
                        str += info_text[index];
                    }
                    document.getElementById("graph-info").innerHTML = str;
                }
                // Generate random number
                function randomFromTo(from, to) {
                    return Math.floor(Math.random() * (to - from + 1) + from);
                }
                // Stop layout calculation
                this.stop_calculating = function () {
                    _self.graphstore.layout.stop_calculating();
                };
            };
            Layout = Layout || {};
            Layout.ForceDirected = function (graph, options) {
                var options = options || {};
                this.layout = options.layout || "2d";
                this.attraction_multiplier = options.attraction || 5;
                this.repulsion_multiplier = options.repulsion || 0.75;
                this.max_iterations = options.iterations || 1000;
                this.graph = graph;
                this.width = options.width || 200;
                this.height = options.height || 200;
                this.finished = false;
                var callback_positionUpdated = options.positionUpdated;
                var EPSILON = 0.000001;
                var attraction_constant;
                var repulsion_constant;
                var forceConstant;
                var layout_iterations = 0;
                var temperature = 0;
                var nodes_length;
                var edges_length;
                var that = this;
                // performance test
                var mean_time = 0;
                /**
                 * Initialize parameters used by the algorithm.
                 */
                this.init = function () {
                    this.finished = false;
                    temperature = this.width / 10.0;
                    nodes_length = this.graph.nodes.length;
                    edges_length = this.graph.edges.length;
                    forceConstant = Math.sqrt(this.height * this.width / nodes_length);
                    attraction_constant = this.attraction_multiplier * forceConstant;
                    repulsion_constant = this.repulsion_multiplier * forceConstant;
                };
                /**
                 * Generates the force-directed layout.
                 *
                 * It finishes when the number of max_iterations has been reached or when
                 * the temperature is nearly zero.
                 */
                this.generate = function () {
                    if (layout_iterations < this.max_iterations && temperature > 0.000001) {
                        var start = new Date().getTime();
                        // calculate repulsion
                        for (var i = 0; i < nodes_length; i++) {
                            var node_v = graph.nodes[i];
                            node_v.layout = node_v.layout || {};
                            if (i == 0) {
                                node_v.layout.offset_x = 0;
                                node_v.layout.offset_y = 0;
                                if (this.layout === "3d") {
                                    node_v.layout.offset_z = 0;
                                }
                            }
                            node_v.layout.force = 0;
                            node_v.layout.tmp_pos_x = node_v.layout.tmp_pos_x || node_v.position.x;
                            node_v.layout.tmp_pos_y = node_v.layout.tmp_pos_y || node_v.position.y;
                            if (this.layout === "3d") {
                                node_v.layout.tmp_pos_z = node_v.layout.tmp_pos_z || node_v.position.z;
                            }
                            for (var j = i + 1; j < nodes_length; j++) {
                                var node_u = graph.nodes[j];
                                if (i != j) {
                                    node_u.layout = node_u.layout || {};
                                    node_u.layout.tmp_pos_x = node_u.layout.tmp_pos_x || node_u.position.x;
                                    node_u.layout.tmp_pos_y = node_u.layout.tmp_pos_y || node_u.position.y;
                                    if (this.layout === "3d") {
                                        node_u.layout.tmp_pos_z = node_u.layout.tmp_pos_z || node_u.position.z;
                                    }
                                    var delta_x = node_v.layout.tmp_pos_x - node_u.layout.tmp_pos_x;
                                    var delta_y = node_v.layout.tmp_pos_y - node_u.layout.tmp_pos_y;
                                    if (this.layout === "3d") {
                                        var delta_z = node_v.layout.tmp_pos_z - node_u.layout.tmp_pos_z;
                                    }
                                    var delta_length = Math.max(EPSILON, Math.sqrt((delta_x * delta_x) + (delta_y * delta_y)));
                                    if (this.layout === "3d") {
                                        var delta_length_z = Math.max(EPSILON, Math.sqrt((delta_z * delta_z) + (delta_y * delta_y)));
                                    }
                                    var force = (repulsion_constant * repulsion_constant) / delta_length;
                                    if (this.layout === "3d") {
                                        var force_z = (repulsion_constant * repulsion_constant) / delta_length_z;
                                    }
                                    node_v.layout.force += force;
                                    node_u.layout.force += force;
                                    node_v.layout.offset_x += (delta_x / delta_length) * force;
                                    node_v.layout.offset_y += (delta_y / delta_length) * force;
                                    if (i == 0) {
                                        node_u.layout.offset_x = 0;
                                        node_u.layout.offset_y = 0;
                                        if (this.layout === "3d") {
                                            node_u.layout.offset_z = 0;
                                        }
                                    }
                                    node_u.layout.offset_x -= (delta_x / delta_length) * force;
                                    node_u.layout.offset_y -= (delta_y / delta_length) * force;
                                    if (this.layout === "3d") {
                                        node_v.layout.offset_z += (delta_z / delta_length_z) * force_z;
                                        node_u.layout.offset_z -= (delta_z / delta_length_z) * force_z;
                                    }
                                }
                            }
                        }
                        // calculate attraction
                        for (var i = 0; i < edges_length; i++) {
                            var edge = graph.edges[i];
                            var delta_x = edge.source.layout.tmp_pos_x - edge.target.layout.tmp_pos_x;
                            var delta_y = edge.source.layout.tmp_pos_y - edge.target.layout.tmp_pos_y;
                            if (this.layout === "3d") {
                                var delta_z = edge.source.layout.tmp_pos_z - edge.target.layout.tmp_pos_z;
                            }
                            var delta_length = Math.max(EPSILON, Math.sqrt((delta_x * delta_x) + (delta_y * delta_y)));
                            if (this.layout === "3d") {
                                var delta_length_z = Math.max(EPSILON, Math.sqrt((delta_z * delta_z) + (delta_y * delta_y)));
                            }
                            var force = (delta_length * delta_length) / attraction_constant;
                            if (this.layout === "3d") {
                                var force_z = (delta_length_z * delta_length_z) / attraction_constant;
                            }
                            edge.source.layout.force -= force;
                            edge.target.layout.force += force;
                            edge.source.layout.offset_x -= (delta_x / delta_length) * force;
                            edge.source.layout.offset_y -= (delta_y / delta_length) * force;
                            if (this.layout === "3d") {
                                edge.source.layout.offset_z -= (delta_z / delta_length_z) * force_z;
                            }
                            edge.target.layout.offset_x += (delta_x / delta_length) * force;
                            edge.target.layout.offset_y += (delta_y / delta_length) * force;
                            if (this.layout === "3d") {
                                edge.target.layout.offset_z += (delta_z / delta_length_z) * force_z;
                            }
                        }
                        // calculate positions
                        for (var i = 0; i < nodes_length; i++) {
                            var node = graph.nodes[i];
                            var delta_length = Math.max(EPSILON, Math.sqrt(node.layout.offset_x * node.layout.offset_x + node.layout.offset_y * node.layout.offset_y));
                            if (this.layout === "3d") {
                                var delta_length_z = Math.max(EPSILON, Math.sqrt(node.layout.offset_z * node.layout.offset_z + node.layout.offset_y * node.layout.offset_y));
                            }
                            node.layout.tmp_pos_x += (node.layout.offset_x / delta_length) * Math.min(delta_length, temperature);
                            node.layout.tmp_pos_y += (node.layout.offset_y / delta_length) * Math.min(delta_length, temperature);
                            if (this.layout === "3d") {
                                node.layout.tmp_pos_z += (node.layout.offset_z / delta_length_z) * Math.min(delta_length_z, temperature);
                            }
                            var updated = true;
                            node.position.x -= (node.position.x - node.layout.tmp_pos_x) / 10;
                            node.position.y -= (node.position.y - node.layout.tmp_pos_y) / 10;
                            if (this.layout === "3d") {
                                node.position.z -= (node.position.z - node.layout.tmp_pos_z) / 10;
                            }
                            // execute callback function if positions has been updated
                            if (updated && typeof callback_positionUpdated === 'function') {
                                callback_positionUpdated(node);
                            }
                        }
                        temperature *= (1 - (layout_iterations / this.max_iterations));
                        layout_iterations++;
                        var end = new Date().getTime();
                        mean_time += end - start;
                    }
                    else {
                        if (!this.finished) {
                            console.log("Average time: " + (mean_time / layout_iterations) + " ms");
                        }
                        this.finished = true;
                        return false;
                    }
                    return true;
                };
                /**
                 * Stops the calculation by setting the current_iterations to max_iterations.
                 */
                this.stop_calculating = function () {
                    layout_iterations = this.max_iterations;
                };
            };
            // class objectSelectionFactoryService {
            // create( parameters ) {
            //     return new THREE.ObjectSelection( parameters );
            // }
            // }
            THREE.ObjectSelection = function (parameters) {
                var parameters = parameters || {};
                this.domElement = parameters.domElement || document;
                // this.projector = new THREE.Projector();
                this.INTERSECTED;
                var _this = this;
                var callbackSelected = parameters.selected;
                var callbackClicked = parameters.clicked;
                var callbackRightClicked = parameters.rightclicked;
                var mouse = { x: 0, y: 0 };
                this.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
                // !!! PRIVATE
                function onDocumentMouseMove(event) {
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                }
                this.domElement.addEventListener('click', onDocumentMouseClick, false);
                // !!! PRIVATE
                function onDocumentMouseClick(event) {
                    if (_this.INTERSECTED) {
                        if (typeof callbackClicked === 'function') {
                            callbackClicked(_this.INTERSECTED);
                        }
                    }
                }
                this.domElement.addEventListener('contextmenu', onDocumentRightClick, false);
                // !!! PRIVATE
                function onDocumentRightClick(event) {
                    if (_this.INTERSECTED) {
                        if (typeof callbackRightClicked === 'function') {
                            callbackRightClicked(_this.INTERSECTED);
                        }
                    }
                }
                this.render = function (scene, camera) {
                    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
                    // // this.projector.unprojectVector( vector, camera );
                    // vector.unproject( camera );
                    // var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
                    // var intersects = raycaster.intersectObject(scene, true);
                    var raycaster = new THREE.Raycaster(); // create once
                    // var mouse       = new THREE.Vector2(); // create once
                    // mouse.x         = ( event.clientX / renderer.domElement.width ) * 2 - 1;
                    // mouse.y         = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
                    raycaster.setFromCamera(vector, camera);
                    var intersects = raycaster.intersectObjects(scene.children, true);
                    if (intersects.length > 0) {
                        if (this.INTERSECTED != intersects[0].object) {
                            if (this.INTERSECTED) {
                                this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
                            }
                            this.INTERSECTED = intersects[0].object;
                            this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
                            this.INTERSECTED.material.color.setHex(0xff0000);
                            if (typeof callbackSelected === 'function') {
                                callbackSelected(this.INTERSECTED);
                            }
                        }
                    }
                    else {
                        if (this.INTERSECTED) {
                            this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
                        }
                        this.INTERSECTED = null;
                        if (typeof callbackSelected === 'function') {
                            callbackSelected(this.INTERSECTED);
                        }
                    }
                };
            };
            // class labelFactoryService {
            // create( text, parameters ) {
            //     return new THREE.Label( text, parameters );
            // }
            // }
            THREE.Label = function (text, parameters) {
                var parameters = parameters || {};
                var labelCanvas = document.createElement("canvas");
                // !!! PRIVATE
                function create() {
                    var xc = labelCanvas.getContext("2d");
                    var fontsize = "40pt";
                    // set font size to measure the text
                    xc.font = fontsize + " Arial";
                    var len = xc.measureText(text).width;
                    labelCanvas.setAttribute('width', len);
                    // set font size again cause it will be reset
                    // when setting a new width
                    xc.font = fontsize + " Arial";
                    xc.textBaseline = 'top';
                    xc.fillText(text, 0, 0);
                    var geometry = new THREE.BoxGeometry(len, 200, 0);
                    var xm = new THREE.MeshBasicMaterial({ map: new THREE.Texture(labelCanvas), transparent: true });
                    xm.map.needsUpdate = true;
                    // set text canvas to cube geometry
                    var labelObject = new THREE.Mesh(geometry, xm);
                    return labelObject;
                }
                return create();
            };
        }
    }
});
//# sourceMappingURL=fdirectionService.js.map