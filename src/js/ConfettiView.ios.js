/*
 * @providesModule ConfettiView
 * @flow
 */


import React from "react";

import AssetHelper from 'AssetHelper';
import ParticleView from 'react-native-particle-system/ParticleView';
import ParticleCell from 'react-native-particle-system/ParticleCell';
import PropTypes from 'prop-types';
import Sizes from 'Sizes';
import _ from 'lodash';

import {
  View,
  Image,
  Dimensions,
  ViewPropTypes,
  StyleSheet,
} from 'react-native';

class ConfettiCell {
  imageName: string;
  propsSelector: string;

  constructor(keyValueSource: ?Object): ConfettiCell {
    return _.create(ConfettiCell.prototype, keyValueSource);
  }

  static make(cells:Array<ConfettiCell>): Array<*> {
    if (Array.isArray(cells)) {
      return _.map(cells, (confettiType: ConfettiCell): ConfettiCell => new ConfettiCell(confettiType));
    }
    return [];
  }
}

const CONFETTI_CELLS = ConfettiCell.make([
  {
    imageName: "gfx_confetti_particle.png",
  },
  {
    imageName: "gfx_swirl_confetti.png",
  }
]);

const MAX_BIRTH_RATE = 1200;
const MAX_BIRTH_RATE_PER_CELL = (MAX_BIRTH_RATE / CONFETTI_CELLS.length);
const MAX_RATE_DURATION = 300;
const BURST_LENGTH_MS = 600;
const BIRTH_RATE_CHANGE_INTERVAL_MS = 10;

export default class ConfettiView extends React.Component {

  static propTypes = {
    style: ViewPropTypes.style,
  };

  constructor(props: Object) {
    super(props);

    this.window = Dimensions.get('window');

    this.state = {
      dynamicBirthrate: 0,
    };
  }

  componentDidMount() {
    this.yPos = this._getYPosition();
    this._beginBirthRateArc();
  }

  _beginBirthRateArc() {
    this._stopBirthrateArc();
    this._birthrateInterval = setInterval(() => {
      const rateChange = MAX_BIRTH_RATE_PER_CELL / ((BURST_LENGTH_MS/2)/BIRTH_RATE_CHANGE_INTERVAL_MS);
      const newRate = this._hasReachedMax ? rateChange * (-1) : rateChange;
      this.setState({
        dynamicBirthrate: this.state.dynamicBirthrate + newRate,
      }, () => {
        this._checkArcChangeConditions();
      });
    }, BIRTH_RATE_CHANGE_INTERVAL_MS);
  }

  _checkArcChangeConditions() {
    if (this.state.dynamicBirthrate >= MAX_BIRTH_RATE_PER_CELL) {
      this._hasReachedMax = true;
      clearInterval(this._birthrateInterval);
      this._birthrateInterval = null;
      setTimeout(() => {
        this._beginBirthRateArc(); // Continue
      }, MAX_RATE_DURATION);
    } else if (this.state.dynamicBirthrate < 0) {
      this._stopBirthrateArc();
    }
  }

  _stopBirthrateArc() {
    if (this._birthrateInterval) {
      clearInterval(this._birthrateInterval);
      this._hasReachedMax = false;
      this._birthrateInterval = null;
      this.setState({
        dynamicBirthrate: 0,
      });
    }
  }

  _getSpiralBurstCellProps(): * {
    return {
      name: "back_confetti",
      enabled: true,
      contentsRect: {x: 0.0, y: 0.0, width: 1.0, height: 1.0},
      contentsScale: 1.0,
      magnificationFilter: 'linear', minificationFilter : 'linear', minificationFilterBias: 0.00,
      color: 'rgba(100,100,100,225)',
      redRange: 1.00,	greenRange: 1.00, blueRange: 1.00, alphaRange: 1.0,
      redSpeed: 0.10, greenSpeed: 0.10, blueSpeed: 0.10, alphaSpeed: -.1,
      lifetime: 10000.0,
      lifetimeRange: 3000,
      xAcceleration: 0,
      zAcceleration: 0.00,
      // these values are in radians, in the UI they are in degrees
      spin: 0.0,
      spinRange: 4.7,
      emissionLatitude: 0.0,
      emissionLongitude: 4.712,
      emissionRange: 0.872,
      ...Sizes.select({
        phone: {
          scale: .25,
          scaleRange: .25,
          scaleSpeed: 0.05,
          velocity: 300,
          velocityRange: 150,
          yAcceleration: 150.00,
        },
        tablet: {
          scale: .7,
          scaleRange: .7,
          scaleSpeed: 0.05,
          velocity: 600,
          velocityRange: 250,
          yAcceleration: 300.00,
        }
      })
    };
  }

