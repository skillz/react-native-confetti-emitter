/*
 * @providesModule ConfettiView
 * @flow
 */
import React from 'react';

import PropTypes from 'prop-types';

import {
    View,
    ViewPropTypes,
    requireNativeComponent
} from 'react-native';

const Confetti = requireNativeComponent('ConfettiView');

const propTypes = {
  ...ViewPropTypes,
  style: ViewPropTypes.style,
  colors: PropTypes.array,
  emissionArea: PropTypes.object,
  emissionDirection: PropTypes.object,
  emissionSpeed: PropTypes.object,
  enableFadeOut: PropTypes.bool,
  lifeSpanOfParticle: PropTypes.number,
  numParticlesPerSec: PropTypes.number,
  duration: PropTypes.number,
  particleSizeAndMass: PropTypes.object,
};

const defaultProps = {
  colors: ['#e6beff', '#aaffc3', '#ffd8b1', '#008080'],
  direction: {
    start: 175,
    end: 359
   }, //direction in degrees starting from 0 on the right
  speed: {
    min: 4,
    max: 7
  }, //range of speed for confetti particles
  fadeOutEnabled: true,
  setTimeToLive: 3000,
  sizeMass: {
    size: 8,
    mass: 6
  }, //size and mass of the particles
  numParticlesPerSec: 150,
  duration: 2000, //in milliseconds
}

const viewConfig = {
  uiViewClassName: 'ConfettiView',
}

class ConfettiView extends React.Component {
  constructor(props) {
    super(props);
    // this.colors = {
    //   RED:'#e6194b',
    //   GREEN:'#3cb44b',
    //   YELLOW:'#ffe119',
    //   BLUE:'#4363d8',
    //   ORANGE:'#f58231',
    //   PURPLE:'#911eb4',
    //   CYAN:'#46f0f0',
    //   MAGENTA:'#f032e6',
    //   LIME:'#bcf60c',
    //   PINK:'#fabebe',
    //   TEAL:'#008080',
    //   LAVENDER:'#e6beff',
    //   BROWN:'#9a6324',
    //   BEIGE:'#fffac8',
    //   MAROON:'#800000',
    //   MINT:'#aaffc3',
    //   OLIVE:'#808000',
    //   APRICOT:'#ffd8b1',
    //   NAVY:'#000075',
    //   GREY:'#808080',
    //   WHITE:'#ffffff',
    //   BLACK:'#000000'
    // };
  }

  // initRandomThings() {
  //   const colors = this.colors;   
  // leaving out the positionOfEmission prop will use the default location which is a small bar on top of the view.

  //   const width = Dimensions.get('screen').width * Dimensions.get('screen').scale;
  //   const height = Dimensions.get('screen').height * Dimensions.get('screen').scale;
    
  //   const position = {
  //     minX: width / 6,
  //     maxX: width / 6 * 5,
  //     minY: height / 8,
  //     maxY: height / 7 * 4,
  //   };
  // }

  render(): React.Element {
    return (
      <View>
        <Confetti style={[{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}, this.props.style]}
                  colors={this.props.colors}
                  positionOfEmission={this.props.emissionArea}
                  direction={this.props.emissionDirection} //direction in degrees starting from 0 on the right
                  speed={this.props.emissionSpeed} //range of speed for confetti particles
                  fadeOutEnabled={this.props.enableFadeOut}
                  setTimeToLive={this.props.lifeSpanOfParticle}
                  sizeMass={this.props.particleSizeAndMass} //size and mass of the particles
                  numParticlesPerSec={this.props.numParticlesPerSec}
                  duration={this.props.duration} //in milliseconds
        />
      </View>
    );
  }

}
  