var React = require('react');
var ReactTestUtils = require('react-addons-test-utils');
var ScrollableContainer = require('../app/ScrollableContainer.jsx');


describe('ScrollableContainer', function() {
    function makeContainerInstance(props) {
        return <ScrollableContainer
                  elements={ props.elements }
                  containerStyle={ props.containerStyle }
                  noDragStyle={ props.noDragStyle }
                  dragStyle={ props.dragStyle }
                  dragClass={ props.dragClass }
                  noDragClass={ props.noDragClass }
                  containerClass={ props.containerClass }
                  handleStyle={ props.handleStyle }
                  handleClass={ props.handleClass }
                  elementMargin={ props.elementMargin }
               />;
    }


    describe('#getElementLeftFromIndex', function() {
        var props = {
            elements: [0,1,2,3,4,5,6,7,8];
        };
        var containerInstance = makeContainerInstance(props);

        it('should space each element at 100px intervals', function() {
            props.elements.forEach(function(elt, i) {
                assert.equal(i*100, containerInstance.getNoDragStyle({}, i).left,
                    "left style value should equal index times 100");
            });
        });
    });
});