  // _getFrontRainCellProps(): * {
  //   return {
  //     name: "front_confetti",
  //     birthRate: (this.state.dynamicBirthrate - 20) / 11,
  //     enabled: true,
  //     contentsRect: {x: 0.0, y: 0.0, width: 1.0, height: 1.0},
  //     contentsScale: 1.0,
  //     magnificationFilter: 'linear', minificationFilter : 'linear', minificationFilterBias: 0.00,
  //     color: 'rgba(100,100,100,225)',
  //     redRange: 1.0,	greenRange: 1.0, blueRange: 1.0, alphaRange: 0.25,
  //     redSpeed: 0.05, greenSpeed: 0.05, blueSpeed: 0.05, alphaSpeed: 0.025,
  //     lifetime: 10000.0,
  //     lifetimeRange: 3000,
  //     zAcceleration: 10,
  //     // these values are in radians, in the UI they are in degrees
  //     spin: 0.2,
  //     spinRange: 4.7,
  //     emissionLatitude: 0.0,
  //     emissionLongitude: 3.14159,
  //     emissionRange: 0.5,
  //     ...Sizes.select({
  //       phone: {
  //         scale: .35,
  //         scaleRange: .15,
  //         scaleSpeed: -0.01,
  //         velocity: 60,
  //         velocityRange: 140,
  //         yAcceleration: 40.00,
  //       },
  //       tablet: {
  //         scale: .8,
  //         scaleRange: .3,
  //         scaleSpeed: -0.05,
  //         velocity: 110,
  //         velocityRange: 70,
  //         yAcceleration: 60.00,
  //       }
  //     })
  //   };
  // }

  _getYPosition(): number {
    return Sizes.screenHeight/2;

    /*
    Various placements for confetti emitter
    const yPlacement = Math.floor(Math.random() * 100) % 4;

    switch (yPlacement) {
      case 0: { return -100; }
      case 1: { return Sizes.screenHeight/2; }
      case 2: { return Sizes.screenHeight/2 - 100; }
      case 3: { return Sizes.screenHeight/2 + 100; }
    }
    */
  }

  _getSeed(): number {
    return Math.random() * 1000000;
  }

  _renderParticleCellsWithProps(props): Array<React.Element> {
    const particles = [];

    const imageDimensions = {
      width:31,
      height:31
    };

    const otherProps = {};
    if (props.birthRate == null) {
      otherProps.birthRate = this.state.dynamicBirthrate;
    }

    _.forEach(CONFETTI_CELLS, (confettiCell: ConfettiCell) => {
      const imgURI = AssetHelper._urlForRemoteSourceImage(confettiCell.imageName);
      particles.push(
        <ParticleCell {...props}
                      {...otherProps}
                      key={confettiCell.imageName}>
          <Image source={{uri: imgURI}}
                 style={{width: imageDimensions.width, height: imageDimensions.height}}
                 resizeMode={'contain'}/>
        </ParticleCell>
      );
    });

    return particles;
  }

  // renderDifferentConfetti(): * {

  //   return (
  //     <ParticleView style={StyleSheet.absoluteFill}
  //                   name={'confetti_emitter_front_layer'}
  //                   emitterPosition={emitterPos}
  //                   emitterZPosition={0}
  //                   emitterSize={{ width: Sizes.screenWidth, height: 1}}
  //                   emitterShape={'line'}
  //                   emitterMode={'volume'}
  //                   emitterDepth={0}
  //                   useCurrentMediaTime={true}
  //                   renderMode={'additive'}
  //                   seed={this._getSeed()}
  //                   pointerEvents={'none'}>
  //       {this._renderParticleCellsWithProps(this._getFrontRainCellProps())}
  //     </ParticleView>
  //   );
  // }

  render(): React.Element {
    return (
      <View style={this.props.style}>
        <ParticleView style={StyleSheet.absoluteFill}
                      name={'confetti_emitter_back_layer'}
                      emitterPosition={emitterPos}
                      emitterZPosition={0}
                      emitterSize={{ width: 60, height: 60}}
                      emitterShape={'sphere'}
                      emitterMode={'outline'}
                      emitterDepth={0}
                      useCurrentMediaTime={true}
                      renderMode={'additive'}
                      seed={this._getSeed()}>
          {this._renderParticleCellsWithProps(this._getSpiralBurstCellProps())}
        </ParticleView>
      </View>
    );
  }
}
