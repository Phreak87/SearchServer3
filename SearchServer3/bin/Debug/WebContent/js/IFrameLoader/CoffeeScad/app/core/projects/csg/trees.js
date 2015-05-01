(function() {
  define(function(require) {
    var Node, PolygonTreeNode, Tree, globals, _CSGDEBUG;
    globals = require('./globals');
    _CSGDEBUG = globals._CSGDEBUG;
    PolygonTreeNode = (function() {
      function PolygonTreeNode() {
        this.parent = null;
        this.children = [];
        this.polygon = null;
        this.removed = false;
      }

      PolygonTreeNode.prototype.addPolygons = function(polygons) {
        var polygon, _i, _len, _results;
        if (!this.isRootNode()) {
          throw new Error("Assertion failed");
        }
        _results = [];
        for (_i = 0, _len = polygons.length; _i < _len; _i++) {
          polygon = polygons[_i];
          _results.push(this.addChild(polygon));
        }
        return _results;
      };

      PolygonTreeNode.prototype.remove = function() {
        var i, parentschildren;
        if (!this.removed) {
          this.removed = true;
          if (_CSGDEBUG) {
            if (this.isRootNode()) {
              throw new Error("Assertion failed");
            }
            if (this.children.length) {
              throw new Error("Assertion failed");
            }
          }
          parentschildren = this.parent.children;
          i = parentschildren.indexOf(this);
          if (i < 0) {
            throw new Error("Assertion failed");
          }
          parentschildren.splice(i, 1);
          return this.parent.recursivelyInvalidatePolygon();
        }
      };

      PolygonTreeNode.prototype.isRemoved = function() {
        return this.removed;
      };

      PolygonTreeNode.prototype.isRootNode = function() {
        return !this.parent;
      };

      PolygonTreeNode.prototype.invert = function() {
        if (!this.isRootNode()) {
          throw new Error("Assertion failed");
        }
        return this.invertSub();
      };

      PolygonTreeNode.prototype.getPolygon = function() {
        if (!this.polygon) {
          throw new Error("Assertion failed");
        }
        return this.polygon;
      };

      PolygonTreeNode.prototype.getPolygons = function(result) {
        var child, childpolygons, polygon, _i, _j, _len, _len1, _ref, _results;
        if (this.polygon) {
          return result.push(this.polygon);
        } else {
          childpolygons = [];
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            child.getPolygons(childpolygons);
          }
          _results = [];
          for (_j = 0, _len1 = childpolygons.length; _j < _len1; _j++) {
            polygon = childpolygons[_j];
            _results.push(result.push(polygon));
          }
          return _results;
        }
      };

      PolygonTreeNode.prototype.splitByPlane = function(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
        var backnode, bound, child, children, d, frontnode, numchildren, planenormal, polygon, spherecenter, sphereradius, splitresult, _i, _len, _results;
        children = this.children;
        numchildren = children.length;
        if (numchildren > 0) {
          _results = [];
          for (_i = 0, _len = children.length; _i < _len; _i++) {
            child = children[_i];
            _results.push(child.splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes));
          }
          return _results;
        } else {
          polygon = this.polygon;
          if (polygon) {
            bound = polygon.boundingSphere();
            sphereradius = bound[1] + 1e-4;
            planenormal = plane.normal;
            spherecenter = bound[0];
            d = planenormal.dot(spherecenter) - plane.w;
            if (d > sphereradius) {
              return frontnodes.push(this);
            } else if (d < -sphereradius) {
              return backnodes.push(this);
            } else {
              splitresult = plane.splitPolygon(polygon);
              switch (splitresult.type) {
                case 0:
                  return coplanarfrontnodes.push(this);
                case 1:
                  return coplanarbacknodes.push(this);
                case 2:
                  return frontnodes.push(this);
                case 3:
                  return backnodes.push(this);
                case 4:
                  if (splitresult.front) {
                    frontnode = this.addChild(splitresult.front);
                    frontnodes.push(frontnode);
                  }
                  if (splitresult.back) {
                    backnode = this.addChild(splitresult.back);
                    return backnodes.push(backnode);
                  }
              }
            }
          }
        }
      };

      PolygonTreeNode.prototype.addChild = function(polygon) {
        var newchild;
        newchild = new PolygonTreeNode();
        newchild.parent = this;
        newchild.polygon = polygon;
        this.children.push(newchild);
        return newchild;
      };

      PolygonTreeNode.prototype.invertSub = function() {
        var child, _i, _len, _ref, _results;
        if (this.polygon) {
          this.polygon = this.polygon.flipped();
        }
        _ref = this.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(child.invertSub());
        }
        return _results;

        /*
        @children.map (child) ->
          child.invertSub()
         */
      };

      PolygonTreeNode.prototype.recursivelyInvalidatePolygon = function() {
        if (this.polygon) {
          this.polygon = null;
          if (this.parent) {
            return this.parent.recursivelyInvalidatePolygon();
          }
        }
      };

      return PolygonTreeNode;

    })();
    Tree = (function() {
      function Tree(polygons) {
        this.polygonTree = new PolygonTreeNode();
        this.rootnode = new Node(null);
        if (polygons) {
          this.addPolygons(polygons);
        }
      }

      Tree.prototype.invert = function() {
        this.polygonTree.invert();
        return this.rootnode.invert();
      };

      Tree.prototype.clipTo = function(tree, alsoRemovecoplanarFront) {
        alsoRemovecoplanarFront = (alsoRemovecoplanarFront ? true : false);
        return this.rootnode.clipTo(tree, alsoRemovecoplanarFront);
      };

      Tree.prototype.allPolygons = function() {
        var result;
        result = [];
        this.polygonTree.getPolygons(result);
        return result;
      };

      Tree.prototype.addPolygons = function(polygons) {
        var polygontreenodes, _this;
        _this = this;
        polygontreenodes = polygons.map(function(p) {
          return _this.polygonTree.addChild(p);
        });
        return this.rootnode.addPolygonTreeNodes(polygontreenodes);
      };

      return Tree;

    })();
    Node = (function() {
      function Node(parent) {
        this.plane = null;
        this.front = null;
        this.back = null;
        this.polygontreenodes = [];
        this.parent = parent;
      }

      Node.prototype.invert = function() {
        var temp;
        if (this.plane) {
          this.plane = this.plane.flipped();
        }
        if (this.front) {
          this.front.invert();
        }
        if (this.back) {
          this.back.invert();
        }
        temp = this.front;
        this.front = this.back;
        return this.back = temp;
      };

      Node.prototype.clipPolygons_recursive = function(polygontreenodes, alsoRemovecoplanarFront) {
        var backnodes, coplanarfrontnodes, frontnodes, i, node, numbacknodes, plane, _i, _j, _len, _results;
        if (this.plane) {
          backnodes = [];
          frontnodes = [];
          coplanarfrontnodes = (alsoRemovecoplanarFront ? backnodes : frontnodes);
          plane = this.plane;
          for (_i = 0, _len = polygontreenodes.length; _i < _len; _i++) {
            node = polygontreenodes[_i];
            if (!(node.isRemoved())) {
              node.splitByPlane(plane, coplanarfrontnodes, backnodes, frontnodes, backnodes);
            }
          }
          console.log("backnodes " + backnodes.length);
          console.log("frontnodes " + frontnodes.length);
          if (this.front && (frontnodes.length > 0)) {
            this.front.clipPolygons_recursive(frontnodes, alsoRemovecoplanarFront);
          }
          numbacknodes = backnodes.length;
          if (this.back && (numbacknodes > 0)) {
            return this.back.clipPolygons_recursive(backnodes, alsoRemovecoplanarFront);
          } else {
            console.log("remvoving " + numbacknodes + " elements");
            _results = [];
            for (i = _j = 0; 0 <= numbacknodes ? _j < numbacknodes : _j > numbacknodes; i = 0 <= numbacknodes ? ++_j : --_j) {
              _results.push(backnodes[i].remove());
            }
            return _results;
          }
        }
      };

      Node.clipPolygons = function(currentNode, polygontreenodes, alsoRemovecoplanarFront) {
        var back, backnodes, coplanarfrontnodes, front, frontnodes, i, node, numBackNodes, numFrontNodes, plane, stack, treeNodes, _i, _len, _ref, _results;
        stack = [];
        stack.push([currentNode, polygontreenodes]);
        _results = [];
        while (stack.length > 0) {
          _ref = stack.pop(), currentNode = _ref[0], treeNodes = _ref[1];
          if (currentNode.plane) {
            backnodes = [];
            frontnodes = [];
            coplanarfrontnodes = (alsoRemovecoplanarFront ? backnodes : frontnodes);
            plane = currentNode.plane;
            for (_i = 0, _len = treeNodes.length; _i < _len; _i++) {
              node = treeNodes[_i];
              if (!(node.isRemoved())) {
                node.splitByPlane(plane, coplanarfrontnodes, backnodes, frontnodes, backnodes);
              }
            }
            front = currentNode.front;
            numFrontNodes = frontnodes.length;
            if (front && (numFrontNodes > 0)) {
              stack.push([front, frontnodes]);
            }
            back = currentNode.back;
            numBackNodes = backnodes.length;
            if (back && (numBackNodes > 0)) {
              _results.push(stack.push([back, backnodes]));
            } else {
              _results.push((function() {
                var _j, _results1;
                _results1 = [];
                for (i = _j = 0; 0 <= numBackNodes ? _j < numBackNodes : _j > numBackNodes; i = 0 <= numBackNodes ? ++_j : --_j) {
                  _results1.push(backnodes[i].remove());
                }
                return _results1;
              })());
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Node.prototype.clipTo = function(tree, alsoRemovecoplanarFront) {
        if (this.polygontreenodes.length > 0) {
          Node.clipPolygons(tree.rootnode, this.polygontreenodes, alsoRemovecoplanarFront);
        }
        if (this.front) {
          this.front.clipTo(tree, alsoRemovecoplanarFront);
        }
        if (this.back) {
          return this.back.clipTo(tree, alsoRemovecoplanarFront);
        }
      };

      Node.prototype.clipTo_recursive = function(tree, alsoRemovecoplanarFront) {
        if (this.polygontreenodes.length > 0) {
          tree.rootnode.clipPolygons_recursive(this.polygontreenodes, alsoRemovecoplanarFront);
        }
        if (this.front) {
          this.front.clipTo(tree, alsoRemovecoplanarFront);
        }
        if (this.back) {
          return this.back.clipTo(tree, alsoRemovecoplanarFront);
        }
      };

      Node.prototype.addPolygonTreeNodes = function(polygontreenodes) {
        var backnodes, bestplane, frontnodes, polygonTreeNode, _i, _len, _this;
        if (polygontreenodes.length === 0) {
          return;
        }
        _this = this;
        if (!this.plane) {
          bestplane = polygontreenodes[0].getPolygon().plane;
          this.plane = bestplane;
        }
        frontnodes = [];
        backnodes = [];
        for (_i = 0, _len = polygontreenodes.length; _i < _len; _i++) {
          polygonTreeNode = polygontreenodes[_i];
          polygonTreeNode.splitByPlane(_this.plane, _this.polygontreenodes, backnodes, frontnodes, backnodes);
        }
        if (frontnodes.length > 0) {
          if (!this.front) {
            this.front = new Node(this);
          }
          this.front.addPolygonTreeNodes(frontnodes);
        }
        if (backnodes.length > 0) {
          if (!this.back) {
            this.back = new Node(this);
          }
          return this.back.addPolygonTreeNodes(backnodes);
        }
      };

      Node.prototype.getParentPlaneNormals = function(normals, maxdepth) {
        if (maxdepth > 0) {
          if (this.parent) {
            normals.push(this.parent.plane.normal);
            return this.parent.getParentPlaneNormals(normals, maxdepth - 1);
          }
        }
      };

      return Node;

    })();
    return {
      "PolygonTreeNode": PolygonTreeNode,
      "Tree": Tree,
      "Node": Node
    };
  });

}).call(this);
